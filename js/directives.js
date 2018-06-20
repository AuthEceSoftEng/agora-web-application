/**
 * Directive used to view the name and path of a result file.
 */
angular.module('AgoraModule').directive('myView', function($compile) {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		link : function(scope, elm, attrs) {
			elm.append($compile('<a class="btn" href=\"/file#!?file=' + attrs.datapath + '\"' + 'target=\"_blank\">' + attrs.dataname + '</a>')(scope));
		}
	};
});

/**
 * Directive used to view the name and path of a result project.
 */
angular.module('AgoraModule').directive('myProjectView', function($compile) {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		link : function(scope, elm, attrs) {
			elm.append($compile('<a class="btn" href=\"/project#!?project=' + attrs.datapath + '\"' + 'target=\"_blank\">' + attrs.dataname + '</a>')(scope));
		}
	};
});

/**
 * Directive used to download a result file.
 */
angular.module('AgoraModule').directive('myDownload', function($compile) {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		link : function(scope, elm, attrs) {
			elm.on('click', function(event) {
				// if (event.currentTarget.innerHTML.indexOf("Download file") > -1)
				scope.$apply(function() {
					return getUrl();
				});
			});

			function isIE() {
				var myNav = navigator.userAgent.toLowerCase();
				return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
			}

			function getUrl() {
				if (isIE() && isIE() <= 9)
					// saveTextAs(attrs.datacontent, attrs.dataname + '.txt');
					alert("Browser does not support download.. Use a newer browser or copy and paste the code to your editor..");
				else
					saveAs(new Blob([ attrs.datacontent ], {
						type : "text/java"
					}), attrs.dataname);
				return false;
				// return URL.createObjectURL(new Blob([attrs.datacontent], {type: "text/java"}));
			}

			elm.append($compile('<a class="btn" download="' + attrs.dataname + '">' + 'Download file' + '</a>'
			// 'href="' + getUrl() + '">' + 'Download file' + '</a>'
			)(scope));
		}
	};
});
