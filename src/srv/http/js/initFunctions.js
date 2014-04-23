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
 *  -> Mateusz Zajac<matteo.zajac@gmail.com>
 * 
 */

/** 
 *  Init function creating necessaty objects and registering handlers for packets.
 *  To be called after successful user login.
 *
*/
function initMainScreen(){
	 window.selected = "me";
    window.connection = new ConnectionManager("http://localhost","9393");
    
    // inside FriendListGUI constructor, friendList is created as flg.fl
    flg = new FriendListGUI("friendList");
    window.flg = flg;
    


}
/*
* Initialize
*/
window.onload = function() {
    initMainScreen();
	clickDiv();

    document.getElementById("send").onclick = function() {
    	send();
    }
    document.getElementById("searchForm").style.visibility = "hidden";
    
    
	document.getElementById("search_button").onclick = function() {
		
		if ( validate() ) {
		 	var data  = {};
		 	data ["login"] = document.getElementById("login").value;
		 	data ["first_name"] = document.getElementById("first_name").value;
		 	data ["last_name"] = document.getElementById("last_name").value;
		 	data ["email"] = document.getElementById("email").value;
		
			document.getElementById("searchForm").style.visibility = "hidden";	    
		    window.flg.fl.searchFriends( data );
		 }
		 else {
			alert("Uzupelnij chociaz jedno pole");
		}
	
	}
}

function onResize(){
  
}
