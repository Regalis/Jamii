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
 * -> Mateusz Zajac <matteo.zajac@gmail.com>
 */
function password_change() {
   var new_password = document.getElementById("new_password").value;
   var confirm_pasword = document.getElementById("confirm_password").value;
   console.log("password_change()");
   if (confirm_pasword == new_password) {
      var current_password = document.getElementById("current_password").value;
      var data = {
         "current": current_password,
         "new": new_password
      };
      window.connection.send("password_change", data);
   } else {
      alert("Your new passwords don't match");
   }
   return false;
}



function account_change() {

   var first = document.getElementById("first_name_options").value;
   var last = document.getElementById("last_name_options").value;
   var login = document.getElementById("login_options").value;
   var email = document.getElementById("email_options").value;

   var data = {
      "login": login,
      "email": email,
      "first": first,
      "last": last
   };
   console.log(first);
   window.connection.send("account_change", data);

}

function account_reset() {

   document.getElementById("first_name_options").value = "";
   document.getElementById("last_name_options").value = "";
   document.getElementById("login_options").value = "";
   document.getElementById("email_options").value = "";
}



function micro() {
   var x = document.getElementById("microphone").checked;
   if (x) {
      alert("MIC ON");
   } else {
      alert("MIC OFF");
   }
}

function camera() {
   var x = document.getElementById("camera").checked;
   if (x) {
      alert("CAMERA ON");
   } else {
      alert("CAMERA OFF");
   }
}

function screen() {
   var x = document.getElementById("screen").checked;
   if (x) {
      alert("SCREEN ON");
   } else {
      alert("SCREEN OFF");
   }
}
