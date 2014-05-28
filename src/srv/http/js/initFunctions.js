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

	var host = window.location.host;
	if (host.indexOf(':') != -1) {
		host = host.substring(0, host.indexOf(':'));
	}
   window.connection = new ConnectionManager("http://" + host,"9393");
	window.is_in_conference = false;
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



window.onload = function () {

	initMainScreen();




	window.connection.registerHandler("drawOK", window.wb.drawHandler);

	fitToContainer(document.getElementById("layer1"));

	clickDiv();

	hideRWindow();	



}

function fitToContainer(canvas) {
	// Make it visually fill the positioned parent
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	// ...then set the internal size to match
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

function clickDiv() {
	var something = document.getElementById('me');
	something.style.cursor = 'pointer';
	var whiteboard = document.getElementById('layer1');
	whiteboard.style.cursor = 'crosshair';
}

function clickView() {
	var views = document.getElementById("dBar").getElementsByTagName("div");
	for (i in views) {
		views[i].style.cursor = 'pointer';
		views[i].onclick = function () {
			document.getElementById("localVideo").style.visibility = "visible";
			document.getElementById("chat").style.visibility = "hidden";
			document.getElementById("friendList").style.visibility = "hidden";
			document.getElementById("options").style.visibility = "hidden";
			document.getElementById("fileshare").style.visibility = "hidden";
			//document.getElementById("createConference").style.visibility = "hidden";
			document.getElementById("whiteboard").style.visibility = "hidden";
			if( document.getElementById("logout") == document.getElementById(this.className) ){
				window.connection.logout();
			}
			if( document.getElementById("whiteboard") == document.getElementById(this.className) ){
				document.getElementById("chat").style.visibility = "visible";
			}

			document.getElementById(this.className).style.visibility = "visible";
		};
	}
}

function drag(ev) {
	ev.dataTransfer.setData("Login", ev.target.id);
	ev.dataTransfer.setData("Id", ev.target.getAttribute("data-id"));

}


function allowDrop(ev) {
	ev.preventDefault();
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("Login");
	var info = {
		"my_id": window.my_user_object["id"],
		"user_id": ev.dataTransfer.getData("Id"),
	}
	ev.target.appendChild(document.getElementById(data).cloneNode(true));
	console.log("Dodano: my_id " + info["my_id"] + " user id " + info["user_id"]);

	window.connection.send("conf_request", info);

}
function dropFirst(ev) {
	

	window.is_in_conference = true;

ev.preventDefault();
var create_conf_data = {
"my_id": window.my_user_object["id"],
"user_id": ev.dataTransfer.getData("Id"),
"visibility": "public"
};

var data = ev.dataTransfer.getData("Login");
ev.target.appendChild(document.getElementById(data).cloneNode(true));
console.log("Dodano pierwszego: my_id " + create_conf_data["my_id"] + " user id " + create_conf_data["user_id"]);
window.connection.send("conf_create", create_conf_data);
window.webrtc.joinRoom("jamiiroom"+create_conf_data["my_id"] );
window.conf_admin = window.my_user_object["id"];
}








