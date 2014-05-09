function file_transfer(){

	var data = {};
	data["content"]= window.file;
	data["name"]= window.file_name;
	data["content-type"] = window.file_type;
	window.connection.send("send_file", data);

	return false;
}

function file_input_handler(){


}
