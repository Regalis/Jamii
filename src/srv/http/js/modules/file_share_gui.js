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

window.FileShareGui = function() {
	
	window.FileShareLogic.signal_incoming_file.connect(this.file_incoming_handler);
	
	this.incoming_message_handler = function (data){
		var ul = document.getElementById("files_list");
		var li = document.createElement("li");
		var a = document.createElement('a');
		var linkText = document.createTextNode(data.name);
		a.appendChild(linkText);
		a.setAttribute("title", "data.name");
		a.setAttribute("href", "http://"+(window.location.host)+"/get_file/"+(window.conf_admin)+"/"+data.name);
		li.appendChild(a);
		ul.appendChild(li);
	}
}
