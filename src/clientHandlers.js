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
*/
var clientHandlers = function(cm, udb){
    this.cm = cm;
    this.udb = udb;
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


clientHandlers.prototype.whoAmIHandler = function(packet, socket){
    
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);
    
    // fix the change of socket for client
    this.cm.update_session_socket( session_id, socket );
    
    var user_obj = this.udb.read_user_data(user_id).strip_object() ;
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
	    var response = user_data.export_to_json();
	    response["id"] = data["id"];
	    socket.emit("userDataFromId", response);
	} catch (e) {} 
    }
    
}

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
    
    // broadcast
    for(sid in this.cm.sessions) {
	console.log(sid);
	console.log("Handling chat for: " +  this.cm.sessions[ sid ]  );
        this.cm.sessions[ sid ].emit("chatOK", data);
    }
    
}

clientHandlers.prototype.drawHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    
    // broadcast
    for(sid in this.cm.sessions) {
	console.log(sid);
	console.log("Handling draw for: " +  this.cm.sessions[ sid ]  );
        this.cm.sessions[ sid ].emit("drawOK", data);
    }
    
}

clientHandlers.prototype.password_changeHandler = function(packet, socket){

    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);

    var user_obj = this.udb.read_user_data(user_id);
    // check if current password matches                                                                                       
    if( data["current"] == user_obj["_password"] && data["current"] != "undefined" ){
	
        // @todo: validate new password                                                                                    
	
        // to be moved to separate function                                                                                
	user_obj["_password"] = data["new"];
	
        this.udb.save_user_data( user_obj );
	// end of separate function                                                                                        
	
    }else{
        // @todo: handle incorrect current password                                                                            
    }
    
    
}

// stuff for adding friends
clientHandlers.prototype.sendInvitationHandler = function(packet, socket){
    var data = strip_data_object(packet);
    // step 1 - check whether such request was not already stored; if so, ignre this package
    var invitee_id = data['invitee'];
    var inviter_id = data['inviter'];
    var invitee_obj = this.udb.read_user_data(invitee_id);
    if( invitee_obj['_requests_list'].indexOf( inviter_id ) >= 0 ){ // request was already there
	return; // ignore packet
    }

    // step 2 - pass the request to the invitee client and store in requests list
    var invitee_socket = this.cm.get_socket_by_userid( invitee_id );
    invitee_obj['_requests_list'].push( inviter_id ); // store request
    this.udb.save_user_data( invitee_obj );    
    // pass the invitation packet
    invitee_socket.emit("sendInvitation", data);

}

clientHandlers.prototype.invitationResponseHandler = function(packet, socket){
    var data = strip_data_object(packet);

    var invitee_id = data['invitee'];
    var inviter_id = data['inviter'];
    var result = data['answer'];
    var invitee_obj = this.udb.read_user_data(invitee_id);

    if( result == 0 ){ // request rejected by invitee, ignore
	// @todo: do something smarter here rather than ignore
    }else{ // if response positive
	var index = invitee_obj['_requests_list'].indexOf( inviter_id );
	if( index >= 0 ){ // remove request from list
	    invitee_obj['_requests_list'].splice( index, 1 );
	}
	
	
    }

}


module.exports.clientHandlers = clientHandlers;
