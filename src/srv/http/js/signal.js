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
* -> Patryk Jaworski <regalis@regalis.com.pl>
*/

var Signal = function() {
	var slots = [];

	/**
	 * @brief Emit this signal by calling all associated slots
	 *
	 * @param argument_object argument passed to slot methods/functions
	 * @return none
	 */
	this.emit = function(argument_object) {
		for (slot in slots) {
			slots[slot](argument_object);
		}
	}

	/**
	 * @brief Connect slot (function/method) to this signal
	 *
	 * @param callable slot (will be called after emit())
	 * @return none
	 */
	this.connect = function(callable) {
		slots.push(callable);
	}

	/**
	 * @brief Disconnect specific slot from this signal
	 *
	 * @param callable mathod/function to be removed from
	 * this signal
	 * @return true or false
	 */
	this.disconnect = function(callable) {
		for (slot in slots) {
			if (slots[slot] == callable) {
				slots.splice(slot, 1);
				return true;
			}
		}
		return false;
	}
}
