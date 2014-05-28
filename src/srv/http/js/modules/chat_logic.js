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

var ChatLogic = function() {
	
	this.init = function() {
		this.gui.signal_outcoming_message.connect(this.outcoming_message_handler);
		window.connection.registerHandler("chat_incoming_message", this.incoming_message_handler);
	}

	this.incoming_message_handler = function (data) {
		signal_incoming_message.emit(data);
	}

	this.outcoming_message_handler = function (data) {
		//TODO remove login field from data
		data ["login"] = window.my_user_object.login;
		window.connection.send("chat_message", data);
	}

	this.signal_incoming_message = new Signal();
}

