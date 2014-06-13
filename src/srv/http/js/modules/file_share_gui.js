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
		document.getElementById("file_to_send").addEventListener("change",handleFileSelect, false);

	}



	this.file_incoming_handler = function (data){

		var ul = document.getElementById("files_list");
		var li = document.createElement("li");
		var a = document.createElement('a');

		//var linkText = document.createTextNode(data.name);
		a.textContent=data["name"];
		//a.appendChild(linkText);
		a.setAttribute("title", "data.name");
		a.setAttribute("href", "http://"+(window.location.host)+"/get_file/"+data["admin"]+"/"+data["name"]);
		a.setAttribute("target", "_blank");
		li.appendChild(a);
		ul.appendChild(li);

	}

	this.outcoming_file_handler = function(){

	}









	function handleFileSelect(evt) {

		var files = evt.target.files; // FileList object
		var data = {};
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();



			reader.onload = (function(theFile) {

				return function(e) {
					var result = reader.result;
					alert("1");

					var temp = JSON.stringify(result);
					var splited = temp.split(",");
					temp =  splited[0];
					temp = temp.replace("\"data:","");
					var arr = temp.split(";");
					temp = arr[0];
					afa ={};
               //reader.readAsDataURL(f);
 					var ran  = "";
					var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

   				for( var i=0; i < 5; i++ )
				      ran += possible.charAt(Math.floor(Math.random() * possible.length));

					afa["file_name"] = "file"+ran+".jpg";
					afa["file_type"]=arr[0];
					console.log(splited[1]);
					afa["file"] = splited[1];
					alert(JSON.stringify(theFile));
					alert(JSON.stringify(afa))
					window.JamiiCore.get_module_gui("file_share").signal_outcoming_file.emit(afa);
				}

			})(f);


			reader.readAsDataURL(f);

			data["file_name"] = f.name;
		}

		document.getElementById("current_file").textContent = data["file_name"];

	///window.connection.send("send_file", data);

	}

	this.signal_outcoming_file = new Signal();


}
