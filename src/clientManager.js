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
    return this.clients[ session_id ];
}

/** 
	dummy function imitating checking login data

	@param data data object received with the "login" packet
	@return userID if user exists and login OK, -1=no user with login, -2=wrong passwd
*/
clientManager.prototype.user_login = function( data ){
    
    var user = this.udb.findUsers("login", data.login);
    if (Object.keys(user).length != 1) {
	return -1;
    }
    var user_id = Object.keys(user)[0];
    if (data.passwd ==	user[ user_id ]._password && typeof data.passwd != 'undefined') {
	console.info("User " + user[ user_id ]._login + " successfully logged in");
	return user_id;
    } else {
	return -2;
    }
    return 1; 
    
}

/** 
    Function to update the association of socket to session ID, to be called when handling the "whoAmI" package

	@param sessionID ID of the session from which the "whoAmI" packet was received
	@param socket_object socket.io object which received the packet

	This function is necessary to allow for restoring an interrrupted session. If the client reconnects during an already open session, his socket on the server might have changed. This function, called from clientHandlers.whoAmIHandler (which is the first handler called after re-connection) updates the socket information of this client.
*/
clientManager.prototype.update_session_socket = function( session_id, socket_object ){
    
    sessions[ session_id ] = socket_object;
    
}

module.exports.clientManager = clientManager;

