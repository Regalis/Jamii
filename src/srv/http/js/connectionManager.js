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
 *
 */


/**
 * Creates a Connection Manager object - wrapper around the socket
 *
 * @param serverAddr address of the server, e.g 'http://127.0.0.1'
 * @param serverPort port number to access the server
 *
 */
function ConnectionManager( serverAddr, serverPort ){

    // TODO: error control
    this.socket = io.connect( serverAddr + ":" + serverPort );   

    // read cookie to check if session ID already assigned
    var cookie = document.cookie;
    this.sessionID = this.getSession( cookie );
    if( this.sessionID == "" ){ // fresh connection before login
	// message counter
	this.counter = 0;
	this.socket.on("loginOK", function(data){
	    this.sessionID = data["sessionID"];
	    console.log("Got session ID: " + this.sessionID );
	    // store a cookie representing the session
	    document.cookie="sessionID="+this.sessionID;
	});
    }else{
	console.log( "Restored session: " + this.sessionID );
    }
    
    
}


ConnectionManager.prototype.getSession = function( cookie ){
    var name = "sessionID=";
    var ca = cookie.split(';');
    for(var i=0; i<ca.length; i++) {
	var c = ca[i].trim();
	if ( c.indexOf(name)==0 ) 
	    return c.substring(name.length,c.length);
    }
    return "";
}


/**
 * Sends a request along with a 'data' JSON object to the server
 * Wraps the data object to be sent into an object with three fields:
 * the session id, message number and the data object 
 *
 * @param header text identifying type of the request
 * @param data data object to be sent; its structure depends on the header
 *
 */
ConnectionManager.prototype.send = function( header, data ){

    this.counter++;

    var cargo = {};
    cargo['sessionID'] = this.sessionID;
    cargo['number'] = this.counter;
    cargo['data'] = data;
    
    this.socket.emit( header, cargo );

}

/**
 * Associates a function with a header of received message
 * The function given as handlerFunction should accept one
 * parameter - the data object received from the server along
 * with a packet.
 * This function will be called when a packet with the given header
 * is received from server
 *
 * @param header header of the packet whose reception will trigger the handler function
 * @param handlerFunction function to process the received packet
 *
 */
ConnectionManager.prototype.registerHandler = function( header, handlerFunction ){
    this.socket.on( header, handlerFunction );
}
