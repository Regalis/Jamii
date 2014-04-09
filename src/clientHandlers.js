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
*/
// module.exports = function(cm){
//     this.client_manager = cm;
// }

module.exports.whoAmIHandler = function(packet, socket){
    
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = get_user_by_session(session_id);
    
    // fix the change of socket for client
    sessions[session_id] = socket;
    clients_authenticate(socket.id, user_id);
    
    console.log("Present sessions: " + Object.keys(sessions));
    console.log("Got WhoAmi from session: " + session_id);
    console.log("Got WhoAmi from user: " + user_id);
    
    var user_obj = udb.read_user_data(user_id).strip_object() ;
    socket.emit("yourData", user_obj);
    
}
