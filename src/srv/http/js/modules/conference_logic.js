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

var ConferenceLogic = function (){

    this.is_in_conf = false;
    this.is_admin = true;

	this.init = function() {

		this.gui.signal_start.connect(this.start_handler);
		this.gui.signal_new_conference_request.connect(this.new_conference_request_handler);
		this.gui.signal_response_conference.connect(this.new_response_conference_handler);
	        this.gui.signal_invite_to_conference.connect(this.invite_to_conference_handler);
		window.connection.registerHandler("conference_invitation", this.invitation_handler);
		window.connection.registerHandler("conference_invitation_result", this.invitation_result_handler);
   	
		window.JamiiCore.signal_user_data_available.connect(function(){
			
         var user = window.JamiiCore.get_current_user_data();
			if(user.conference != null){
				document.getElementById("conference_tools").style.visibility = "visible";
				window.webrtc.joinRoom("jamiiroom");
			}

      });
		
		window.JamiiCore.request_current_user_data();

	}

	this.new_response_conference_handler = function(data){
		data["user_id"] = window.JamiiCore.get_current_user_data()['id'];
		webrtc.joinRoom('jamiiroom');
		//data["admin_id"]=data.admin_id;
		window.connection.send("conference_invitation_response", data);
	    // someone invited you, you're not admin

	}

	this.join_to_conference = function(conference_id){
		var data = {};
		data["user_id"] = window.JamiiCore.get_current_user_data()['id'];
		data["conf_id"] = conference_id;
		webrtc.joinRoom('jamiiroom');
		window.connection.send("conference_join", data);
	}

	this.new_conference_request_handler = function(ev) {
		ev.preventDefault();
		var create_conf_data = {
		"my_id": window.JamiiCore.get_current_user_data()["id"],
		"user_id": ev.dataTransfer.getData("Id"),
		"visibility": "public"
		};

		var data = ev.dataTransfer.getData("Login");
		ev.target.appendChild(document.getElementById(data).cloneNode(true));
		console.log("Dodano pierwszego: my_id " + create_conf_data["my_id"] + " user id " + create_conf_data["user_id"]);
		window.connection.send("conference_start", create_conf_data);

		window.webrtc.joinRoom("jamiiroom");
		this.is_admin = true;
		console.log("is_admin "+ this.is_admin);

		//window.webrtc.joinRoom("jamiiroom"+create_conf_data["my_id"] );

	}

	//OK
	this.invitation_handler = function (data) {
		window.JamiiCore.get_module_logic("conference").signal_incoming_invitation.emit(data);
	}

	this.invitation_result_handler = function (data) {

	    console.log("invitation_result");
	    if( data["response"] == true ){
			this.is_in_conf = true;
			this.is_admin = false;
			console.log("is_admin "+ this.is_admin);
	    }
	    console.log("is_in"+ this.is_in_conf);

	}

	this.invitation_outcoming_handler = function (data) {

		window.connection.send("conference_invitation_response", data);
	}

	this.start_handler = function (data) {

		//window.webrtc.joinRoom("jamiiroom"+data["my_id"] );
	    if( this.is_admin == false ){
		alert("You're no admin. Can't start conference.");
		return false;
	    }

		window.connection.send("conference_start", data);
	}

	this.invitation_conference_handler = function (data) {

		window.connection.send("conference_invitation", data);
	}

    this.invite_to_conference_handler = function (ev) {
	ev.preventDefault();

	// do not invite if you are not admin
	if( this.is_admin == false ){
	    alert("You're no admin. Can't invite users");
	    return false;
	}

	// do not invite next until conference is started
	if( this.is_in_conf == false ){
	    alert("You can not invite more friends before starting conference. Invite the first friend.");
	    return false;
	}

	var data = {
	    "my_id": window.JamiiCore.get_current_user_data()["id"],
	    "user_id": ev.dataTransfer.getData("Id"),
	}

	var login = ev.dataTransfer.getData("Login");
	ev.target.appendChild(document.getElementById(login).cloneNode(true));
	console.log("Dodano kolejnego: my_id " + data["my_id"] + " user id " + data["user_id"]);

	// ev.target.appendChild(document.getElementById(data).cloneNode(true));
	// console.log("Dodano: my_id " + info["my_id"] + " user id " + info["user_id"]);

	window.connection.send("conf_invitation", data);
    }

	this.signal_incoming_invitation = new Signal();
	this.signal_invitation_result = new Signal();

}
