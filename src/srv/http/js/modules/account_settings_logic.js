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
 *  -> Mateusz Zajac<matteo.zajac@gmail.com>
 *
 */


var AccountSettingsLogic = function() {

	this.init = function() {
		this.gui.signal_settings_change.connect(this.account_change_request_handler);
		window.connection.registerHandler("account_change_response", this.account_change_response_handler);
  /*    window.JamiiCore.signal_user_data_available.connect(function(){
         var user = window.JamiiCore.get_current_user_data();
			window.JamiiCore.get_module_logic("account_settings").signal_current_settings.emit(user);
      });
*/
	window.JamiiCore.signal_module_ready.connect(function(module){

		if(module=="account_settings"){
		   var user = window.JamiiCore.get_current_user_data();

			window.JamiiCore.get_module_logic("account_settings").signal_current_settings.emit(user);
		alert("AAAAAAAAAAAA");
		}

	});
 
	}

	this.account_change_response_handler = function (data) {
		signal_account_change_response.emit(data);
	}

	this.account_change_request_handler = function (data) {

      window.connection.send("account_change",data);

      if(!data["current"].isEmpty()){
         if (data ["confirm"] == data ["new"]) {
            var pass = {
               "current": data ["current"],
               "new": data ["new"]
            };
            window.connection.send("password_change", pass);
         } else {
            alert("Your new passwords don't match");
         }
      }



	}
   this.signal_current_settings = new Signal();

	this.signal_account_change_response = new Signal();
}
