mod types;
use types::*;
use ic_cdk::{caller};
use ic_cdk_macros::*;
use candid::{candid_method};
use ic_cdk::api::call::CallResult;
use ic_cdk::export::{
    candid::{CandidType, Deserialize},
    Principal,
};
use ic_cdk::storage;
use ic_cdk_macros::*;
use serde_bytes::ByteBuf;
use std::collections::BTreeMap;

mod address;
mod alias;
mod rand;

use crate::alias::{Alias, AliasData};
use crate::address::AddressBook;

const ANONYMOUS_SUFFIX: u8 = 4;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct TransferNotification {
    pub to: Principal,
    pub token_id: u64,
    pub from: Principal,
    pub amount: u64,
}

fn is_authorized_user() -> Result<(), String> {
    let principal = &caller();
    let bytes = principal.as_ref();

    match bytes.len() {
        1 if bytes[0] == ANONYMOUS_SUFFIX => {
            Err("Anonymous principal not allowed".to_string())
        },
        _ => Ok(()),
    }
}

fn init() {
    ic_cdk::println!("Init {:?}", ic_cdk::api::time());

    let address_book = storage::get_mut::<AddressBook>();
    address_book.total_supply = 3000;
    let owner_id =
        Principal::from_text("This is Principal-id")
            .unwrap();
    address_book.add_controller(&owner_id);

    init_alias();
}

