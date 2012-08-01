/*
 * Copyright (c) 2010-2012 mono
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

var initSettings = function() {
  if(!localStorage.options_settings_shortcutkey) {
    localStorage.options_settings_shortcutkey = 'F';
  }
};
initSettings();

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url':     'https://twitter.com/oauth/request_token',
  'authorize_url':   'https://twitter.com/oauth/authorize',
  'access_url':      'https://twitter.com/oauth/access_token',
  'consumer_key':    'dio4pJb0ZghXFS35z19LMg',
  'consumer_secret': '3IIri7Doir8D8zLhx8qK8LJZwHX328XZZ43dnPAgcd0'
});

chrome.extension.onConnect.addListener(function(port) {
  console.assert(port.name == "FavoReader");

  var message = function(m) {
    port.postMessage({
      'type':    'message',
      'message': chrome.i18n.getMessage(m)
    });
  };

  port.onMessage.addListener(function(m) {
    if(m.type == 'loadSettings') {
      port.postMessage({
        'type':     'settings',
        'settings': localStorage
      });
    }
    else if(m.type == 'createFavorite') {
      message('message_adding');
      oauth.authorize(function() {
        var uri = 'https://api.twitter.com/1/favorites/create/' + m.id + '.json';
        var onReceive = function(text, xhr) {
          var status = JSON.parse(text);
          console.log(status);
          if(xhr.status == 200) {
            message('message_success');
          }
          else if(xhr.status == 403) {
            message('message_already_added');
          }
          else {
            message('message_error');
          }
        };
        oauth.sendSignedRequest(uri, onReceive, {
          'method': 'POST'
        });
      });
    }
  });
});
