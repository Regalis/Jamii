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

    // dont do antyhing more here!
    this.friend_list_gui = friend_list_gui;
    this.getMyData();

}

/**
 * Actual function to construct internals of the friendList.
 * Should be called on obtaining the "yourData" packet
 *
*/
friendList.prototype.init = function(){
    
    this.user_object = window.my_user_object;
    this.friend_id_list = this.user_object["friends_list"];
    this.n_friends = 0;
    this.friend_list = new Array();
    
    // finally, populate the friend list
    window.connection.registerHandler("friendsData", flg.fl.gotFriendsDataHandler);    
    flg.fl.populateList();
    
}

/**
 * Query for user data
*/
friendList.prototype.getMyData = function(){
    // ask server for main user data
    window.connection.send( "whoAmI", {} );
    // retrieve main user data
    window.connection.registerHandler("yourData", function(data){
	window.my_user_object = data;
	console.log("Got user data: " + JSON.stringify( window.my_user_object ));
	// only init after the user data is present
	window.flg.fl.init();
    });
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
    return this.friend_list[i]["login"];
}

/**
 * Get user avatar as text in Base64 encoding by number on FriendList.
 * @param i refers to number of index in internal friend_list
 * @return return avatar as image/gif in base64 encoding
 */
friendList.prototype.getFriendAvatar = function(i){
    return this.friend_list[i]["avatar"];
}


friendList.prototype.getFriendId = function(i){
    return this.friend_list[i]["id"];
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
    //this.friend_id_list.push(userInfo.id);
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
	user_info["id"] = list[i]["id"];	
	user_info["first_name"] = list[i]["first_name"];
	user_info["last_name"] = list[i]["last_name"];
	user_info["login"] = list[i]["login"];
	user_info["avatar"] = list[i]["avatar"];
	console.log("userinfo: " + JSON.stringify(user_info) )
	window.flg.fl.addFriend( user_info );
    }
    // update GUI component to the new friend list
    window.flg.update();
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
    window.flg.fl.addFriend( data );

}
