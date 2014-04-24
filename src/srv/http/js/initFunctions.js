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
    
    // inside FriendListGUI constructor, friendList is created as flg.fl
    window.flg = new FriendListGUI("friendList");
    //call searchFormInit to prepare to show search form if Add Friend button is pushed     
    
    searchInit();

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
		if (confirm('Are you sure you want to join conference')) {
   		//window.connection.send("conf_accept", info);
			console.log("Join to conference")
		} else {
   		//window.connection.send("conf_discard", info);
			console.log("Refuse conference invitation")
}
	
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




