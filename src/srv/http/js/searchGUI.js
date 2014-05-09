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
function searchInit(){
	searchFormInit();
	search();
	addInit();
}

function searchFormInit(){
	document.getElementById("searchForm").style.display = "none";
	//document.getElementById("divForSearchResults").style.display = "none";	
	document.getElementById("add_friend").onclick = toggleSearchForm;
	document.getElementById("search_button").onclick = searchFriends;
}

function formValidate(){
	var inputs = document.getElementsByClassName("valid");
	for ( var i = 0; i < inputs.length; ++i ) {
		if ( inputs[i].value != "")
			return true;
	}
	return false;
}

function toggleSearchForm () {
	window.removeTableResults( "tableRequests" );

	//document.getElementById("divForSearchResults").style.display = "none";
	var searchForm = document.getElementById("searchForm");
	searchForm.style.display == "none" ? searchForm.style.display = "block" : searchForm.style.display = "none";
	removeTableResults("tableResults");
}

function searchFriends() {
	if ( formValidate() ) {
		var data = {};
		data ["login"] = document.getElementById("login").value;
		data ["first_name"] = document.getElementById("first_name").value;
		data ["last_name"] = document.getElementById("last_name").value;
		data ["email"] = document.getElementById("email").value;

		toggleSearchForm();	//document.getElementById("searchForm").style.display = "none";
		
		for ( i in data) 
			document.getElementById(i).value = "";
		searchFriendsLogic( data );
	 	//document.getElementById("divForSearchResults").style.display = "block";
	}
	else
		alert("Uzupelnij chociaz jedno pole");
}

function drawTableResults( diff ){
	//var whereToDraw = document.getElementById("divForSearchResults");	
	
	var whereToDraw = document.getElementById("lWindow");	
	var tableNameID = "tableResults";
	var currentPage = ( window.counterPage + diff ) * window.perPage; 

	if (  currentPage >= 0 && currentPage < window.counterSend && window.counterSend != 0 ){ 		
		window.counterPage += diff;	
		window.removeTableResults( tableNameID );
		
		var table = document.createElement('table');
		table.setAttribute( 'id', tableNameID );
		table.setAttribute( 'align', "left");
		table.setAttribute( 'style', 'color:#ffffff');
		table.setAttribute( 'cellpadding', 1 );
		
		var trHeader = document.createElement( 'tr' );
		table.appendChild( trHeader );
		for ( var tdName in window.candidates[0] ){
			var td = document.createElement('th');
			td.innerHTML = tdName;
			trHeader.appendChild( td );
		}
		var td = document.createElement('th');
		td.innerHTML = "request";
		trHeader.appendChild( td );		
		
		var i = currentPage;
		var end = i + window.perPage;
		if ( end > window.counterReceive )
			end = window.counterReceive;
		for ( ; i < end; i++ ) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			tr.setAttribute('id', i );
			console.log( window.candidates[i] );
			for ( var key in window.candidates[i] ){
				//if ( window.flg.fl.candidates[i].hasOwnProperty(key)) {
    				console.log( window.candidates[i][key]);
    				var td = document.createElement('td');
					td.innerHTML = window.candidates[i][key];
					td.setAttribute('style', 'text-align: center');
					tr.appendChild(td);
  				//}	
			}
			var td = document.createElement('td');
			td.setAttribute( 'id', window.candidates[i]["id"] );
			td.setAttribute('style', 'text-align: center');
			createButton( td, "sendButton", "send", clickHandler );
			tr.appendChild(td);
		}
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.setAttribute("colspan", "6" );
		createButton( td, "prevButton", "prev", clickHandler );
		createButton( td, "nextButton", "next", clickHandler );		
		tr.appendChild( td );
		table.appendChild( tr );				
		whereToDraw.appendChild( table );
		
	}
}

function removeTableResults ( tableID ){
	var table = document.getElementById(tableID);	
	if( table ) 
		table.parentNode.removeChild( table );	
}


function createButton( where, inName, value, func ){
	var input = document.createElement( 'input' );
	input.setAttribute( 'type', 'button');	
	input.setAttribute('value', value );
	input.setAttribute('name', inName );
	input.onclick = func;
	where.appendChild( input );
}


function clickHandler( evt ){
	var node = evt.target || evt.srcElement;	
	if ( node.name == "sendButton" && node.value == "send" ){ 
		node.value = "sended";
		alert( 'inviter: ' +window.my_user_object["id"] +"\ninvitee: " +node.parentNode.id );		
		sendInvitation( node.parentNode.id );
	}	
	if ( node.name == "prevButton" )
		drawTableResults( -1 );
	if ( node.name == "nextButton" )
		drawTableResults( 1 );
	if ( node.name == "acceptButton" && node.value == "accept" ){
		alert("accept");
		node.value = "accepted";
		//remove from window.user_object.["requests_list"]				
		var index = window.my_user_object["requests_list"].indexOf( node.parentNode.id );
		if ( index > -1 ){
			window.my_user_object["requests_list"].splice( index, 1 );
		}
		
		//alert( "inviter"+node.parentNode.id + "invitee"+window.my_user_object["id"] );		
		window.connection.send( "invitationResponse", {"inviter":node.parentNode.id, "invitee":window.my_user_object["id"], "answer":1} );
	
	}
	if ( node.name == "rejectButton" && node.value == "reject" ){
		node.value = "rejected";
		//remove from window.user_object["requests_list"]		
		var index = window.my_user_object["requests_list"].indexOf( node.parentNode.id );
		if ( index > -1 )
			window.my_user_object["requests_list"].splice( index, 1 );			
		window.connection.send( "invitationResponse", {"inviter":node.parentNode.id, "invitee":window.my_user_object["id"], "answer":0} );
	}
	if ( node.name == "prevButtonRequest" )
		drawTableRequest( -1 );
	if ( node.name == "nextButtonRequest" )
		drawTableRequest( 1 );
}

