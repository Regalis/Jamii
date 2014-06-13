/**
   @class
   Constructor of clientManager class
   
   @param udb object of class UsersDatabase to be used to load and store user information

*/
var clientManager = function( udb ){
    
    this.session_counter = 0;
    this.sessions = {}; // dict: sessionID : socket object
    this.clients  = {}; // dict: sessionID : userID
    
    this.udb = udb;

}
// "Public" methods

/**
   Starts a new session for a connecting client
   @param socket_object socket io socket object - the one which received the connection of this client
*/
clientManager.prototype.start_client_session = function( socket_object ){

    this.session_counter++;
    // subsequent numbers of the session on the server are used as session ID-s
    this.sessions[ this.session_counter ] =  socket_object;
    return this.session_counter;
}

/**
   Adds an identified user to the manager.
   @param user_id ID of the user
   
   To be called after successful login
*/
clientManager.prototype.register_client = function( user_id, session_id ){
    
    this.clients[ session_id ] = user_id;
    
}

clientManager.prototype.get_user_by_session = function( session_id ){
	console.log("Sessions: " + JSON.stringify(this.clients));
	console.log("Requested session id: " + session_id);
    return this.clients[ session_id ];
}

clientManager.prototype.get_socket_by_userid = function( user_id ){

    var session_id = -1;

    for( var sid in this.clients ){
		if( this.clients[sid] == user_id ){
			session_id = sid;
		}
    }

    if( session_id  == -1 ){
		return null;
    }

    return this.sessions[ session_id ];
}


/** 
	dummy function imitating checking login data

	@param data data object received with the "login" packet
	@return userID if user exists and login OK, -1=no user with login, -2=wrong passwd
*/
clientManager.prototype.user_login = function( data ){
    
    var users = this.udb.findUsers("login", data.login);
    if (Object.keys(users).length != 1) {
		return -1;
    }

    var user_id = Object.keys(users)[0];
	console.log(this.udb.get_password_hash(users[user_id], data.passwd));
	console.log(users[user_id]._password);
    if (this.udb.get_password_hash(users[user_id], data.passwd) == users[user_id]._password && typeof data.passwd != 'undefined') {
		console.info("User " + users[user_id]._login + " successfully logged in");
		return user_id;
    } else {
		return -2;
    }
    return -1; 
}

/** 
    Function to update the association of socket to session ID, to be called when handling the "whoAmI" package

	@param sessionID ID of the session from which the "whoAmI" packet was received
	@param socket_object socket.io object which received the packet

	This function is necessary to allow for restoring an interrrupted session. If the client reconnects during an already open session, his socket on the server might have changed. This function, called from clientHandlers.whoAmIHandler (which is the first handler called after re-connection) updates the socket information of this client.
*/
clientManager.prototype.update_session_socket = function(session_id, socket_object, conf_manager) {
    this.sessions[session_id] = socket_object;
    // retrieve socket.io room after reconnection with new socket
    var user_id = this.get_user_by_session( session_id );
    var conf = conf_manager.get_conf_by_user( user_id );
    if( conf != undefined ){ // only idf user was in conference
	socket_object.join( conf.room_name );
    }
}

module.exports.clientManager = clientManager;

