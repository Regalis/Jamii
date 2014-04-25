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
 *  -> Alek Gajos <alek.gajos@gmail.com>
 *  -> Mateusz Zajac<matteo.zajac@gmail.com>
 * 
 */

/** 
 *  Init function creating necessaty objects and registering handlers for packets.
 *  To be called after successful user login.
 *
*/
function initMainScreen(){

    window.connection = new ConnectionManager("http://localhost","9393");
        
	window.webrtc = new SimpleWebRTC({
		localVideoEl: 'localVideo',
		remoteVideosEl: 'remoteVideos',
		autoRequestMedia: true
	});
	//call searchFormInit to prepare to show search form if Add Friend button is pushed     
    searchInit();
	addInit();

    // inside FriendListGUI constructor, friendList is created as flg.fl
    window.flg = new FriendListGUI("friendList");

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
			var result = reader.result;

var temp = JSON.stringify(result);
var splited = temp.split(",");
console.log(splited[1]);
window.avatar = splited[1];
          // Render thumbnail.
         /* var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);*/
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);



    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
}
/*
* Initialize
*/


function onResize(){
  
}


window.onload = function () {

   initMainScreen();


   window.connection.registerHandler("chatOK", function (data) {
      var list = document.getElementById("textList");
      var entry = document.createElement('li');
      console.log("got messae from: " + data.login + " : " + data.message);
      var loginText = data.login + ": ";
      entry.appendChild(document.createTextNode(loginText));
      entry.appendChild(document.createTextNode(data.message));
      list.appendChild(entry);
   });

   window.connection.registerHandler("conf_invitation", function (data){
		var temp ={}
		if (confirm('Are you sure you want to join ' +data.admin_id+ ' conference')) {
   		//window.connection.send("conf_accept", info);
			temp["response"]=true;
			console.log("Join to conference");
        window.webrtc.joinRoom("jamiiroom"+data.admin_id);
		} else {
   		//window.connection.send("conf_discard", info);
			temp["response"]=false;
			console.log("Refuse conference invitation");
		}
		temp["user_id"] = window.my_user_object['id'];
		temp["admin_id"]=data.admin_id;
    	window.connection.send("conf_response", temp);	

	});




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




	window.connection.registerHandler("drawOK", window.wb.drawHandler);

	document.getElementById("file_share_button").style.visibility = "hidden";


	fitToContainer(document.getElementById("layer1"));


   clickDiv();
   clickView();

   var micro = document.getElementById("microphone");



}







