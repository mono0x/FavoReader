/*
 * Copyright (c) 2010-2011 mono
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function() {
  var message = function(m) {
    document.getElementById("entries-status").textContent = m;
  };

  var initialize = function(settings) {
    var shortcut = settings.options_settings_shortcutkey;

    setTimeout(function() {
      if(!!document['FavoReaderInstalled']) {
        return;
      }

      document.addEventListener('keydown', function(e) {
        var targetTag = e.target.tagName.toLowerCase();
        var keyCode = shortcut.toUpperCase().charCodeAt(0);
        var shiftKey = shortcut.charCodeAt(0) >= 65 && shortcut.charCodeAt(0) <= 90;
        if(targetTag == 'input' || targetTag == 'textarea') {
          return;
        }
        else if(e.keyCode == keyCode && e.shiftKey == shiftKey) {
          var exp = 'id("current-entry")//a[contains(concat(" ", @class, " "), " entry-title-link ")]';
          var link =  $X(exp)[0].href;
          var id = null;
          var screen_name = null;
          if(link.match(/^http:\/\/twitter\.com\/(?:#!\/)?(\w+)\/statuses\/(\d+)\/?$/)) {
            screen_name = RegExp.$1;
            id = RegExp.$2;
          }
          else if(link.match(/^http:\/\/favotter\.net\/status\.php\?id=(\d+)$/)) {
            id = RegExp.$1;
          }
          if(id !== null) {
            port.postMessage({
              'type':        'createFavorite',
              'screen_name': screen_name,
              'id':          id
            });
          }
        }
        else {
          return;
        }
        e.preventDefault();
      }, false);
      document['FavoReaderInstalled'] = true;
    }, 500);
  };

  var port = chrome.extension.connect({ "name": "FavoReader" });
  port.onMessage.addListener(function(m) {
    if(m.type == 'settings') {
      initialize(m.settings);
    }
    else if(m.type == 'message') {
      message(m.message);
    }
  });
  port.postMessage({ 'type': 'loadSettings' });

  // simple version of $X
  // $X(exp);
  // $X(exp, context);
  // @source http://gist.github.com/3242.txt
  // @author id:os0x
  function $X (exp, context) {
    context || (context = document);
    var expr = (context.ownerDocument || context).createExpression(exp, function (prefix) {
      return document.createNSResolver(context.documentElement || context).lookupNamespaceURI(prefix) ||
      context.namespaceURI || document.documentElement.namespaceURI || "";
    });

    var result = expr.evaluate(context, XPathResult.ANY_TYPE, null);
    switch (result.resultType) {
      case XPathResult.STRING_TYPE : return result.stringValue;
      case XPathResult.NUMBER_TYPE : return result.numberValue;
      case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        // not ensure the order.
        var ret = [], i = null;
        while (i = result.iterateNext()) ret.push(i);
        return ret;
    }
    return null;
  }

})();
