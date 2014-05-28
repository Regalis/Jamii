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
		window.connection.registerHandler("friend_data", this.friend_data_handler);
		this.gui.signal_search_friend.connect(this.search_friend_handler);
	}
		
	this.friend_data_handler = function (data) {

			var user_info = {};
			user_info["id"] = data["id"];	
			user_info["first_name"] =data["first_name"];
			user_info["last_name"] = data["last_name"];
			user_info["login"] = data["login"];
			user_info["avatar"] = data["avatar"];
			
			friend_list[user_info["id"]] = user_info;
			
			signal_incoming_message.emit(data);

			console.log("userinfo: " + JSON.stringify(user_info) )
	}
	

	this.search_friend_handler = function(data) {
		window.connection.send("searchFriends", data);
	}

	this.signal_new_friend = new Signal();
}
