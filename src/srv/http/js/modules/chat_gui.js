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


var ChatGui = function() {


	this.init = function() {
		this.logic.signal_incoming_message.connect(this.incoming_message_handler);

		document.getElementById("chat").getElementsByTagName("form")[0].onsubmit = function(e){
			e = e || window.event;
			e.preventDefault();
			window.JamiiCore.get_module_gui("chat").outcoming_message_handler();
		}

	}

	this.incoming_message_handler = function (data){
		var list = document.getElementById("textList");
		var entry = document.createElement('li');
		console.log("got message from: " + data.login + " : " + data.message);
		var loginText = data.login + ": ";
		entry.appendChild(document.createTextNode(loginText));
		entry.appendChild(document.createTextNode(data.message));
		list.appendChild(entry);
		return false;
	}

	this.outcoming_message_handler = function(){
		var temp = document.getElementById("chat_input").value;        
		var data  = {};

		data ["message"] = temp;
		this.signal_outcoming_message.emit(data);
		document.getElementById("chat_input").form.reset();  
		var textList = document.getElementById("textList");
		textList.scrollTop = textList.scrollHeight;
		return false;
	}

	this.signal_outcoming_message = new Signal();

}



