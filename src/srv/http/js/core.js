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
	var current_user_data = undefined;
	
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

		core_modules[module_name] = {
			'ready_status': {'logic': false, 'gui': false},
			'onload_signal': new Signal(),
			'module_ready_signal': new Signal()
		};
		console.log(JSON.stringify(core_modules));


		var script_onload_template = function(name, type) {
			return function() {
				core_modules[name].onload_signal.emit([name, type]);
			}
		}

		var script_onerror = function() {
			console.log("[E] JamiiCore::load_module: Unable to load " + this.getAttribute("src"));
		}

		var onload_signal_handler = function(data) {
			name = data[0];
			type = data[1];
			console.log("[I] JamiiCore::load_module: Script loaded (" + name + ", " + type + ")");
			core_modules[name]['ready_status'][type] = true;
			var postfix = 'Logic';
			if (type == 'gui')
				postfix = 'Gui';
			var module_class_name = get_module_class_prefix(name) + postfix;
			if (window[module_class_name] != undefined)
				register_module_object(name, type, new window[module_class_name]());

			if (core_modules[name]['ready_status']['gui'] && core_modules[name]['ready_status']['logic'])
				core_modules[name]['module_ready_signal'].emit(name);
		}

		var module_ready_signal_handler = function(name) {

			window.JamiiCore.get_module_logic(name)['gui'] = window.JamiiCore.get_module_gui(name);
			window.JamiiCore.get_module_gui(name)['logic'] = window.JamiiCore.get_module_logic(name);

			console.log("[I] JamiiCore::load_module: Module ready to initialize (" + name + ")");
			if (window.JamiiCore.get_module_logic(name)['init'] != undefined) {
				try {
					window.JamiiCore.get_module_logic(name).init();
					console.log("[I] JamiiCore::load_module: Logic of module '" + name + "' initialized");
				} catch (err) {
					console.log("[E] Error in init() function inside module " + name + " (logic): " + err);
				}
			} else {
				console.log("[W] JamiCore::load_module: missing constructor for logic module (" + name + ")");
			}
			if (window.JamiiCore.get_module_gui(name)['init'] != undefined) {
				try {
					window.JamiiCore.get_module_gui(name).init();
					console.log("[I] JamiiCore::load_module: Gui of module '" + name + "' initialized");
				} catch (err) {
					console.log("[E] Error in init() function inside module " + name + " (gui): " + err);
				}
			} else {
				console.log("[W] JamiCore::load_module: missing constructor for gui module (" + name + ")");
			}
		}

		core_modules[module_name]['onload_signal'].connect(onload_signal_handler);
		core_modules[module_name]['module_ready_signal'].connect(module_ready_signal_handler);

		this.append_script(modules_dir + module_name + "_logic.js", script_onload_template(module_name, 'logic'));
		this.append_script(modules_dir + module_name + "_gui.js", script_onload_template(module_name, 'gui'));

	}

	this.get_current_user_data = function() {
		return current_user_data;
	}

	this.request_current_user_data = function() {
		current_user_data = undefined;
		window.connection.send("whoAmI", {});
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

		window.connection.registerHandler("whoAmI_answer", current_user_data_handler); 
		this.request_current_user_data();

		modules_to_load = ['conference', 'chat', 'file_share', 'account_settings', 'friend_list'];
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

	var current_user_data_handler = function(data) {
		console.log("[I] JamiiCore::current_user_data_handler: Got current user data!");
		current_user_data = data;
		window.JamiiCore.signal_user_data_available.emit();
	}

	this.append_script = function(script_src, onload, onerror) {
		var script = document.createElement("script");
		if (onload != undefined)
			script.onload = onload;
		if (onerror != undefined)
			script.onerror = onerror;
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", script_src);
		document.getElementsByTagName("head")[0].appendChild(script);
		return script;
	}

	this.signal_user_data_available = new Signal();

}

window.JamiiCore = new JamiiCore();

window.onload = function() {
	window.JamiiCore.init();
}
