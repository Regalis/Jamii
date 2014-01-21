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
 *  Init function creating necessaty objects and registering handlers for packets.
 *  To be called after successful user login.
 *
*/
function initMainScreen(){

    window.connection = new ConnectionManager("http://localhost","9393");
    
    // inside FriendListGUI constructor, friendList is created as flg.fl
    flg = new FriendListGUI("fList");
    window.flg = flg;

    // register handlers
    window.connection.registerHandler("friendsData", flg.fl.gotFriendsDataHandler);

    // request friend contacts from server
    flg.fl.populateList();
    
    
}
