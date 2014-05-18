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
		window.connection.registerHandler("conference_invitation", this.invitation_handler);
		window.connection.registerHandler("conference_invitation_result", this.invitation_result_handler);

	}
	

	this.invitation_handler = function (data) {
		signal_incoming_invitation.emit(data);
	}

	this.invitation_result_handler = function (data) {
		signal_result_invitation.emit(data);
	}

	this.invitation_outcoming_handler = function (data) {
		window.connection.send("conference_invitation_response", data);
	}

	this.start_handler = function (data) {
		window.webrtc.joinRoom("jamiiroom"+data["my_id"] );
		window.connection.send("conference_start", data);
	}

	this.invitation_conference_handler = function (data) {
		window.connection.send("conference_invitation", data);
	}
	

	this.signal_invitation = new Signal();
	this.signal_invitation_result = new Signal();

}
