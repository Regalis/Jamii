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

var JamiiCore = function() {

	var modules_dir = "/js/modules/";

	/** @brief dictionariy of currently loaded and initialized modules
	 *
	 * keys: lowercased module names
	 * values: {"logic": ModuleLogic, "gui": ModuleGui}
	 */
	var core_modules = {};
	
	/**
	 * @brief Load specific Jamii module into current page
	 *
	 * Load operation looks like follow:
	 *  -> create <script> DOM element for module's logic
	 *  -> create <script> DOM element for module's GUI
	 *  -> set attribute "src" in both logic and GUI by 
	 *     appending "_logic.js"/"_gui.js" to module_name;
	 *  -> append both <script> elements into <head>
	 *  -> initialize module by calling:
	 *     (module_name)Logic.init();
	 *     (module_name)Gui.init();
	 *     where (module_name) has uppercased first letter
	 *
	 * @param module_name Jamii module name or array of module names
	 * @return none;
	 */
	this.load_module = function(module_name) {
		console.log("[I] Trying to load module " + module_name);
		module_name = module_name.toLowerCase();
		var logic_script = document.createElement("script");
		var gui_script = document.createElement("script");
		
		logic_script.setAttribute("type", "text/javascript");
		logic_script.setAttribute("src", modules_dir + module_name + "_logic.js");
		gui_script.setAttribute("type", "text/javascript");
		gui_script.setAttribute("src", modules_dir + module_name + "_gui.js");
		document.getElementsByTagName("head")[0].appendChild(logic_script);
		document.getElementsByTagName("head")[0].appendChild(gui_script);

		var logic_obj = get_module_class_prefix(module_name) + "Logic";	
		var gui_obj = get_module_class_prefix(module_name) + "Gui";	

		var error_handler = function() {
			console.log("[E] JamiiCore::load_module: Error while loading " + this.getAttribute("src"));
		}

		gui_script.onerror = error_handler;
		logic_script.onerror = error_handler;

		gui_script.onload = function() {
			if (window[gui_obj] == undefined) {
				console.log("[E] JamiiCore::load_module: Class " + gui_obj + " does not exists...");
				return;
			}
			var gui_mod = register_module_object(module_name, "gui", new window[gui_obj]());
			logic_script.onload = function() {
				if (window[logic_obj] == undefined) {
					console.log("[E] JamiiCore::load_module: Class " + logic_obj + " does not exists...");
					return;
				}
				var logic_mod = register_module_object(module_name, "logic", new window[logic_obj]());
				gui_mod.logic = logic_mod;
				logic_mod.gui = gui_mod;
				logic_mod.init();
				gui_mod.init();
				console.log("[I] JamiiCore::load_module: Module '" + module_name + "' initialized");
			}
		}
	}

	this.is_module_loaded = function (module_name) {
		return (module_name in core_modules);
	}

	this.get_module_logic = function (module_name) {
		return core_modules[module_name]["logic"];
	}

	this.get_module_gui= function (module_name) {
		return core_modules[module_name]["gui"];
	}

	this.init = function() {
		var host = window.location.host;
		if (host.indexOf(':') != -1) {
			host = host.substring(0, host.indexOf(':'));
		}
		window.connection = new ConnectionManager("http://" + host,"9393");

		modules_to_load = ['conferention', 'chat', 'file_share', 'account_settings'];
		for (i in modules_to_load) {
			this.load_module(modules_to_load[i]);
		}
	}

	var register_module_object = function(name, type, obj) {
		if (core_modules[name] == undefined)
			core_modules[name] = {};
		core_modules[name][type] = obj;
		console.log("[I] JamiiCore::register_module_object: Registered core module '" + name + "' of type '" + type + "'");
		return obj;
	}

	var get_module_class_prefix = function (module_name) {
		for (i in module_name) {
			if (i == 0) {
				module_name = module_name.replaceAt(0, module_name[i].toUpperCase());
				continue;
			}
			if (module_name[i] == '_') {
				module_name = module_name.replaceAt(parseInt(i) + 1, module_name.charAt(parseInt(i) + 1).toUpperCase());
				continue;
			}
		}
		return module_name.split('_').join('');
	}

}

window.JamiiCore = new JamiiCore();

window.onload = function() {
	window.JamiiCore.init();
}
