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
 * @fileoverview Safe execution of workspace actions (creating/connecting blocks/fields)
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

var actionQueue = [];

var execute_ = function(action, thisArg) {
  actionQueue.push( { action: action, thisArg: thisArg } );
  if (actionQueue.length === 1) {
    var functId = window.setInterval(function() {
      if (!Blockly.dragMode_) {
        while (actionQueue.length > 0) {
          var actionItem = actionQueue.shift();
          actionItem.action.call(actionItem.thisArg);
        }
        window.clearInterval(functId);
      }
    }, 0);
  }
};

module.exports = {
  execute: execute_
};
