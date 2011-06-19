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
  var element = document.createElement('div');
  element.id = 'favoReaderElement';
  element.style.display = 'none';
  document.body.appendChild(element);

  var messageScript = (function(m) { message(m); }).toString();
  var message = function(m) {
    location.href = 'javascript:(' + messageScript + ')(' + JSON.stringify(m) + ')';
  };

  var initialize = function(settings) {
    var shortcut = settings.options_settings_shortcutkey;

    var siteScript = function(shortcut) {
      var element = document.getElementById('favoReaderElement');
      var onload_ = window.onload;
      window.onload = function() {
        onload_();

        var customEvent = document.createEvent('Event');
        customEvent.initEvent('onFavoriteEvent', true, true);

        Keybind.add(shortcut, function() {
          var item = get_active_item(true);
          if(item) {
            var id = null;
            var screen_name = null;
            var link = item.link;
            if(link.match(/^http:\/\/twitter\.com\/(?:#!\/)?(\w+)\/statuses\/(\d+)\/?$/)) {
              screen_name = RegExp.$1;
              id = RegExp.$2;
            }
            else if(link.match(/^http:\/\/favotter\.net\/status\.php\?id=(\d+)$/)) {
              id = RegExp.$1;
            }
            if(id !== null) {
              element.innerText = Object.toJSON({
                'type':        'createFavorite',
                'screen_name': screen_name,
                'id':          id
              });
              element.dispatchEvent(customEvent);
            }
          }
          return false;
        });
      };
    };
    location.href = 'javascript:(' + siteScript.toString() + ')(' + JSON.stringify(shortcut) + ')';
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
  element.addEventListener('onFavoriteEvent', function() {
    var eventData = JSON.parse(element.innerText);
    port.postMessage(eventData);
  });

})();
