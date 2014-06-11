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
	
	this.init = function() {

		this.gui.signal_start.connect(this.start_handler);
		this.gui.signal_new_conference_request.connect(this.new_conference_request_handler);
		this.gui.signal_response_conference.connect(this.new_response_conference_handler);
		window.connection.registerHandler("conference_invitation", this.invitation_handler);
		window.connection.registerHandler("conference_invitation_result", this.invitation_result_handler);

	}

	this.new_response_conference_handler = function(data){
		data["user_id"] = window.JamiiCore.get_current_user_data()['id'];
		alert(JSON.stringify(data));
		//data["admin_id"]=data.admin_id;
		window.connection.send("conference_invitation_response", data);	

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
		//window.webrtc.joinRoom("jamiiroom"+create_conf_data["my_id"] );

	}

	//OK
	this.invitation_handler = function (data) {
		window.JamiiCore.get_module_logic("conference").signal_incoming_invitation.emit(data);
	}

	this.invitation_result_handler = function (data) {


	}

	this.invitation_outcoming_handler = function (data) {

		window.connection.send("conference_invitation_response", data);
	}

	this.start_handler = function (data) {

		window.connection.send("conference_start", data);
	}

	this.invitation_conference_handler = function (data) {

		window.connection.send("conference_invitation", data);
	}
	

	this.signal_incoming_invitation = new Signal();
	this.signal_invitation_result = new Signal();

}