fn init_alias() -> () {
    let alias = storage::get_mut::<Alias>();

    alias.challenger = vec![
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "z",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();

    alias.platinum = vec![
        "aa",
        "bb",
        "cb",
        "dd",
        "ee",
        "ff",
        "zz",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();

    alias.diamond = vec![
        "aaa",
        "bbb",
        "ccc",
        "ddd",
        "eee",
        "fff",
        "zzz",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();

    alias.gold = vec![
        "aaaa",
        "bbbb",
        "cccc",
        "dddd",
        "eeee",
        "ffff",
        "zzzz",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();

    alias.silver = vec![
        "aaaaa",
        "bbbbb",
        "ccccc",
        "ddddd",
        "eeeee",
        "fffff",
        "zzzzz",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();

    alias.bronze = vec![
        "aaaaaa",
        "bbbbbb",
        "cccccc",
        "dddddd",
        "eeeeee",
        "ffffff",
        "zzzzzz",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();


    let alias = storage::get_mut::<Alias>();
    *alias = Alias {
        challenger: alias.challenger.clone(),
        platinum: alias.platinum.clone(),
        diamond: alias.diamond.clone(),
        gold: alias.gold.clone(),
        silver: alias.silver.clone(),
        bronze: alias.bronze.clone(),

    }
}

#[query]
fn user_tokens(user: Principal) -> Vec<u64> {
    return storage::get::<AddressBook>().user_tokens(&user);
}

#[query]
fn supply() -> u64 {
    return storage::get::<AddressBook>().total_supply;
}

#[query]
fn remaining() -> u64 {
    return storage::get::<AddressBook>().remaining();
}

#[query]
fn owner_of(token_id: u64) -> Option<Principal> {
    return storage::get::<AddressBook>().owner_of(&token_id);
}

#[update]
fn transfer_to(user: Principal, token_id: u64) -> bool {
    return storage::get_mut::<AddressBook>().transfer_to(user, token_id);
}

#[update]
async fn transfer_with_notify(user_id: Principal, token_id: u64) -> bool {
    let address_book = storage::get_mut::<AddressBook>();
    if address_book.transfer_to(user_id, token_id) {
        match ic_cdk::call(
            user_id,
            "transfer_notification",
            (TransferNotification {
                to: user_id,
                from: ic_cdk::caller(),
                token_id: token_id,
                amount: 1,
            },),
        )
        .await as CallResult<()>
        {
            Ok(_) => return true,
            Err(_) => {
                //gets in rejected state and the next
                //line is not executed completely
                //address_book.undo_transfer(user_id, token_id);
                return false;
            }
        }
    } else {
        return false;
    }
}

#[update]
fn claim() -> Result<u64, String> {
    //return Err("No claims for this NFT type (IC DRIP)".to_string());
    return storage::get_mut::<AddressBook>().claim(ic_cdk::caller());
}

//Allow the original airdrop to always exists for future references
//where sites can use this to know if the person transferred their NFT or not.
#[query]
fn get_airdrops() -> Vec<(u64, bool)> {
    let airdroppers = storage::get_mut::<BTreeMap<Principal, Vec<u64>>>();
    let address_book = storage::get_mut::<AddressBook>();
    match airdroppers.get(&ic_cdk::caller()) {
        Some(tokens) => {
            let mut results: Vec<(u64, bool)> = Vec::new();
            for token in tokens {
                results.push((
                    token.clone(),
                    address_book.is_owner_of(ic_cdk::caller(), token),
                ));
            }
            return results;
        }
        None => Vec::new(),
    }
}

//Save list of airdrops for other platforms to use.
fn update_airdroppers(user: Principal, token_id: u64) -> () {
    let airdroppers = storage::get_mut::<BTreeMap<Principal, Vec<u64>>>();
    match airdroppers.get_mut(&user) {
        Some(tokens) => tokens.push(token_id),
        None => {
            airdroppers.insert(user, vec![token_id]);
        }
    }
}

#[update(guard = "is_controller")]
fn add_airdrops(users: Vec<Principal>) -> bool {
    let address_book = storage::get_mut::<AddressBook>();
    for id in users {
        match address_book.claim(id) {
            Ok(token_id) => update_airdroppers(id, token_id),
            Err(_) => return false,
        }
    }
    return true;
}

#[update(guard = "is_controller")]
fn add_controller(user: Principal) -> bool {
    return storage::get_mut::<AddressBook>().add_controller(&user);
}

#[update(guard = "is_controller")]
fn remove_controller(user: Principal) -> bool {
    return storage::get_mut::<AddressBook>().remove_controller(&user);
}

#[update(guard = "is_controller")]
fn get_controllers() -> Vec<Principal> {
    return storage::get::<AddressBook>().controllers.clone();
}

#[update]
fn get_cycles() -> u64 {
    return ic_cdk::api::canister_balance();
}

#[query]
fn name() -> String {
    return "DMAIL".to_string();
}

#[query]
fn symbol() -> String {
    return "DMA".to_string();
}

#[query]
fn get_address_book() -> AddressBook {
    return storage::get::<AddressBook>().clone();
}

type HeaderField = (String, String);

#[derive(Clone, Debug, CandidType, Deserialize)]
struct HttpRequest {
    method: String,
    url: String,
    headers: Vec<(String, String)>,
    body: ByteBuf,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct HttpResponse {
    status_code: u16,
    headers: Vec<HeaderField>,
    body: Vec<u8>,
}

#[query]
async fn http_request(req: HttpRequest) -> HttpResponse {
    let parts: Vec<&str> = req.url.split('?').collect();

    let token_param: Vec<&str> = parts[1].split('=').collect();
    let token_id = token_param[1].parse::<u64>().unwrap();
   



    let address_book = storage::get_mut::<AddressBook>();

    if token_id <= 0 || token_id > address_book.total_supply || !address_book.is_claimed(&token_id)
    {
        return HttpResponse {
            status_code: 404,
            headers: Vec::new(),
            body: Vec::new(),
        };
    }

    let alias = storage::get_mut::<Alias>();

    let seed = address_book.token_seeds.get(&token_id).unwrap();

    let data = alias.get_challenger(token_id.clone(),"ic.dmail.ai".to_string(),alias.challenger[1].to_string());

    let results = data.code.to_ne_bytes();

    let mut headers: Vec<HeaderField> = Vec::new();
    headers.push(("content-type".to_string(), "html/text".to_string()));
    headers.push((
        "cache-control".to_string(),
        "public, max-age=604800, immutable".to_string(),
    ));
    return HttpResponse {
        status_code: 200,
        headers,
        body: results.to_vec(),
    };
}

#[query]
fn data_of(token_id: u64) -> Vec<AliasData> {
    let address_book = storage::get::<AddressBook>();
    if token_id <= 0 || token_id > address_book.total_supply || !address_book.is_claimed(&token_id)
    {
        return Vec::new();
    }
    let seed = address_book.token_seeds.get(&token_id).unwrap();
    let alias = storage::get::<Alias>();
    return alias.get_properties(token_id + seed,"ic.dmail.ai".to_string(),alias.challenger[1].to_string());
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum DataOfQuery {
    Range(u64, u64),
    List(Vec<u64>),
}

#[query]
fn data_of_many(query: DataOfQuery) -> BTreeMap<u64, Vec<AliasData>> {
    let address_book = storage::get::<AddressBook>();
    match query {
        DataOfQuery::Range(from, to) => {
            let mut results = BTreeMap::new();
            for i in from..to + 1 {
                if !address_book.is_claimed(&i) {
                    continue;
                }
                let seed = address_book.token_seeds.get(&i).unwrap();
                let alias = storage::get::<Alias>();
                results.insert(i, alias.get_properties(i + seed,"ic.dmail.ai".to_string(),alias.challenger[1].to_string()));
            }
            return results;
        }
        DataOfQuery::List(items) => {
            let mut results = BTreeMap::new();
            for id in items {
                if !address_book.is_claimed(&id) {
                    continue;
                }
                let seed = address_book.token_seeds.get(&id).unwrap();
                let alias = storage::get::<Alias>();
                results.insert(id, alias.get_properties(id + seed,"ic.dmail.ai".to_string(),alias.challenger[1].to_string()));
            }
            return results;
        }
    }
}

#[derive(CandidType, Deserialize)]
struct StableStorage {
    address_book: AddressBook,
    airdroppers: BTreeMap<Principal, Vec<u64>>,
}

fn is_controller() -> Result<(), String> {
    if storage::get::<AddressBook>().is_controller(&ic_cdk::caller()) {
        Ok(())
    } else {
        Err("Only the controller can call this method.".to_string())
    }
}