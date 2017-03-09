/**
 * Replaces all instances of str1 in the prototype string with str2.
 * 
 * @param {string} str1 - the string of which the instances are replaced.
 * @param {string} str2 - the string with which the instances are replaced.
 * @return {string} the string with its instances replaced.
 */
String.prototype.replaceAll = function(str1, str2) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), "g"), str2.replace(/\$/g, "$$$$"));
};

/**
 * Checks if the prototype string contains another string.
 * 
 * @param {string} it - the string to check if it exists.
 * @return {boolean} true if the given string is contained in the prototype string, or false otherwise.
 */
String.prototype.contains = function(it) {
	return this.indexOf(it) != -1;
};

/**
 * Capitalizes the prototype string.
 * 
 * @return {string} the prototype string with its letters in upper case.
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Checks if the prototype string contains another string as a distinct word.
 * 
 * @param {string} str - the word to check if it exists.
 * @return {boolean} true if the given word is contained in the prototype string, or false otherwise.
 */
String.prototype.containsWord = function(str) {
	return new RegExp('\\b' + str + '\\b', 'i').test(this);
};

/**
 * Retrieves the first order properties of an object.
 * 
 * @param {Object} obj - the object of which the first order keys are returned.
 * @return {Array} a list of the first order keys of the given object.
 */
Object.keys = function(obj) {
	var keys = [], name = null;
	for (name in obj) {
		if (obj.hasOwnProperty(name)) {
			keys.push(name);
		}
	}
	return keys;
}

/**
 * Checks recursively if a key exists in any level of the given tree.
 * 
 * @param {Object} tree - the tree to check if it contains the given key.
 * @param {Object} keyvalue - the key to be checked.
 * @return {boolean} true if the given key is contained in the tree, or false otherwise.
 */
function keyExistsInTree(tree, keyvalue) {
	if (typeof tree == 'string' || tree instanceof String) {
		return false;
	}
	for ( var akey in tree) {
		if (akey == keyvalue)
			return true;
		else if (keyExistsInTree(tree[akey], keyvalue))
			return true;
	}
	return false;
}
