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


var ConferenceGui = function() {

	this.init = function() {

		this.logic.signal_invitation.connect(this.invitation_handler);
		this.logic.signal_invitation_result.connect(this.invitation_result_handler);
	}


	this.start = function(ev) {
	ev.preventDefault();
	var create_conf_data = {
		"my_id": window.my_user_object["id"],
		"user_id": ev.dataTransfer.getData("Id")
	};

	var data = ev.dataTransfer.getData("Login");
	ev.target.appendChild(document.getElementById(data).cloneNode(true));
	console.log("Dodano pierwszego: my_id " + create_conf_data["my_id"] + " user id " + create_conf_data["user_id"]);

	signal_start.emit(create_conf_data);
	
	}

	this.invitation_handler = function(data) {
		
	}

	this.invitation_result_handler = function(data) {
		
	}

	this.signal_start = new Signal();
}	







/*

	window.connection.registerHandler("conf_invitation", function (data){
		var temp ={}
		if (confirm('Are you sure you want to join ' +data.admin_id+ ' conference')) {
			//window.connection.send("conf_accept", info);
			temp["response"]=true;
			console.log("Join to conference");
			window.webrtc.joinRoom("jamiiroom"+data.admin_id);
			window.is_in_conference = true;
			clickView();

		} else {
			//window.connection.send("conf_discard", info);
			temp["response"]=false;
			console.log("Refuse conference invitation");
		}
		temp["user_id"] = window.my_user_object['id'];
		temp["admin_id"]=data.admin_id;
		window.conf_admin = data.admin_id;
		window.connection.send("conf_response", temp);	

	});


*/
