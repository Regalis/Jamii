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

    this.socket.on("loginOK", function(data){
	this.sessionID = data["sessionID"];
	this.userID = data["userID"];
	console.log("Got session ID: " + this.sessionID );
	// store a cookie representing the session
	document.cookie="sessionID="+this.sessionID;
	document.cookie="userID=" + this.userID;
	// finally, reload page
	window.location.href = "/page2.html"
    });
    
    this.socket.on("yourData", function(data){
	if( data['id'] < 0 ){ // wrong user data
	    alert("Clean your cokies please...");
	}else{
	    // if sessionID in a cookie is already present  AND HAS VALID DATA, load main screen directly
	    if(  window.location.href.slice(-10) != "page2.html" ){
		window.location.href = "/page2.html";
	    }
	}
    });

    // read cookie to check if session ID already assigned
    var cookie = document.cookie;
    this.sessionID = this.getValue( cookie, "sessionID" );
    if( this.sessionID == "" ){ // fresh connection before login
	// message counter
	this.counter = 0;
    }else{ // cookie set
	
	this.send( "whoAmI", {} );

	this.userID = this.getValue( cookie, "userID" );
	console.log( "Restored session: " + this.sessionID + " for user: " + this.userID );
	window.my_user_id = this.userID;
	
    }
    
    
}


ConnectionManager.prototype.getValue = function( cookie, key ){
    var name = key+"=";
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


ConnectionManager.prototype.logout = function( ){
    this.send("logout", {});
    // clear cookies
    document.cookie="sessionID=;"+'expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie="userID=;"+'expires=Thu, 01 Jan 1970 00:00:01 GMT;'; 
    window.location.href = "/index.xhtml";
}
