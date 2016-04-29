/**
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Showing messages for SparqlBlocks
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var $ = require('jquery');

/**
 * Present a text message to the user.
 * @param {string} message Text to alert.
 * @param {string} messageType type of the message (alert, warn, error).
 */
var alert = function(message, messageType, eventToExclude) {
  // var timeToStay = (!messageType || messageType == "alert") ? 2000 : 0;
  var closable = (messageType != "alert");
  var timeToStay = 0; //(messageType == "info") ? 4000 : 0;
  var messageClass = "flash-" + ((messageType == "info") ? "alert" : messageType);
  var oldFlashMessage = $('.flash-messages .flash')[0];
  if (oldFlashMessage) {
    oldFlashMessage.parentElement.removeChild(oldFlashMessage);
  }
  $('.flash-messages').prepend(
    '<div class="flash '+ messageClass +'">'+
      // '<span class="octicon octicon-x flash-close js-flash-close" '+
      //     'onclick="this.parentElement.parentElement.removeChild(this.parentElement)"></span>'+
      message+
    '</div>');
  var flashMessage = $('.flash-messages .flash')[0];
  if (timeToStay > 0) {
    window.setTimeout( function() {
      if (flashMessage && flashMessage.parentElement) {
        flashMessage.parentElement.removeChild(flashMessage);
      }
    }, timeToStay );
  }
  if (messageType != "alert") {
    var clickListener = function(event) {
      if (flashMessage && flashMessage.parentElement) {
        flashMessage.parentElement.removeChild(flashMessage);
      }
      window.removeEventListener('click', clickListener);
    };
    window.setTimeout( function() {
      window.addEventListener('click', clickListener);
    }, 0 );
  }
  return flashMessage;
};

/**
 * clear message area.
 */
var clearAlert = function() {
  var oldFlashMessages = $('.flash-messages .flash');
  for (var i = 0; i < oldFlashMessages.length; i++) {
    var flashMessage = oldFlashMessages[i];
    flashMessage.parentElement.removeChild(flashMessage);
  }
};



module.exports = {
  alert: alert,
  clearAlert: clearAlert
};
