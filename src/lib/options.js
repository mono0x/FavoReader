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
  document.addEventListener('DOMContentLoaded', function() {
    var setMessage = function(id, name) {
      document.getElementById(id).innerText = chrome.i18n.getMessage(name || id);
    };
    setMessage('options_title');
    setMessage('options_settings_title');
    setMessage('options_settings_shortcutkey_title');
    setMessage('options_license_title');

    var background = chrome.extension.getBackgroundPage();
    var settings = background.localStorage;

    var shortcut = new ShortcutInput(
      "options_settings_shortcutkey",
      settings.options_settings_shortcutkey || 'F',
      function(v) {
        if(v) {
          settings.options_settings_shortcutkey = v;
        }
      }
    );

  }, false);
})();