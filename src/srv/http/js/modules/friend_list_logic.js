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

var FriendListLogic = function() {
	
	var friend_list = {};

	this.init = function() {

		window.connection.registerHandler("users_data_response", this.users_data_response_handler);
		this.gui.signal_search_friend.connect(this.search_friend_handler);
					//alert("BEFAFDAS");
		window.JamiiCore.signal_user_data_available.connect(function(){
			window.connection.send("get_users_data", window.JamiiCore.get_current_user_data()["friends_list"]);
		});



	}
		
	this.users_data_response_handler = function (data) {

		var list = data["user_data_list"];
			for(var i=0; i<list.length; i++){
				var user_info = {};
				user_info["id"] = list[i]["id"];	
				user_info["first_name"] = list[i]["first_name"];
				user_info["last_name"] = list[i]["last_name"];
				user_info["login"] = list[i]["login"];
				user_info["avatar"] = list[i]["avatar"];

				friend_list[user_info["id"]] = user_info;

				window.JamiiCore.get_module_logic("friend_list").signal_new_friend.emit(user_info);

			}

	}
	
	this.search_friend_handler = function(data) {
		window.connection.send("searchFriends", data);
	}

	this.signal_new_friend = new Signal();
}
