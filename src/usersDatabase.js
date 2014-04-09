var fs = require("fs");
var sys = require("sys");
var path = require("path");


/** Create instance of class User from JSON string
 * **Warning** no JSON validation!
 *
 * @param json JSON string to parse
 * @return User instajce
 */
var new_user_from_json = function(json) {
	var obj = JSON.parse(json);
	var user = new User();
	for (x in obj) {
		user['_' + x] = obj[x];
	}
	return user;
}


/*** Database block ***/

/** Class for manipulating users database
 *
 * Used directories:
 *	 -> var/users/
 * Used files:
 *	 -> var/users/$ID
 *	 -> var/users/logins
 */
function UsersDatabase() {
	var db_path = path.join(process.cwd(), "/var/users");
	var lastid_file = path.join(db_path, '.lastid');
	var last_user_id = undefined;
	
	var init = function() {
		if (!fs.existsSync(lastid_file)) {
			fs.writeFileSync(lastid_file, '0', 'utf8', function(err) {
				if (err)
					throw err;
			});
		}
	}

	init();

	var validate_user = function(user) {
		// TODO: perform full validation
		if (isNaN(user.id))
			throw "Bad user id";
	}

	/** Get next available user id
	 * This function does *not* modify .lastid file
	 * @see update_next_user_id();
	 * 
	 * @return next available user id
	 */
	this.get_next_user_id = function() {
		var last_id = fs.readFileSync(lastid_file, 'utf8');
		last_id = parseInt(last_id);
		if (isNaN(last_id))
			throw "Unable to get last user id...";
		console.log("get_next_user_id = " + (last_id + 1).toString());
		return (last_id + 1);
	}

	/** Update next available user id
	 * Increase and write next available user id into .lastid file
	 *
	 * @return true
	 * @throw string after read or write error
	 */
	this.update_next_user_id = function() {
		var last_id = undefined;
		try {
			last_id = this.get_next_user_id();
			console.log("Writing new lastid: " + last_id.toString());
			fs.writeFileSync(lastid_file, last_id.toString(), 'utf8', function(err) {
				if (err)
					throw err;
			});
			return true;
		} catch (e) {
			throw "Unable to update next user id: " + e;
		}
	}

	/** Save user data to database
	 * 
	 * @param user  filled instance of User class
	 * @return true
	 * @throw string after write error
	 */
	this.save_user_data = function(user) {
		if (!user instanceof User)
			throw "UsersDatabase::save_user_data: user must be an instance of User class";
		validate_user(user);
		fs.writeFileSync(path.join(db_path, user.id.toString()), user.export_to_json(), 'utf8', function(err) {
			if (err)
				throw err;
		});
		return true;
	}
	
	/** Read user data from file and return User object
	 *
	 * @param user_id existed ser id
	 * @return filled instance of User class
	 * @throw string after read error
	 */
	this.read_user_data = function(user_id) {
		var json = fs.readFileSync(path.join(db_path, user_id.toString()), 'utf8');
		if (!json)
			throw "Unable to read user data...";
		if (Buffer.isBuffer(json))
			json = json.toString('utf8');
		var user = new_user_from_json(json);
		user["id"] = user_id;
		return user;
	}
	
	/** Register new user in database
	 * Note: no validation at this point
	 *
	 * @param user: instance of filled User class, must be a valid user
	 * @return new user id
	 * @throw string after read or write error
	 */
	this.register_new_user =  function(user) {
		if (!user instanceof User)
			throw "UsersDatabase::register_new_user: user parameter must be an instance of User class";
		try {
			user.id = udb.get_next_user_id();
			this.save_user_data(user);
			this.update_next_user_id();
			return user.id;
		} catch (e) {
			throw "UserDatabase::register_new_user: unable to write new user data (" + e + ")";
		}
	}

	/**
	   Return an array of objects representing users whose value of 'key' is 'value'

	   @param key name of a user object field to be checked
	   @param value value to which the value of user.key must be equal fro user to be selected

	   @return dictionary of matching user objects, form: {id:object} 
	 */
	this.findUsers = function(key, value) {
		var file_list = fs.readdirSync(db_path);
		var matching = {};
		var user;

		file_list.forEach(function(id) {
			if(isNaN(id))
				return;
			user = this.read_user_data(id);
			if(user["_"+key].toLowerCase() == value.toLowerCase()) { // found matching user
				matching[id] = user;
			}
		}, this);
		
		return matching;
	}

	this.findUsersMultiKey = function(dict) {
		var file_list = fs.readdirSync(db_path);
		var matching = {};
		var user;
		var file;
		for (i in file_list) {
			file = file_list[i];
			if (isNaN(file))
				continue;
			user = udb.read_user_data(file); // file will be user id
			var user_ok = true;
			var all_blank = true;
			for (key in dict) {
				if (!(dict[key]))
					continue;
				all_blank = false;
				if (user['_' + key].toLowerCase() != dict[key].toLowerCase()) {
					user_ok = false;
				}
			}
			if (user_ok && !all_blank) {
				matching[user.id] = user;
			}
		}
		return matching;
	}

}


module.exports.UsersDatabase = UsersDatabase;



/*** Users block ***/
function User() {
	this.id = null;
	this._login = null;
	this._first_name = null;
	this._last_name = null;
	this._password = null;
	this._email = null;
	this._friends_list = [];
	this._requests_list = [];
	this._avatar = null;
	this._registration_date = null;
	this.availability = null;

	/** Export User data to JSON string
	 * This function will export only params which
	 * start with '_';
	 *
	 * Object could be restored by using new_user_from_json()
	 *
	 * @return JSON string representing current object
	 */
	this.export_to_json = function() {
		var json = {};
		for (x in this)  {
			if (x.startsWith('_')) {
				json[x.substring(1)] = this[x];
			}
		}
		return JSON.stringify(json);
	}

	/** Export copy of stripped current User data
	 * New object has all fields except of:
	 * 	* password, requests_list, registration_date
	 *
	 * All fields ale present without the '_' prefix.
	 *
	 * @return stripped User data
	 */
	this.strip_object = function() {
		var tmp = new Object();
		tmp['id'] = this.id;

		for (x in this) {
			if (x.startsWith('_')) {
				if (!(x in ['_password', '_registration_date', '_requests_list'])) {
					tmp[x.substring(1)] = this[x];
				}
			}
		}
		return tmp;
	}
}

module.exports.User = User;

