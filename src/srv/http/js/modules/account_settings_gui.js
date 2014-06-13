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

var AccountSettingsGui = function() {
	this.init = function() {
		
		document.getElementById("account_settings").getElementsByTagName("form")[0].onsubmit = function(e){
			e = e || window.event;
			e.preventDefault();
			window.JamiiCore.get_module_gui("account_settings").change_settings_handler();
		}

	//	document.getElementById("file_avatar").addEventListener("change",handleFileAvatarSelect, false);

   this.logic.signal_current_settings.connect(function(){
         var user = window.JamiiCore.get_current_user_data();
         document.getElementById("login_settings").value= user.login;
         document.getElementById('first_name_settings').value =  user.first_name;
         document.getElementById('last_name_settings').value =  user.last_name;
         document.getElementById('email_settings').value =  user.email;
         document.getElementById("avatar_settings").setAttribute("src",'data:image/gif;base64,'+user.avatar);
         document.getElementById("avatar_settings").style.width = '150px';
         document.getElementById("avatar_settings").style.height = '150px';
      });
	}

	this.change_settings_handler = function (){

		console.log("password_change()");
		var data  = {};
      data ["login"] = document.getElementById("login_settings").value;
      data ["first"] = document.getElementById("first_name_settings").value;
      data ["last"] = document.getElementById("last_name_settings").value;
      data ["email"] = document.getElementById("email_settings").value;
		data ["current"] = document.getElementById("current_password").value;
		data ["new"] = document.getElementById("new_password").value;
		data ["confirm"] = document.getElementById("confirm_password").value;
		alert(JSON.stringify(document.getElementById("file_avatar").value));
		//data ["avatar"] = document.getElementById("confirm_password").value;

		this.signal_settings_change.emit(data);

		return false;
	}


/*
	function handleFileAvatarSelect(evt) {
		var files_avatar = evt.target.files_avatar; // FileList object
		var data = {};
					alert("before send");
		alert(JSON.stringify(files_avatar));
		for (var i = 0, f; f = files_avatar[i]; i++) {
								alert("before send");
			var reader = new FileReader();

					alert("before send");

			reader.onload = (function(theFile) {

				return function(e) {
					var result = reader.result;

					alert("before send");
					var temp = JSON.stringify(result);
					var splited = temp.split(",");
					temp =  splited[0];
					temp = temp.replace("\"data:","");
					var arr = temp.split(";");
					temp = arr[0];
					afa ={};
               //reader.readAsDataURL(f);
 				
					afa["file_name"] = theFile.name;
					afa["file_type"]=arr[0];
					console.log(splited[1]);
					afa["avatar"] = splited[1];


					window.connection.send("avatar_change",afa);
					alert("SEND");
				}

			})(f);


			reader.readAsDataURL(f);

			data["file_name"] = f.name;
		}


	///window.connection.send("send_file", data);

	}
*/


	this.signal_settings_change = new Signal();

}
/*------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!------------------------*/

	window.connection.registerHandler("password_change_confirmation", function (data) {
		alert("Password has been changed");
		document.getElementById("new_password").value="";
		document.getElementById("confirm_password").value="";
		document.getElementById("current_password").value="";
	});

	window.connection.registerHandler("password_change_error", function (data) {
		alert("Wrong current password, please try again");
		document.getElementById("new_password").value="";
		document.getElementById("confirm_password").value="";
		document.getElementById("current_password").value="";
	});





function password_change() {
   var new_password = document.getElementById("new_password").value;
   var confirm_pasword = document.getElementById("confirm_password").value;
   console.log("password_change()");
   if (confirm_pasword == new_password) {
      var current_password = document.getElementById("current_password").value;
      var data = {
         "current": current_password,
         "new": new_password
      };
      window.connection.send("password_change", data);
   } else {
      alert("Your new passwords don't match");
   }
   return false;
}



function account_change() {

   var first = document.getElementById("first_name_options").value;
   var last = document.getElementById("last_name_options").value;
   var login = document.getElementById("login_options").value;
   var email = document.getElementById("email_options").value;

   var data = {
      "login": login,
      "email": email,
      "first": first,
      "last": last
   };
   console.log(first);
   window.connection.send("account_change", data);
	return false;
}

function micro_change() {
   var x = document.getElementById("microphone").checked;
   if (x) {
      alert("MIC ON");
   } else {
      alert("MIC OFF");
   }
}

function camera_change() {
        var x = document.getElementById("camera").checked;
   if (x) {
      alert("CAMERA ON");
   } else {
        alert("CAMERA OFF");
   }
}


function avatar_change(){
var data = {};
data["avatar"]= window.file;
window.connection.send("avatar_change", data)
return false;
}
