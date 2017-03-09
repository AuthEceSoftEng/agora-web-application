/**
 * The Advanced Search controller oF AGORA.
 */
angular.module('AgoraModule').controller('AgoraCtrlAdvanced', [ 'fileService', '$scope', '$location', function(files, $scope, $location) {
	document.getElementById("cinputfirst").focus();

	$scope.searchQuery = null;

	// Initialize the scope defaults.
	$scope.took = -1;
	$scope.total = -1;
	$scope.hideResults = true;
	$scope.hideNoResults = true;
	$scope.hideMoreResults = true;
	$scope.files = []; // An array of the results to display.
	$scope.page = 0; // A counter to keep track of the current page.
	$scope.allResults = false; // Boolean denoting whether all results have been found.

	try {
		$scope.tclass = JSON.parse($location.search().q) || {};
	} catch (e) {
		$scope.tclass = {};
	}
	if (!$scope.tclass.access)
		$scope.tclass.access = "default";
	// if(!$scope.tclass.interface) $scope.tclass.interface = false;
	if (!$scope.tclass.methods) {
		$scope.tclass.methods = [ {
			'id' : 'method1'
		} ];
		$scope.tclass.methods[0].access = "none";
		$scope.tclass.methods[0].parameters = [ {
			'id' : 'parameter1'
		} ];
	}
	if (!$scope.tclass.variables) {
		$scope.tclass.variables = [ {
			'id' : 'variable1'
		} ];
		$scope.tclass.variables[0].access = "none";
	}
	// $scope.tclass = {}; $scope.tclass.access = "default";
	// $scope.tclass.methods = [{}]; $scope.tclass.methods[0].access = "none";
	// $scope.tclass.methods[0].parameters = [{}];

	/**
	 * Adds a new method fieldset to the query.
	 */
	$scope.addNewMethod = function() {
		var newItemNo = $scope.tclass.methods.length + 1;
		$scope.tclass.methods.push({
			'id' : 'method' + newItemNo
		});
		$scope.tclass.methods[$scope.tclass.methods.length - 1].parameters = [ {
			'id' : 'parameter1'
		} ];
		$scope.tclass.methods[$scope.tclass.methods.length - 1].access = "none";
	};

	/**
	 * Determines whether the add method button should be shown in the search fieldsets. The button should be shown only
	 * after the last method fieldset.
	 * 
	 * @param {Object} method - the method to check if it should include an add method button.
	 * @return {boolean} true if the method should include an add method button, or false otherwise.
	 */
	$scope.showAddMethod = function(method) {
		return method.id === $scope.tclass.methods[$scope.tclass.methods.length - 1].id;
	};

	/**
	 * Removes a method fieldset from the query.
	 */
	$scope.removeMethod = function() {
		$scope.tclass.methods.pop();
	};

	/**
	 * Determines whether the remove method button should be shown in the search fieldsets. The button should be shown
	 * only after the last method fieldset and only if there are more than one method fieldsets.
	 * 
	 * @param {Object} method - the method to check if it should include a remove method button.
	 * @return {boolean} true if the method should include a remove method button, or false otherwise.
	 */
	$scope.showRemoveMethod = function(method) {
		return method.id === $scope.tclass.methods[$scope.tclass.methods.length - 1].id && $scope.tclass.methods.length > 1;
	};

	/**
	 * Adds a new parameter fieldset in a method fieldset of the query.
	 * 
	 * @param {Object} method - the method to which the parameter fieldset will be added.
	 */
	$scope.addNewParameter = function(method) {
		var newItemNo = method.parameters.length + 1;
		method.parameters.push({
			'id' : 'parameter' + newItemNo
		});
	};

	/**
	 * Determines whether the add parameter button should be shown in the method search fieldsets. The button should be
	 * shown only after the last parameter fieldset.
	 * 
	 * @param {Object} method - the method where the parameters reside.
	 * @param {Object} parameter - the parameter to check if it should include an add parameter button.
	 * @return {boolean} true if the parameter should include an add parameter button, or false otherwise.
	 */
	$scope.showAddParameter = function(method, parameter) {
		return parameter.id === method.parameters[method.parameters.length - 1].id;
	};

	/**
	 * Removes a parameter fieldset from a method fieldset of the query.
	 * 
	 * @param {Object} method - the method from which the parameter fieldset will be removed.
	 */
	$scope.removeParameter = function(method) {
		method.parameters.pop();
	};

	/**
	 * Determines whether the remove parameter button should be shown in the method search fieldsets. The button should
	 * be shown only after the last parameter fieldset and only if there are more than one parameter fieldsets.
	 * 
	 * @param {Object} method - the method where the parameters reside.
	 * @param {Object} parameter - the parameter to check if it should include a remove parameter button.
	 * @return {boolean} true if the parameter should include a remove parameter button, or false otherwise.
	 */
	$scope.showRemoveParameter = function(method, parameter) {
		return parameter.id === method.parameters[method.parameters.length - 1].id && method.parameters.length > 1;
	};

	// $scope.tclass.variables = [{}]; $scope.tclass.variables[0].access = "none";

	/**
	 * Adds a new variable fieldset to the query.
	 */
	$scope.addNewVariable = function() {
		var newItemNo = $scope.tclass.variables.length + 1;
		$scope.tclass.variables.push({
			'id' : 'variable' + newItemNo
		});
		$scope.tclass.variables[$scope.tclass.variables.length - 1].access = "none";
	};

	/**
	 * Determines whether the add variable button should be shown in the search fieldsets. The button should be shown
	 * only after the last variable fieldset.
	 * 
	 * @param {Object} variable - the variable to check if it should include an add variable button.
	 * @return {boolean} true if the variable should include an add variable button, or false otherwise.
	 */
	$scope.showAddVariable = function(variable) {
		return variable.id === $scope.tclass.variables[$scope.tclass.variables.length - 1].id;
	};

	/**
	 * Removes a variable fieldset from the query.
	 */
	$scope.removeVariable = function() {
		$scope.tclass.variables.pop();
	};

	/**
	 * Determines whether the remove variable button should be shown in the search fieldsets. The button should be shown
	 * only after the last variable fieldset and only if there are more than one variable fieldsets.
	 * 
	 * @param {Object} variable - the variable to check if it should include a remove variable button.
	 * @return {boolean} true if the variable should include a remove variable button, or false otherwise.
	 */
	$scope.showRemoveVariable = function(variable) {
		return variable.id === $scope.tclass.variables[$scope.tclass.variables.length - 1].id && $scope.tclass.variables.length > 1;
	};

	/**
	 * Constructs the query according to the populated fieldsets.
	 */
	$scope.createquery = function() {
		$scope.searchQuery = {};
		$scope.searchQuery.bool = {};
		$scope.searchQuery.bool.should = [];
		shouldquery = $scope.searchQuery.bool.should;
		if ($scope.tclass.name)
			shouldquery.push({
				"match" : {
					"code.class.name" : $scope.tclass.name
				}
			});
		if ($scope.tclass.interface)
			shouldquery.push({
				"match" : {
					"code.class.type" : "interface"
				}
			});
		if ($scope.tclass.extends)
			shouldquery.push({
				"match" : {
					"code.class.extends" : $scope.tclass.extends
				}
			});
		if ($scope.tclass.implements)
			shouldquery.push({
				"match" : {
					"code.class.implements" : $scope.tclass.implements
				}
			});
		if ($scope.tclass.imports)
			shouldquery.push({
				"match" : {
					"code.imports" : $scope.tclass.imports
				}
			});
		if ($scope.tclass.package)
			shouldquery.push({
				"match" : {
					"code.package" : $scope.tclass.package
				}
			});
		if ($scope.tclass.access !== "default")
			shouldquery.push({
				"match" : {
					"code.class.modifiers" : $scope.tclass.access
				}
			});
		if ($scope.tclass.final)
			shouldquery.push({
				"match" : {
					"code.class.modifiers" : "final"
				}
			});
		if ($scope.tclass.abstract)
			shouldquery.push({
				"match" : {
					"code.class.modifiers" : "abstract"
				}
			});

		for (var i = 0; i < $scope.tclass.variables.length; i++) {
			var avariable = $scope.tclass.variables[i];
			shouldquery.push({
				"nested" : {
					"path" : "code.class.variables"
				}
			});
			shouldquery[shouldquery.length - 1].nested.query = {};
			shouldquery[shouldquery.length - 1].nested.query.bool = {};
			shouldquery[shouldquery.length - 1].nested.query.bool.should = [];
			varshouldquery = shouldquery[shouldquery.length - 1].nested.query.bool.should;
			if (avariable.name)
				varshouldquery.push({
					"match" : {
						"code.class.variables.name" : avariable.name
					}
				});
			if (avariable.type)
				varshouldquery.push({
					"match" : {
						"code.class.variables.type" : avariable.type
					}
				});
			if (avariable.access !== "none")
				varshouldquery.push({
					"match" : {
						"code.class.variables.modifiers" : avariable.access
					}
				});
			if (avariable.final)
				varshouldquery.push({
					"match" : {
						"code.class.variables.modifiers" : "final"
					}
				});
			if (avariable.abstract)
				varshouldquery.push({
					"match" : {
						"code.class.variables.modifiers" : "abstract"
					}
				});
			if (avariable.static)
				varshouldquery.push({
					"match" : {
						"code.class.variables.modifiers" : "static"
					}
				});
			if (varshouldquery.length == 0)
				shouldquery.pop();
		}

		for (var i = 0; i < $scope.tclass.methods.length; i++) {
			var amethod = $scope.tclass.methods[i];
			shouldquery.push({
				"nested" : {
					"path" : "code.class.methods"
				}
			});
			shouldquery[shouldquery.length - 1].nested.query = {};
			shouldquery[shouldquery.length - 1].nested.query.bool = {};
			shouldquery[shouldquery.length - 1].nested.query.bool.should = [];
			metshouldquery = shouldquery[shouldquery.length - 1].nested.query.bool.should;
			if (amethod.name)
				metshouldquery.push({
					"match" : {
						"code.class.methods.name" : amethod.name
					}
				});
			if (amethod.returntype)
				metshouldquery.push({
					"match" : {
						"code.class.methods.returntype" : amethod.returntype
					}
				});
			if (amethod.access !== "none")
				metshouldquery.push({
					"match" : {
						"code.class.methods.modifiers" : amethod.access
					}
				});
			if (amethod.final)
				metshouldquery.push({
					"match" : {
						"code.class.methods.modifiers" : "final"
					}
				});
			if (amethod.abstract)
				metshouldquery.push({
					"match" : {
						"code.class.methods.modifiers" : "abstract"
					}
				});
			if (amethod.static)
				metshouldquery.push({
					"match" : {
						"code.class.methods.modifiers" : "static"
					}
				});
			if (amethod.throws)
				metshouldquery.push({
					"match" : {
						"code.class.methods.throws" : amethod.throws
					}
				});
			for (var j = 0; j < amethod.parameters.length; j++) {
				var aparameter = amethod.parameters[j];
				metshouldquery.push({
					"nested" : {
						"path" : "code.class.methods.parameters"
					}
				});
				metshouldquery[metshouldquery.length - 1].nested.query = {};
				metshouldquery[metshouldquery.length - 1].nested.query.bool = {};
				metshouldquery[metshouldquery.length - 1].nested.query.bool.should = [];
				parshouldquery = metshouldquery[metshouldquery.length - 1].nested.query.bool.should;
				if (aparameter.name)
					parshouldquery.push({
						"match" : {
							"code.class.methods.parameters.name" : aparameter.name
						}
					});
				if (aparameter.type)
					parshouldquery.push({
						"match" : {
							"code.class.methods.parameters.type" : aparameter.type
						}
					});
				if (parshouldquery.length == 0)
					metshouldquery.pop();
			}
			if (metshouldquery.length == 0)
				shouldquery.pop();
		}
		if ($scope.searchQuery.bool.should.length == 0) {
			$scope.searchQuery = null;
			$scope.thekeys = null;
		} else {
			function recurseTree(tree, thekeys, thevalues) {
				if (typeof tree == 'string' || tree instanceof String) {
					return true;
				}

				var child = null; // find current tree's child
				for ( var key in tree) {
					if (key != '_id') {
						child = tree[key]; // found a child
						if (recurseTree(child, thekeys, thevalues)) {
							if (Object.keys(tree)[0] != "path"/*
																 * && Object.keys(tree)[0] !=
																 * "code.class.methods.returntype"
																 */) {// do
								// not
								// highlight
								// returntype
								thekeys.push(Object.keys(tree)[0]);
								thevalues.push(tree[Object.keys(tree)[0]]);
							}
						}
					}
				}
			}
			$scope.thekeys = [];
			$scope.thevalues = [];
			recurseTree($scope.searchQuery, $scope.thekeys, $scope.thevalues);
			$scope.keysvalues = {};
			for (var inti = 0; inti < $scope.thekeys.length; inti++) {
				if ($scope.thekeys[inti] in $scope.keysvalues)
					$scope.keysvalues[$scope.thekeys[inti]].push($scope.thevalues[inti]);
				else
					$scope.keysvalues[$scope.thekeys[inti]] = [ $scope.thevalues[inti] ];
			}
			var uniquekeys = $scope.thekeys.filter(function(elem, pos) {
				return $scope.thekeys.indexOf(elem) == pos;
			});
			$scope.thekeys = uniquekeys;
			var uniquevalues = $scope.thevalues.filter(function(elem, pos) {
				return $scope.thevalues.indexOf(elem) == pos;
			});
			$scope.thevalues = uniquevalues;
		}
	};

	/**
	 * Implements the advanced search. The scope variables are reset to their defaults, the q parameter is set, and the
	 * results are loaded.
	 */
	$scope.search = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		$scope.page = 0;
		$scope.files = [];
		$scope.allResults = false;
		if ($scope.tclass) {
			// console.log(JSON.stringify($scope.tclass));
			$location.search({
				'q' : JSON.stringify($scope.tclass)
			});
			$scope.loadMore();
		} else {
			$scope.allResults = true;
			$scope.allResults = true;
			$scope.hideResults = true;
			$scope.hideNoResults = true;
		}
	};

	/**
	 * Highlights the occurences of a term in a string, by wrapping them arround "eshi" html tags.
	 * 
	 * @param {string} thestring - the string to be highlighted.
	 * @param {string} theterm - the term of which the occurences are highlighted in the string.
	 * @return {string} the highlighted string.
	 */
	function highlightString(thestring, theterm) {
		return thestring.replaceAll(theterm, "<eshi>" + theterm + "</eshi>").replaceAll(theterm.toUpperCase(), "<eshi>" + theterm.toUpperCase() + "</eshi>").replaceAll(theterm.capitalize(), "<eshi>" + theterm.capitalize() + "</eshi>");
	}

	/**
	 * Loads the next page of results and increments the page counter. When the query is finished, the results are in
	 * $scope.files.
	 */
	$scope.loadMore = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;

		function strung(thekey, iters, arg) {

			function highlightTerms(thestring, theterm) {
				// console.log($scope.keysvalues);
				if (theterm in $scope.keysvalues) {
					for (var ttt = 0; ttt < $scope.keysvalues[theterm].length; ttt++) {
						thehl = $scope.keysvalues[theterm][ttt];
						thestring = highlightString(thestring, thehl);
					}
				}
				return thestring;
			}

			var ret = "";
			if (thekey == "extends") {
				if (arg && arg.length > 0) {
					ret += " " + thekey + " " + highlightTerms(arg, "code.class.extends");
				}
			}
			if (thekey == "implements") {
				if (arg && arg.length > 0) {
					ret += " " + thekey + " " + highlightTerms(arg[0], "code.class.implements");
				}
			}
			if (thekey == "class") {
				classname = highlightTerms(arg.name, "code.class.name");
				classmodifiers = (classname.contains("<eshi>") ? strung("code.class.modifiers", iters + "\t", arg.modifiers) : strung("modifiers", iters + "\t", arg.modifiers));
				classtype = (classname.contains("<eshi>") ? highlightTerms(arg.type, "code.class.type") : arg.type);
				ret += iters + classmodifiers + classtype + " " + classname + strung("extends", iters + "\t", arg.extends) + strung("implements", iters + "\t", arg.implements) + "{";

				Object.keys(arg).forEach(function(key) {
					if (key != "name" && key != "type" && key != "implements" && key != "extends" && key != "modifiers" && key != "innerclasses")
						ret += strung(key, iters + "\t", arg[key]) + '';
				});
				ret += "\n}";
			} else if (thekey == "modifiers") {
				arg.forEach(function(elem, index) {
					ret += elem + " ";
				});
			} else if (thekey == "code.class.modifiers" || thekey == "code.class.variables.modifiers" || thekey == "code.class.methods.modifiers") {
				arg.forEach(function(elem, index) {
					ret += highlightTerms(elem, thekey) + " ";
				});
			} else if (thekey == "imports") {
				arg.forEach(function(elem, index) {
					ret += "import " + highlightTerms(elem, "code.imports") + ";\n";
				});
				ret += "\n";
			} else if (thekey == "parameters") {
				arg.forEach(function(elem, index) {
					parametername = highlightTerms(elem.name, "code.class.methods.parameters.name");
					parametertype = (parametername.contains("<eshi>") ? highlightTerms(elem.type, "code.class.methods.parameters.type") : elem.type);
					ret += parametertype + " " + parametername + ', ';
				});
				if (ret && ret.length > 2)
					ret = ret.substring(0, ret.length - 2);
			} else if (thekey == "throws") {
				ret += " throws ";
				Object.keys(arg).forEach(function(key) {
					ret += highlightTerms(arg[key], "code.class.methods.throws") + ', ';
				});
				if (ret && ret.length > 8)
					ret = ret.substring(0, ret.length - 2);
			} else if (thekey == "methods") {
				arg.forEach(function(elem, index) {
					methodname = (elem.name != "<init>" ? " " + highlightTerms(elem.name, "code.class.methods.name") : "");
					methodmodifiers = (methodname.contains("<eshi>") ? strung("code.class.methods.modifiers", iters + "\t", elem.modifiers) : strung("modifiers", iters + "\t", elem.modifiers));
					methodtype = (methodname.contains("<eshi>") ? highlightTerms(elem.returntype, "code.class.methods.returntype") : elem.returntype);
					ret += '\n' + iters + strung("modifiers", iters + "\t", elem.modifiers) + methodtype + methodname + "(" + strung("parameters", iters + "\t", elem.parameters) + ")" + (elem.throws && elem.throws.length > 0 ? strung("throws", iters + "\t", elem.throws) : "") + ";";
				});
			} else if (thekey == "variables") {
				arg.forEach(function(elem, index) {
					variablename = highlightTerms(elem.name, "code.class.variables.name");
					variablemodifiers = (variablename.contains("<eshi>") ? strung("code.class.variables.modifiers", iters + "\t", elem.modifiers) : strung("modifiers", iters + "\t", elem.modifiers));
					variabletype = (variablename.contains("<eshi>") ? highlightTerms(elem.type, "code.class.variables.type") : elem.type);
					ret += '\n' + iters + variablemodifiers + variabletype /* + " " */+ variablename + ";";
				});
			} else {
				if (arg instanceof Object && thekey == "") {
					ret += iters + "package" + ' ' + highlightTerms(arg["package"], "code.package") + ';';
					ret += '\n' + iters + strung("imports", iters + "\t", arg["imports"]) + '';
					ret += iters + strung("class", iters, arg["class"]) + '';
				}
			}
			return ret;
		}
		if ($scope.tclass) {
			$scope.createquery();
			if ($scope.searchQuery) {
				files.search($scope.searchQuery, $scope.thekeys, $scope.page++).then(function(response) {
					var stats = response.stats;
					var results = response.results;
					if ($scope.page == 1) {
						if (stats.total > 0) {
							$scope.took = stats.took / 1000;
							if ($scope.took < 0.001)
								$scope.took = 0.001;
							$scope.total = stats.total;
							$scope.hideResults = false;
						} else {
							$scope.took = -1;
							$scope.total = -1;
							$scope.hideResults = true;
						}
					}

					if (results.length !== 10) {
						$scope.allResults = true;
					}

					var ii = 0;
					for (; ii < results.length; ii++) {
						results[ii].scode = strung("", "", results[ii].code);

						// Uncomment this to highlight all matches even in non-selected fields
						// for (var int = 0; int < $scope.thevalues.length; int++) {
						// var asearchterm = $scope.thevalues[int].toLowerCase();
						// results[ii].scode = highlightString(results[ii].scode, asearchterm);
						// }

						var scodelines = results[ii].scode.split('\n');
						var intlen = scodelines.length;
						while (intlen--) {
							if (!scodelines[intlen].contains("<eshi>"))
								scodelines.splice(intlen, 1);
						}
						results[ii].scode = scodelines.join('\n');

						$scope.files.push(results[ii]);
					}
					if ($scope.files.length == 0) {
						$scope.hideNoResults = false;
						$scope.hideMoreResults = true;
						$scope.hideResults = true;
					} else {
						$scope.hideNoResults = true;
						$scope.hideResults = false;
						if ($scope.allResults)
							$scope.hideMoreResults = true;
						else
							$scope.hideMoreResults = false;
					}
				});
			} else {
				$scope.searchQuery = null;
				$scope.allResults = true;
				$scope.hideNoResults = true;
			}
		}
	};
	$scope.loadMore();

} ]);