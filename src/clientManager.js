/**
   @class
   Constructor of clientManager class
   
*/
var clientManager = function(){
    
    this.session_counter = 0;
    this.sessions = {}; // dict: sessionID : socket object
    this.clients  = {}; // dict: sessionID : userID
    

    
}


// "Public" methods

/**
   Starts a new session for a connecting client
   @param socket_object socket io socket object - the one which received the connection of this client
*/
clientManager.prototype.start_client_session = function( socket_object ){
    this.sessionCounter++;
    // subsequent numbers of the session on the server are used as session ID-s
    this.sessions[ this.sessionCounter ] =  socket_object;
    return this.sessionCounter;
}

/**
   Adds an identified user to the manager.
   @param user_id ID of the user
   
   To be called after successful login
*/
clientManager.prototype.register_client = function( user_id, session_id ){
    
    clients[ session_id ] = user_id;
    
}

