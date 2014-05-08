usersDatabase = require('./usersDatabase.js');

/** 
	Function to retreieve data object from object received by a socket
	Could do some additional checking for session ID if necesary.

	@param cargo object received directly by a socket
	@return data object taken from cargo object
*/
var  strip_data_object = function(cargo) {
	var data = cargo["data"];
	return data;
}





/**
   @class
   Constructor of clientHandlers class
   
   @param cm clientManager object to be accesed by the handlers
   @param udb usersDatabase object
   @param cfm conferenceManager object
*/
var clientHandlers = function(cm, udb, cfm){
    this.cm = cm;
    this.udb = udb;
    this.cfm = cfm;
}



clientHandlers.prototype.loginHandler =  function(data, socket){
    
    console.log("Got login data from client");
    var ret = this.cm.user_login(strip_data_object(data));
    if (ret >= 0) { // login OK
	var user_id = ret;
	// start a new session after successful login
	var session_id = this.cm.start_client_session(socket);
	console.info("Assigning session ID: " + session_id + "to user ID: " + user_id);
//	clients_register(socket.id);
	socket.emit("loginOK", {"userID":user_id, "sessionID":session_id});
	this.cm.register_client( user_id, session_id );
//	clients_authenticate(socket.id, user_id);
//	console.log("cliients"	+ clients);
//	console.log("cliients"	+ sessions);
    } else if(ret == -1) { // no such user
	socket.emit("loginBAD", {"what": "Wrong user or password"});
    } else if(ret == -2) { // login OK
	socket.emit("loginBAD", {"what": "Wrong user or password"});	
    }
    
}


clientHandlers.prototype.whoAmIHandler = function(packet, socket) {
    var session_id = packet.sessionID;
	console.log("WhoAmI handler... packet: " + JSON.stringify(packet));
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);
	console.log("userId: " + user_id);
	
	var user_obj = new usersDatabase.User();

	if (user_id != undefined) {
		// fix the change of socket for client
		this.cm.update_session_socket(session_id, socket);
		user_obj = this.udb.read_user_data(user_id).strip_object() ;
	} else {
		user_obj.id = -1;
	}
    socket.emit("yourData", user_obj);
}


clientHandlers.prototype.registerHandler = function(packet, socket){

    console.info("Got register packet: " + packet);
    console.log(packet);	
    
    data = strip_data_object( packet );
    
    var User = require("./usersDatabase.js").User;
    var new_user = new User();
    new_user["_email"] = data["email"];
    new_user["_login"] = data["login"];
    new_user["_first_name"] = data["first_name"];
    new_user["_last_name"] = data["last_name"];
    new_user["_password"] = data["passwd"];
    new_user["_registration_date"] = Date.now();
    
    // TODO: validate user data...
    
    try {
	var id = this.udb.register_new_user(new_user);
	console.log("New user successfully registerd with id: " + id.toString());
	socket.emit("registerOK", {'login': new_user['_login']});
    } catch (e) {
	console.log("Unable to register new user: " + e);
    }

}


clientHandlers.prototype.getUserDataFromIdHandler = function(packet, socket){
    
    var data = strip_data_object( packet );
    if (!isNaN(data["id"])) {
	var user_data;
	try {
	    user_data = this.udb.read_user_data(data["id"]);
	    // TODO: strip object
	    var response = user_data.strip_object();
	    response["id"] = data["id"];
	    socket.emit("userDataFromId", response);
	} catch (e) {} 
    };
    
}

// for friend adding  - temporary
clientHandlers.prototype.getUserDataFromIdHandler2 = function(packet, socket){
    
    var data = strip_data_object( packet );
    if (!isNaN(data["id"])) {
	var user_data;
	try {
	    user_data = this.udb.read_user_data(data["id"]);
	    // TODO: strip object
	    var response = user_data.strip_object();
	    response["id"] = data["id"];
	    socket.emit("userDataFromId2", response);
	} catch (e) {} 
    }
    
}
// end temporary

clientHandlers.prototype.searchFriendsHandler = function(packet, socket){
    var data = strip_data_object( packet );
    var results = this.udb.findUsersMultiKey(data);
    socket.emit("matchingUsers", {'list': Object.keys(results)});	
    
}

