use std::time::SystemTime;

use crate::error::Error;
use serde::{Deserialize, Deserializer};

// This is what we used for arrays in parameters for hivefriends so we may want to use it again.
pub fn comma_string<'de, D>(deserializer: D) -> Result<Option<Vec<String>>, D::Error>
where
    D: Deserializer<'de>,
{
    let s: Option<String> = Option::deserialize(deserializer)?;
    if let Some(s) = s {
        return Ok(Some(
            s.split(',').map(|s| s.to_string()).collect::<Vec<_>>(),
        ));
    }

    Ok(None)
}

pub fn unix_timestamp() -> i64 {
    SystemTime::UNIX_EPOCH.elapsed().unwrap().as_secs() as i64
}

// This is part of what we used to do input validation for hivefriends.
pub fn check_length(
    field_name: &'static str,
    field: Option<&str>,
    maximum_length: u64,
) -> Result<(), Error> {
    if let Some(field) = field {
        if field.len() as u64 > maximum_length {
            return Err(Error::TooManyCharacters {
                field: field_name,
                maximum_length,
            });
        }
    }

    Ok(())
}
