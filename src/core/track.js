/**
 * @license
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
 * @fileoverview SparqlBlocks user actions tracking.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly'),
    $ = require('jquery'),
    _ = require('underscore');

var eventTypeDescr_ = function(eventTypeId) {

};

var logEvent_ = function(workspace, event, options) {
  if (options.logToConsole) {
    console.log(event);
  }
  if (options.record) {
    if (!workspace.eventStack) {
      workspace.eventStack = [];
    }
    workspace.eventStack.push(event);
  }
  if (options.webSocket) {
    options.webSocket.emit(event.type, event);
  }
};

var track_ = function(workspace, options) {
  options =
      _.extend(
          { sendEventXML: true,
            sendWorkspaceXML: false,
            sendMoveAroundEvents: false,
            sendUIEvents: true,
            record: false,
            logToConsole: false,
            webSocket: false
          },
          options );

  workspace.addChangeListener(function(event) {
    if (!options.sendMoveAroundEvents && event.type == Blockly.Events.MOVE &&
        !event.newParentId && !event.oldParentId) {
      return;
    }
    if (!options.sendUIEvents && event.type == Blockly.Events.UI) {
      return;
    }
    logEvent_(workspace, _.extend(
        {},
        event,
        { type: event.type, timestamp: $.now() },
        options.sendEventXML && event.xml ?
          { xmlText: Blockly.Xml.domToText(event.xml) } :
          {},
        options.sendWorkspaceXML ?
          { workspace:
                Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace)) } :
          {},
        localStorage && localStorage.clientId ?
          { clientId: localStorage.clientId } :
          {},
        sessionStorage && sessionStorage.sessionId ?
          { sessionId: sessionStorage.sessionId } :
          {} ), options);
  });
};

module.exports = {
  track: track_
};
