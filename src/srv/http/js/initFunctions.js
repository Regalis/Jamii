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

    window.connection = new ConnectionManager("http://localhost","9393");
        
	//call searchFormInit to prepare to show search form if Add Friend button is pushed     
    searchInit();
	addInit();
    
    // inside FriendListGUI constructor, friendList is created as flg.fl
    window.flg = new FriendListGUI("friendList");
    var w=document.getElementById('lWindow').offsetWidth;
	var h=document.getElementById('lWindow').offsetHeight;
	document.getElementById("localVideo").style.height=h;

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

}

function onResize(){
    var w=document.getElementById('lWindow').offsetWidth;
    var h=document.getElementById('lWindow').offsetHeight;

    document.getElementById("localVideo").style.height=h;
}