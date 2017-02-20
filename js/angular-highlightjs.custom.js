angular.module('hljs').controller('HljsCtrl', [
    'hljsCache', 'hljsService',
    function HljsCtrl (hljsCache,   hljsService) {
      var ctrl = this;

      var _elm = null,
          _lang = null,
          _code = null,
          _hlCb = null;

      ctrl.init = function (codeElm) {
        _elm = codeElm;
      };

      ctrl.setLanguage = function (lang) {
        _lang = lang;

        if (_code) {
          ctrl.highlight(_code);
        }
      };

      ctrl.highlightCallback = function (cb) {
        _hlCb = cb;
      };

      ctrl.highlight = function (code) {
        if (!_elm) {
          return;
        }

        var res, cacheKey;

        _code = code;

        if (_lang) {
          // language specified
          cacheKey = ctrl._cacheKey(_lang, _code);
          res = hljsCache.get(cacheKey);

          if (!res) {
            res = hljsService.highlight(_lang, hljsService.fixMarkup(_code), true);
            hljsCache.put(cacheKey, res);
          }
        }
        else {
          // language auto-detect
          cacheKey = ctrl._cacheKey(_code);
          res = hljsCache.get(cacheKey);

          if (!res) {
            res = hljsService.highlightAuto(hljsService.fixMarkup(_code));
            hljsCache.put(cacheKey, res);
          }
        }

        res.value = res.value.replaceAll("&lt;eshi string&gt;", "<span style=\"color: green\">");
        res.value = res.value.replaceAll("&lt;eshi number&gt;", "<span style=\"color: darkorange\">");
        res.value = res.value.replaceAll("&lt;eshi boolean&gt;", "<span style=\"color: red\">");
        res.value = res.value.replaceAll("&lt;eshi key&gt;", "<span style=\"color: blue\">");
        res.value = res.value.replaceAll("&lt;eshi null&gt;", "<span style=\"color: magenta\">");
        res.value = res.value.replaceAll("&lt;eshi&gt;", "<span style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/eshi&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-title\">eshi</span>&gt;", "<span class=\"hljs-title\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-title\">eshi</span>&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-keyword\">eshi</span>&gt;", "<span class=\"hljs-keyword\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-keyword\">eshi</span>&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-annotation\">eshi</span>&gt;", "<span class=\"hljs-annotation\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-annotation\">eshi</span>&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-comment\">eshi</span>&gt;", "<span class=\"hljs-comment\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-comment\">eshi</span>&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-javadoc\">eshi</span>&gt;", "<span class=\"hljs-javadoc\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-javadoc\">eshi</span>&gt;", "</span>");
        res.value = res.value.replaceAll("&lt;<span class=\"hljs-string\">eshi</span>&gt;", "<span class=\"hljs-string\" style=\"background-color: #FFFF00\">");
        res.value = res.value.replaceAll("&lt;/<span class=\"hljs-string\">eshi</span>&gt;", "</span>");

        _elm.html(res.value);
        // language as class on the <code> tag
        _elm.addClass(res.language);

        if (_hlCb !== null && angular.isFunction(_hlCb)) {
          _hlCb();
        }
      };

      ctrl.clear = function () {
        if (!_elm) {
          return;
        }
        _code = null;
        _elm.text('');
      };

      ctrl.release = function () {
        _elm = null;
      };

      ctrl._cacheKey = function () {
        var args = Array.prototype.slice.call(arguments),
            glue = "!angular-highlightjs!";
        return args.join(glue);
      };
    }]);
