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
 *  -> Alek Gajos <alek.gajos@gmail.com>
 *  -> Mateusz Zajac <matteo.zajac@gmail.com>
 *  -> Mateusz Folwarski <mateusz.folwarski@uj.edu.pl>
 *
 */


/**
 * Constructof of the friendList object
 * friendList represents the logic of a list of friend users.
 * Should be created in the constructor of {@link friendListGUI}
 * @param friend_list_gui reference to the mother friendListGUI object
 */
function friendList(friend_list_gui){
    // TODO: repace with querying the server
    // for data of user user_login
    // temporarily use example object
    this.user_object = {
        "first_name": "John",
        "last_name": "Runner",
        "avatar": "base64",
        "passwd": "9c2312312312312312asdasd123",
        "login": "johnnyRunner",
        "requests_list": [43, 55, 32],
        "email": "john92@gmail.com",
        "friends_list": [3, 5, 7, 13, 43, 123],
        "block_list": [4,6]
    };
    
    this.friend_list_gui = friend_list_gui;
    this.friend_id_list = this.user_object.friends_list;
    this.n_friends = this.friend_id_list.length;    
    this.friend_list = new Array();
}

/**
* Send request for the friends list of user
*/
friendList.prototype.populateList = function(){
   connection.send("getUserData", this.friend_id_list);
}

/**
* Get user login by number on FriendList.
* @param i refers to number of index in internal friend_list
* @return return login of friend
*/
friendList.prototype.getFriendLogin = function(i){
    return this.friend_list[i].login;
}

/**
* Send request with user data to server. Server will find list of users.
* @param data data with user info to find
*/
friendList.prototype.searchFriends = function(data){
    connection.send("searchFriends", data);
}

/**
* User invites friend
* @param id ID of friend
*/
friendList.prototype.sendInvitation = function(id){
        connection.send("sendInvitation", id);
}

/**
* Confirm relationship
* @param isAccepted 
*/
friendList.prototype.confirmation = function(isAccepted){
        connection.send("confirmation", isAccepted);
}


friendList.prototype.addFriend = function(userInfo){
        this.friend_id_list.push(userInfo.id);
        this.friend_list.push(userInfo);

}

friendList.prototype.createListFromFoundId = function(data){
        this.arrayOfUsers = data[list];
}
