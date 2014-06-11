/*
 *
 * Copyright (C) Jamii Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * Contributors:
 *  -> Mateusz Zajac<matteo.zajac@gmail.com>
 * 
 */

var FileShareGui = function() {

	this.init = function() {

		this.logic.signal_incoming_file.connect(this.file_incoming_handler);
//	document.getElementById('file_to_send').addEventListener('change', handleFileSelect, false);
//	document.getElementById("file_send_button").onSubmit = 	this.outcoming_file_handler;

		document.getElementById("file_share").getElementsByTagName("form")[0].onsubmit = function(e){
			e = e || window.event;
			e.preventDefault();
			window.JamiiCore.get_module_gui("file_share").outcoming_file_handler();
		}
	}



	this.incoming_message_handler = function (data){
		var ul = document.getElementById("files_list");
		var li = document.createElement("li");
		var a = document.createElement('a');
		var linkText = document.createTextNode(data.name);
		a.appendChild(linkText);
		a.setAttribute("title", "data.name");
		a.setAttribute("href", "http://"+(window.location.host)+"/get_file/"+(window.conf_admin)+"/"+data.name);
		li.appendChild(a);
		ul.appendChild(li);
	}

	this.outcoming_file_handler = function(evt){	
		alert("AAA");
		document.getElementById("current_file").innetHTML = "ASAASA";
		alert("AAA");
	}

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object
		var data = {};

		var reader = new FileReader();
		data["reader"] = reader;
	
		reader.onload = (function(theFile) {
		return function(e) {
			var result = reader.result;

			var temp = JSON.stringify(result);
			var splited = temp.split(",");
			temp =  splited[0];
			temp = temp.replace("\"data:","");
			var arr = temp.split(";");
			temp = arr[0];
			data["file_type"]=arr[0];
			console.log(splited[1]);
			data["file'"] = splited[1];
}
		})(f);

		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
		data["file_name"] = f.name;
		document.getElementById("current_file").textContent = data["file_name"];


		}

	


}
