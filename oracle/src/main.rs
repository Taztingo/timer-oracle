use tokio::time;
use serde_json;
use std::fs::File;
use web3::{
    contract::{Contract, Options},
    futures::{future, StreamExt},
    types::{FilterBuilder, Bytes, H256}
};
use web3::types::{Address};
use std::str::FromStr;

async fn create_contract(web3: &web3::Web3<web3::transports::WebSocket>, name: &str, address: &str) -> Contract<web3::transports::WebSocket> {
    let path = format!("../artifacts/contracts/{}.sol/{}.json", name, name);
    let file = File::open(path).expect("file should open read only");
    let json: serde_json::Value = serde_json::from_reader(file).expect("file should be proper JSON");
    let abi = json.get("abi").expect("Artifact should have an ABI");
    let bytes = serde_json::to_vec(abi).expect("ABI must be convertable to bytes. Invalid ABI");
    let contract_address = Address::from_str(address).expect("Invalid contract address");

    // We need to get the abi from the file
    Contract::from_json(web3.eth(), contract_address, bytes.as_slice()).expect("Unable to create a contract from supplied arguments!")
}

async fn get_event_sha(web3: &web3::Web3<web3::transports::WebSocket>, event_definition: &str) -> H256 {
    web3.web3().sha3(Bytes::from(event_definition)).await.expect("Event definition is incorrect or does not exist")
}

async fn send_transaction(contract_address: &str) -> web3::contract::Result<()> {
    println!("Sending transaction!");
    let web3 = web3::Web3::new(web3::transports::WebSocket::new("ws://localhost:8545").await?);
    let contract = create_contract(&web3, "TimerManager", contract_address).await;
    let accounts = web3.eth().accounts().await?;

    // How to get hex of the event
    let filter = FilterBuilder::default()
    .address(vec![contract.address()])
    .topics(
        None,
        None,
        None,
        None,
    )
    .build();

    let filter = web3.eth_filter().create_logs_filter(filter).await?;

    let logs_stream = filter.stream(time::Duration::from_secs(1));
    futures::pin_mut!(logs_stream);

    let tx = contract.call("start", (1_u32, false), accounts[0], Options::default()).await?;
    println!("TxHash: {}", tx);

    let _log = logs_stream.next().await.unwrap();
    //println!("got log: {:?}", log);

    //println!("Contract {:?}", contract);
    //println!("Transaction {:?}", tx);
    //println!("Contract deployed at {}", contract.address());
    
    Ok(())
}

async fn get_events(contract_address: &str) -> web3::contract::Result<()> {
    let web3 = web3::Web3::new(web3::transports::WebSocket::new("ws://localhost:8545").await?);
    let contract = create_contract(&web3, "TimerManager", contract_address).await;

    let start_timer_event = get_event_sha(&web3, "StartTimerEvent(uint256,uint256,bool,address)").await;

    // How to get hex of the event
    let _event_hex = "d282f389399565f3671145f5916e51652b60eee8e5c759293a2f5771b8ddfd2e";
    let filter = FilterBuilder::default()
    .address(vec![contract.address()])
    .topics(
        None,
        None,
        None,
        None,
    )
    .build();

    let sub = web3.eth_subscribe().subscribe_logs(filter).await?;
    sub.for_each(|log| {
        let event_name = log.unwrap().topics[0];

        if event_name == start_timer_event {
            println!("Timer Started");
        }

        // What is future::ready?
        // How do we get the event data
        future::ready(())
    }).await;

    
    Ok(())
}

#[tokio::main]
async fn main() -> web3::contract::Result<()> {
    let contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    return send_transaction(contract_address).await;
    //return get_events(contract_address).await;
}