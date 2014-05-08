function file_transfer(){

	var data = {};
	data["file"]= window.file;
	data["name"]= window.file_name;
	window.connection.send("send_file", data);

	return false;
}

