function file_transfer(){

	var data = {};
	data["file"]= window.file;
	data["name"]= window.file_name;

	//window.connection.send("send_file", data);
	var ul = document.getElementById("files_list");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(data.name));
	ul.appendChild(li);

	return false;
}

function file_input_handler(){


}