clientHandlers.prototype.getFriendsDataHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    
    console.log(data);
    
    var response = {};
    response["user_data_list"] = [];
    
    console.info("asked for friends data: " + data["list"]);
    
    var udb_local = this.udb;

    data["list"].forEach(function(id) {
	var user = udb_local.read_user_data(id).strip_object();
	// TODO: control if user exists in database
	// TODO: append status information to the useer object
	response["user_data_list"].push(user);
    });
    
    socket.emit("friendsData", response);
    
}

clientHandlers.prototype.chatHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session( session_id );

    this.cfm.broadcast_me_too( user_id, "chatOK", data );
}

clientHandlers.prototype.drawHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session( session_id );

    this.cfm.broadcast( user_id, "drawOK", data );
}

// for managing the account
clientHandlers.prototype.password_changeHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);

    var user_obj = this.udb.read_user_data(user_id);
	console.log("password_changeHandler: " + JSON.stringify(user_obj));
    // check if current password matches
    if (this.cm.user_login({'login': user_obj['_login'], 'passwd': data['current']}) > 0 && data["current"] != undefined) {

        // @todo: validate new password

        // to be moved to separate function
		user_obj["_password"] = this.udb.get_password_hash(user_obj, data["new"]);
        this.udb.save_user_data( user_obj );
		socket.emit("password_change_confirmation", {});

    }else{
        // @todo: handle incorrect current password
		socket.emit("password_change_error", {});
    }
}

clientHandlers.prototype.account_changeHandler = function(packet, socket){

    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);

    var user_obj = this.udb.read_user_data(user_id);
    
    // check data for validity and change if possible                                                                         
    if( data["last"] != "" ){
	user_obj["_last_name"] = data["last"];
    }
    if( data["first"] != "" ){
	user_obj["_first_name"] = data["first"];
    }
    if( data["login"] != "" ){
	user_obj["_login"] = data["login"];
    }
    if( data["email"] != "" ){
	user_obj["_email"] = data["email"];
    }
    
    this.udb.save_user_data( user_obj );
    
}


clientHandlers.prototype.avatar_changeHandler = function(packet, socket){
    
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session( session_id );
    var new_avatar = data["avatar"];

    // @todo: resize the received image to avatar size before storing
    var user_obj = this.udb.read_user_data(user_id);
    user_obj["_avatar"] = new_avatar;
    this.udb.save_user_data( user_obj );

}


// stuff for adding friends

clientHandlers.prototype.sendInvitationHandler = function(packet, socket){
    var data = strip_data_object(packet);
    // step 1 - check whether such request was not already stored; if so, ignre this package
    var invitee_id = parseInt( data['invitee'] );
    var inviter_id = parseInt( data['inviter'] );
    var invitee_obj = this.udb.read_user_data(invitee_id);
    var indexRequest = invitee_obj['_requests_list'].indexOf( inviter_id );
    var indexFriends = invitee_obj['_friends_list'].indexOf( inviter_id );
    if( indexRequest >= 0 || indexFriends >= 0 || invitee_id == inviter_id ){ // request was already there
		return; // ignore packet
    }
	else {
    // step 2 - pass the request to the invitee client and store in requests list
    var invitee_socket = this.cm.get_socket_by_userid( invitee_id );
    invitee_obj['_requests_list'].push( Number(inviter_id) ); // store request
    this.udb.save_user_data( invitee_obj );    
    // pass the invitation packet
    if( invitee_socket != null ){
	invitee_socket.emit("sendInvitation", data);
    }
	}

}

clientHandlers.prototype.invitationResponseHandler = function(packet, socket){
    var data = strip_data_object(packet);

    var invitee_id = data['invitee'];
    var inviter_id = data['inviter'];
    var result = data['answer'];
    var invitee_obj = this.udb.read_user_data(invitee_id);
    var inviter_obj = this.udb.read_user_data(inviter_id);
	if ( invitee_obj['_friends_list'].indexOf( parseInt( inviter_id )) >= 0 )	//they are already
		return;
    if( result == 0 ){ // request rejected by invitee, ignore
	// @todo: do something smarter here rather than ignore
		var index = invitee_obj['_requests_list'].indexOf( inviter_id );
		if ( index >= 0 )
			invitee_obj['_requests_list'].splice( index, 1 );
    }else{ // if response positive

	// update friendship information
	if( invitee_obj._friends_list.indexOf( inviter_id ) < 0 ){
	    invitee_obj._friends_list.push( Number(inviter_id) )
	}
	if( inviter_obj._friends_list.indexOf( invitee_id ) < 0 ){
	    inviter_obj._friends_list.push( Number(invitee_id) )
	}

	// send "newFriend" packages to both sides
	var invitee_socket = this.cm.get_socket_by_userid( invitee_id );
	var inviter_socket = this.cm.get_socket_by_userid( inviter_id );
	
	invitee_socket.emit("newFriend", inviter_obj );
	inviter_socket.emit("newFriend", invitee_obj );	
    }
    
    var index = invitee_obj['_requests_list'].indexOf( inviter_id );
    if( index >= 0 ){ // remove request from list
	invitee_obj['_requests_list'].splice( index, 1 );
    }
    this.udb.save_user_data( invitee_obj );    
    this.udb.save_user_data( inviter_obj );    
    
}


