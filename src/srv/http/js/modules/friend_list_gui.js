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
 *  -> Mateusz Folwarski<mateusz.folwarski@uj.edu.pl>
 * 
 */

var FriendListGui = function(){
	
	var friends_table;

	this.init = function() {

		this.logic.signal_new_friend.connect(this.new_friend_handler);
		this.logic.signal_current_invitations.connect(this.current_invitations_handler);
		//TODO jakie id dla ul dla friendlisty
		friends_table = document.getElementById("friend_list_ul");
		//TODO nazwa buttona add_friend
	    //not needed, handled by stackedWidget now
//		document.getElementById("add_friend").onclick = this.show_search_handler;
		//TODO nazwa buttona search_friend


		document.getElementById("search_friend").getElementsByTagName("form")[0].onsubmit = function(e){''
			e = e || window.event;
			e.preventDefault();

			window.JamiiCore.get_module_gui("friend_list").search_friend_handler();
		}

	}

	this.current_invitations_handler = function (data){
		var len = data.length;
		var invitatations_bar = document.getElementById("invitation_button");
		invitatations_bar.textContent = "Invitations: " + len;
	}

	this.new_friend_handler = function (data){

		var li = document.createElement('li');
		//TODO czy id ma byc login?!
		li.setAttribute('id', data["login"]); 
	 	li.setAttribute('draggable','true');	
		li.setAttribute('data-id', data["id"]);
		li.setAttribute('ondragstart','drag(event)'); 
		

		friends_table.appendChild(li);
		
		var div_login = document.createElement('div');		
		div_login.textContent=data["login"];
		
		var image_entry = document.createElement("img");
		image_entry.setAttribute('draggable', 'false');
		image_entry.src = 'data:image/gif;base64,' + data["avatar"];	
		
		var x_img = document.createElement("img");
		x_img.src = "images/x.png";
		x_img.style="float:right;height:10px;width:10px;";

		li.appendChild( image_entry );
		li.appendChild(x_img);
		li.appendChild(div_login);
				
	}


	this.search_friend_handler = function(){
		//TODO set UNIQUE names for inputs
		//TODO validate
		var data = {};
		data ["login"] = document.getElementById("login").value;
		data ["first_name"] = document.getElementById("first_name").value;
		data ["last_name"] = document.getElementById("last_name").value;
		data ["email"] = document.getElementById("email").value;
		window.JamiiCore.get_module_gui("friend_list").signal_search_friend.emit(data);
		return false;
	}
	
	this.signal_search_friend = new Signal();

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
