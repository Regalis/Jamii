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
 function addInit() {
	window.connection.registerHandler("sendInvitation", gotRequest );
	window.connection.registerHandler("userDataFromId2", collectRequest );
	window.connection.registerHandler( "newFriend", gotNewFriend );
	window.candidatesRequest = new Array();
 }
 
function sendInvitation(id){
    window.connection.send("sendInvitation", {"inviter":window.my_user_object["id"], "invitee":id} );
}

function gotNewFriend( data ) {	
	console.log("NEW FRIEND :")	
	console.log(JSON.stringify(data) );
	window.flg.fl.addFriend( data );
}
function gotRequest( data ){
	console.log( data );
	
	window.my_user_object["requests_list"].push( data["inviter"] );
	window.flg.fl.user_object = window.my_user_object;	
	
	alert("Someone wants to be friend with you, check your invitations");
	
/*	hideSearchForm();
	removeTableResults("tableResults");	
	document.getElementById("localVideo").style.display = "none";
	
	window.candidates = [];
	window.counterSend = 1;
	window.counterReceive = 0;
	window.perPage = 10;
	window.counterPage = -1;
	*/
	
}

function askForRequestID(){
	alert("askForRequestID");	
	
	//console.log( "friendList.gotMathchingUsersHandler: received everybody ID's, I'll ask for each ID's info" );
	//console.log( JSON.stringify( data ) );	
	
	window.candidatesRequest = [];
	window.counterSendRequest = window.my_user_object["requests_list"].length; //window.flg.fl.user_object["requests_list"].length;
	window.counterReceiveRequest = 0;
	window.perPageRequest = 10;
	window.counterPageRequest = -1;	
	
	for ( var i = 0; i < window.counterSendRequest; i++ ) {		
		var id = { "id" : window.flg.fl.user_object["requests_list"][i] };
		//console.log( "friendList.gotMathchingUsersHandler: calling getUserDataFromId for id number "+data["list"][i] );
		window.connection.send( "getUserDataFromId2", id );
	}    
}

function collectRequest ( user ){
	alert("collectRequest");	
	var user_info = {};
	
	user_info["id"] = user["id"];
	user_info["login"] = user["login"];
	user_info["first_name"] = user["first_name"];
	user_info["last_name"] = user[ "last_name" ];
	user_info["email"] = user[ "email" ];
	console.log( "friendList.collectCandidates:before pushing user_info: " );
	console.log( user_info );

	window.candidatesRequest.push( user_info );		
	window.counterReceiveRequest++;	
	
	if ( ( window.counterSendRequest == window.counterReceiveRequest ) || ( window.counterReceiveRequest % window.perPageRequest == 0 ) ){
		if ( window.counterPageRequest == -1 )
			drawTableRequest( ++window.counterPageRequest );
	}
}

function drawTableRequest( diff ){
	//var whereToDraw = document.getElementById("divForSearchResults");	
	
	var whereToDraw = document.getElementById("lWindow");	
	var tableNameID = "tableRequests";
	var currentPage = ( window.counterPageRequest + diff ) * window.perPageRequest; 

	if (  currentPage >= 0 && currentPage < window.counterSendRequest && window.counterSendRequest != 0 ){ 		
		window.counterPageRequest += diff;	
		window.removeTableResults( tableNameID );
		
		var table = document.createElement('table');
		table.setAttribute( 'id', tableNameID );
		table.setAttribute( 'align', "left");
		table.setAttribute( 'style', 'color:#ffffff');
		table.setAttribute( 'cellpadding', 1 );
		
		var trHeader = document.createElement( 'tr' );
		table.appendChild( trHeader );
		for ( var tdName in window.candidatesRequest[0] ){
			var td = document.createElement('th');
			td.innerHTML = tdName;
			trHeader.appendChild( td );
		}
		var td = document.createElement('th');
		td.innerHTML = "request";
		trHeader.appendChild( td );		
		
		var i = currentPage;
		var end = i + window.perPageRequest;
		if ( end > window.counterReceiveRequest )
			end = window.counterReceiveRequest;
		for ( ; i < end; i++ ) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			tr.setAttribute('id', i );
			console.log( window.candidatesRequest[i] );
			for ( var key in window.candidatesRequest[i] ){
				//if ( window.flg.fl.candidates[i].hasOwnProperty(key)) {
    				console.log( window.candidatesRequest[i][key]);
    				var td = document.createElement('td');
					td.innerHTML = window.candidatesRequest[i][key];
					td.setAttribute('style', 'text-align: center');
					tr.appendChild(td);
  				//}	
			}
			var td = document.createElement('td');
			td.setAttribute( 'id', window.candidatesRequest[i]["id"] );
			td.setAttribute('style', 'text-align: center');
			createButton( td, "acceptButton", "accept", clickHandler );
			createButton( td, "rejectButton", "reject", clickHandler );
			tr.appendChild(td);
		}
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.setAttribute("colspan", "6" );
		createButton( td, "prevButtonRequest", "prev", clickHandler );
		createButton( td, "nextButtonRequest", "next", clickHandler );		
		tr.appendChild( td );
		table.appendChild( tr );				
		whereToDraw.appendChild( table );
		
	}
}



