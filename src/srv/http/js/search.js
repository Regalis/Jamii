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
 *  -> Mateusz Folwarski <mateusz.folwarski@uj.edu.pl>
 * 
 */
 
/** 
 * Send request with user data to server.
 * Server will find list of users matching the given data and
 * respond with a "matchingUsers" packet containing a list of IDs.
 * @param data data with user info to find; form:
 *  {"login": "...", "first_name":"...", "last_name":"...", "email":"..."}
 *  where "..." may be an empty string but at least one of the above values
 *  will not be empty.
 */

function search(){
	window.connection.registerHandler("matchingUsers", gotMathchingUsersHandler );	
	window.connection.registerHandler("userDataFromId", collectCandidates );  
	window.candidates = new Array(); //for search
}

function searchFriendsLogic(data){
	console.log(JSON.stringify(data)); 
    window.connection.send("searchFriends", data);
}

/**
 * Handler function for reception of the "matchingUsers" packet
 * Sends request for detailed data if the candidates. The rest
 * is performed by the {@link gotCandidatesDataHandler} on
 * reception of the server's response.
 * @param data data part of the received packet; is of the form
 *  {'list':[id1,id2,id3,...]} 
 */
function gotMathchingUsersHandler(data){
	console.log( "friendList.gotMathchingUsersHandler: received everybody ID's, I'll ask for each ID's info" );
	console.log( JSON.stringify( data ) );	
	
	window.candidates = [];
	window.counterSend = data["list"].length;
	window.counterReceive = 0;
	window.perPage = 10;
	window.counterPage = -1;	
	
	for ( var i = 0; i < data["list"].length; i++ ) {
		var id = { "id" : data[ "list" ][i] };
		console.log( "friendList.gotMathchingUsersHandler: calling getUserDataFromId for id number "+data["list"][i] );
		window.connection.send( "getUserDataFromId", id );
	}    
}


function collectCandidates ( user ){	
	var user_info = {};
	
	user_info["id"] = user["id"];
	user_info["login"] = user["login"];
	user_info["first_name"] = user["first_name"];
	user_info["last_name"] = user[ "last_name" ];
	user_info["email"] = user[ "email" ];
	console.log( "friendList.collectCandidates:before pushing user_info: " );
	console.log( user_info );

	window.candidates.push( user_info );		
	window.counterReceive++;	
	
	if ( ( window.counterSend == window.counterReceive ) || ( window.counterReceive % window.perPage == 0 ) ){
		if ( window.counterPage == -1 )
			drawTableResults( ++window.counterPage );
	}
}