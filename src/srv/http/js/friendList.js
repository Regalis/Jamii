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
    this.candidates = new Array(); // for friend searching
}

/**
 * Send request for the data of friends specified
 * by the friend list of the user.
 * The rest is performed by the {@link gotFriendsDataHandler} function
 * on reception of server's response.
 */
friendList.prototype.populateList = function(){
    connection.send("getFriendsData", {"list":this.friend_id_list} );
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
 * Send request with user data to server.
 * Server will find list of users matching the given data and
 * respond with a "matchingUsers" packet containing a list of IDs.
 * @param data data with user info to find; form:
 *  {"login": "...", "first_name":"...", "second_name":"...", "email":"..."}
 *  where "..." may be an empty string but at least one of the above values
 *  will not be empty.
 */
friendList.prototype.searchFriends = function(data){
    connection.send("searchFriends", data);
}

/**
 * Handler function for reception of the "matchingUsers" packet
 * Sends request for detailed data if the candidates. The rest
 * is performed by the {@link gotCandidatesDataHandler} on
 * reception of the server's response.
 * @param data data part of the received packet; is of the form
 *  {'list':[id1,id2,id3,...]} 
 */
friendList.prototype.gotMathchingUsersHandler = function(data){
    connection.send("getCandidatesData", data);
}


/**
 * User invites friend
 * @param id ID of a user to be invited to friends
 */
friendList.prototype.sendInvitation = function(id){
    connection.send("sendInvitation", {"inviter":this.user_object.id,
				       "invitee":id} );
}

/**
 * Confirm relationship
 * @param isAccepted 
 */
friendList.prototype.confirmation = function(isAccepted){
    connection.send("confirmation", isAccepted);
}


friendList.prototype.addFriend = function(userInfo){
    
    this.n_friends++;
    this.friend_id_list.push(userInfo.id);
    this.friend_list.push(userInfo);
    // update GUI
    this.friend_list_gui.update();
}

/**
 * Handler function for reception of the "foundFriends" packet
 * @param data data part of the received packet; is of the form
 *  {'list':[id1,id2,id3,...]} 
 */
friendList.prototype.createListFromFoundId = function(data){
    this.array_of_users = data[list];
}


/**
 * Handler function for reception of the "friendsData" packet
 * @param data data part of the received packet; is of the form
 *  {'user_data_list':[user1, user2, user3,...]} where userX is
 *  in the format as stored on the server
 */
friendList.prototype.gotFriendsDataHandler = function(data){
    var list = data["user_data_list"];
    for( var i=0; i<list.length; i++ ){
	var user_info = {};
	user_info["first_name"] = list[i]["first_name"];
	user_info["last_name"] = list[i]["last_name"];
	user_info["login"] = list[i]["login"];
	this.addFriend( user_info );
    }
    // update GUI component to the new friend list
    this.friend_list_gui.update();
}

/**
 * Handler function for reception of the "candidatesData" packet
 * @param data data part of the received packet; is of the form
 *  {'user_data_list':[user1, user2, user3,...]} where userX is
 *  in the format as stored on the server
 */
friendList.prototype.gotCandidatesDataHandler = function(data){
    var list = data["user_data_list"];

    // clear the list
    this.candidates = [];

    for( var i=0; i<list.length; i++ ){
	var user_info = {};
	user_info["first_name"] = list[i]["first_name"];
	user_info["last_name"] = list[i]["last_name"];
	user_info["login"] = list[i]["login"];
	user_info["id"] = list[i]["id"];
	candidates[i] = user_info;
    }

    // TODO: make friendListGUI draw the list of candidates
    
}

/**
 * Handler function for reception of the "friendInvitation" packet
 * @param data data part of the received packet; is of the form
 *  {"inviter": userX } where userX is data of the inviting user
 *  in the format as stored on the server
 */
friendList.prototype.gotFriendInvitationHandler = function(data){
    
    this.friend_list_gui.displayInvitation( data );
    
}

/**
 * Sends the "invitationResponse" package to the server.
 * Should be called by the friendListGUI object after user
 * considers a friend invitation.
 * @param invitation data object received with the "friendInvitation" packet
 * @param decision true if friendship accepted, otherwise false
 */
friendList.prototype.respondInvitation = function( invitation, decision ){
    
    var data = {};
    data["inviter"] = invitation.id;
    data["invitee"] = this.user_object.id;
    data["decision"] = decision;
    
    connection.send("invitationResponse", data );
    
}

/**
 * Handler function for reception of the "newFriend" packet
 * @param data data part of the received packet; it is a user data
 *  object as stored on the server
 */
friendList.prototype.gotNewFriendHandler = function(data){

    // TODO: convert user data format if necessary
    this.addFriend( data );

}
