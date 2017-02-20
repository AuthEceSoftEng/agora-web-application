String.prototype.replaceAll = function(str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(
			/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
			(ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(
			/\$/g, "$$$$") : str2);
};

String.prototype.contains = function(it) {
	return this.indexOf(it) != -1;
};

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.containsWord = function(str) {
	return new RegExp('\\b' + str + '\\b', 'i').test(this);
};

Object.keys = function(obj) {
	var keys = [], name = null;
	for (name in obj) {
		if (obj.hasOwnProperty(name)) {
			keys.push(name);
		}
	}
	return keys;
}

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
