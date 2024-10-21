use ic_cdk::export::candid::{CandidType, Deserialize};
use crate::rand::Rand;


#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct Alias {
    pub challenger: Vec<String>,
    pub diamond: Vec<String>,
    pub platinum: Vec<String>,
    pub gold: Vec<String>,
    pub silver: Vec<String>,
    pub bronze: Vec<String>,
}

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
pub struct AliasData {
    pub name: String,
    pub code: u64,
    pub token_limit: u64,
}

impl Alias {
    pub fn get_challenger(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),1)
    }
    pub fn get_diamond(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),2)
    }
    pub fn get_platinum(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),3)
    }
    pub fn get_gold(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),4)
    }
    pub fn get_silver(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),5)
    }
    pub fn get_bronze(&self, token_id: u64,name: String, domain: String) -> AliasData {
        self.generate_alias( token_id ,name, domain.to_string(),6)
    }

    pub fn generate_alias(
        &self,
        token_id: u64,
        name: String,
        domain: String,
        level: u64,
    ) -> AliasData {
        

        let mut data = AliasData::default();

        data.name = name;
        data.code = Rand::new(token_id).rand();
        data.token_limit = 0;
        if level == 1 {
            data.token_limit = 50000;
        }
        if level == 2 {
            data.token_limit = 10000;
        }
        if level == 3 {
            data.token_limit = 5000;
        }
        if level == 4 {
            data.token_limit = 2000;
        }
        if level == 5 {
            data.token_limit = 500;
        }
        if level == 6 {
            data.token_limit = 100;
        }
        
        return data;
    }

    pub fn get_properties(&self, token_id: u64, name: String, domain: String) -> Vec<AliasData> {
        return vec![
            self.get_challenger(token_id,name,domain),
            self.get_diamond(token_id,name,domain),
            self.get_platinum(token_id,name,domain),
            self.get_gold(token_id,name,domain),
            self.get_silver(token_id,name,domain),
            self.get_bronze(token_id,name,domain),
        ];
    }
}
