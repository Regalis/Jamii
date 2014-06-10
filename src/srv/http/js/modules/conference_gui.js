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

		document.getElementById("user1").ondrop = this.dropFirst;
	    document.getElementById("user1").ondragover = this.allowDrop;
	    console.log("setting dropfirst");
		this.logic.signal_incoming_invitation.connect(this.invitation_incoming_handler);
		//this.logic.signal_invitation.connect(this.invitation_handler);
		this.logic.signal_invitation_result.connect(this.invitation_result_handler);
	}


	this.invitation_incoming_handler = function(data) {

		var temp ={}
		if (confirm('Are you sure you want to join ' +data.admin_id+ ' conference')) {
			//window.connection.send("conf_accept", info);
			data["response"]=true;
			console.log("Join to conference");
		//	window.webrtc.joinRoom("jamiiroom"+data.admin_id);

		} else {
			//window.connection.send("conf_discard", info);
			data["response"]=false;
			console.log("Refuse conference invitation");
		}

		window.JamiiCore.get_module_gui("conference").signal_response_conference.emit(data);
		return false;
	}

	this.invitation_result_handler = function(data) {
		
	}

	this.signal_start = new Signal();


	this.dropFirst = function(ev) {
		window.JamiiCore.get_module_gui("conference").signal_new_conference_request.emit(ev);
		return false;
	}

    this.allowDrop = function(ev) {
	ev.preventDefault();
    }

	this.signal_response_conference = new Signal();
	this.signal_new_conference_request = new Signal();
	this.signal_response_conference = new Signal();
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
