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

var FileShareLogic = function() {

	this.init = function() {
		window.connection.registerHandler("file_incoming", this.file_incoming_handler);
		this.gui.signal_outcoming_file.connect(this.file_outcoming_handler);
	}
	

	this.file_incoming_handler = function (data) {


		window.JamiiCore.get_module_logic("file_share").signal_incoming_file.emit(data);
	}

	this.file_outcoming_handler = function (data) {

		window.connection.send("send_file", data);
	}

	this.signal_incoming_file = new Signal();
}

