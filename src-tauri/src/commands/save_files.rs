use std::{fs::{self}, io::Error};
use serde::Deserialize;
use rayon::iter::{IndexedParallelIterator, IntoParallelRefIterator, ParallelIterator};

#[derive(Deserialize)]
pub struct FileData {
	path: String,
	contents: String
}

#[tauri::command]
pub async fn save_files(data: Vec<FileData>) -> bool {
	let results: Vec<Result<(), Error>> = data
		.par_iter()
		.enumerate()
		.map(|(_, file_data)| {
			fs::write(&file_data.path, &file_data.contents)
		})
		.collect();
	let failures = results
		.iter()
		.any(Result::is_err);
	!failures
}