// handlers for conference management
clientHandlers.prototype.conf_createHandler = function(packet, socket){
    var data = strip_data_object(packet);
    
    console.log("CONFCREATEHANDLER: " + JSON.stringify( data ) );

    var admin_id = Number( data['my_id'] );
    var first_friend = Number( data['user_id'] );
    // @todo: retrieve and use visibilty information
    this.cfm.create_conference( admin_id );
    
    // invite first friend
    var ff_sock = this.cm.get_socket_by_userid( first_friend );
    var to_send = {"admin_id":admin_id};
    if( ff_sock != null ){
	ff_sock.emit("conf_invitation", to_send);
    }

}

clientHandlers.prototype.conf_requestHandler = function(packet, socket){
    var data = strip_data_object(packet);
    
    var admin_id = Number( data['my_id'] );
    var user_id = Number( data['user_id'] );
    // @todo: retrieve and use visibilty information
    
    // invite friend
    var ff_sock = this.cm.get_socket_by_userid( user_id );
    var to_send = {"admin_id":admin_id};
    if( ff_sock != null ){
	ff_sock.emit("conf_invitation", to_send);
    }

}

clientHandlers.prototype.conf_requestHandler = function(packet, socket){
    var data = strip_data_object(packet);
    
    var admin_id = Number( data['my_id'] );
    var user_id = Number( data['user_id'] );
    // @todo: retrieve and use visibilty information
    
    // invite friend
    var ff_sock = this.cm.get_socket_by_userid( user_id );
    var to_send = {"admin_id":admin_id};
    if( ff_sock != null ){
	ff_sock.emit("conf_invitation", to_send);
    }

}

clientHandlers.prototype.conf_responseHandler = function(packet, socket){
    var data = strip_data_object(packet);
    
    var admin_id = Number( data['admin_id'] );
    var user_id = Number( data['user_id'] );
    var response = data['response'] ;

    if( response ){
	this.cfm.add_user_to_conf(admin_id, user_id);
    }else{
	// maybe notify inviter of the refusal
	
    }    
    // maybe notify inviter of the refusal
    var sock = this.cm.get_socket_by_userid( admin_id );
    if( sock != null ){
	sock.emit("conf_response", data);
    }
	
    console.log("conference "+ JSON.stringify(this.cfm.conferences));
    
}
clientHandlers.prototype.removeFriendHandler = function(packet, socket){
    var data = strip_data_object(packet);

    var user_id = data['user_id'];
    var friend_id = data['friend_id'];
    
    var user_obj = this.udb.read_user_data( parseInt(user_id ) );
    var friend_obj = this.udb.read_user_data( parseInt( friend_id) );
	
	var friend_obj_index = friend_obj['_friends_list'].indexOf( parseInt( user_id ) );	
	var user_obj_index = user_obj['_friends_list'].indexOf( parseInt( friend_id ) );	
	
	
	if ( friend_obj_index >= 0 ){
		friend_obj['_friends_list'].splice( user_obj_index, 1 );
	}
	
	if ( user_obj_index >= 0 ){	
		user_obj['_friends_list'].splice( friend_obj_index, 1 );
	}	

    this.udb.save_user_data( user_obj );    
    this.udb.save_user_data( friend_obj );    
    //TODO: in future if you want to notify "friend" that he was deleted then you must store that somewhere in serv in case 
    //he is not logged in but you still should check if he is logged now and send him some notification because he
    //has you on his list
    
}

module.exports.clientHandlers = clientHandlers;
