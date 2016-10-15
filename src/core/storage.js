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
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly'),
    $ = require('jquery'),
    _ = require('underscore'),
    TestBlocks = require('../blocks/test.js'),
    packageJson = require('../../package.json'),
    Clipboard = require('clipboard'),
    MessageDisplay = require('./messageDisplay.js');

var HTTPREQUEST_ERROR = 'There was a problem with the request.\n';
var LINK_ALERT = 'Share your blocks with this link:\n\n%1';
var LINK_ALERT_GITHUB = 'Share your blocks with this link:\n\n%1' +
    '\n\nSee also XML on GitHub at this link:\n\n%2';
var HASH_ERROR = 'Sorry, "%1" doesn\'t correspond with any saved Blockly file.';
var XML_ERROR = 'Could not load your saved file.\n'+
    'Perhaps it was created with a different version of Blockly?';

/**
  * Backup code blocks to localStorage.
  * @param {!Blockly.WorkspaceSvg} workspace Workspace.
  * @private
  */
var backupBlocks_ = function(workspace) {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
  }
};

/**
 * Bind the localStorage backup function to the unload event.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var backupOnUnload = function(opt_workspace) {
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  window.addEventListener('unload',
      function() {backupBlocks_(workspace);}, false);
};

/**
 * Restore code blocks from localStorage.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var restoreBlocks = function(opt_workspace) {
  var url = window.location.href.split('#')[0];
  if ('localStorage' in window && window.localStorage[url]) {
    var workspace = opt_workspace || Blockly.getMainWorkspace();
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }
};

/**
 * Save blocks to database and return a link containing key to XML.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var linkGist = function(opt_workspace, callback) {
  MessageDisplay.alert("Saving Workspace as Gist on GitHub...");
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var data = Blockly.Xml.domToPrettyText(xml);
  var testState = TestBlocks && TestBlocks.getState();
  var metaData = _.extend(
    {
      generator: "SparqlBlocks",
      version: packageJson.version,
      baseURI: location.href,
      timestamp: $.now(),
      workspaceXmlFile: "workspace.xml"
    },
    workspace.eventStack ? {
      eventHistoryFile: "eventHistory.json"
    } : {},
    testState ? {
      testStateFile: "testState.json"
    } : {},
    workspace.trackingGuide ? {
      guideActive: true,
      guideStep: workspace.trackingGuide.getStateId()
    } : {
      guideActive: false
    });
  makeRequest_({
    dataType: "json",
    method: "POST",
    data: JSON.stringify({
      "files": _.extend({
        "metaData.json": {
          content: JSON.stringify(metaData)
        },
        "workspace.xml": {
          "content": data
        }
      },
      workspace.eventStack ? {
        "eventHistory.json": { "content": JSON.stringify(workspace.eventStack) }
      } : {},
      testState ? {
        "testState.json": { "content": JSON.stringify(testState) }
      } : {})
    }),
    url: "https://api.github.com/gists",
    success: function(data) {
      window.location.hash = "gist:" + data.id;
      if (Blockly.Events.isEnabled()) {
        var saveEvent = new Blockly.Events.Abstract(null);
        saveEvent.type = "save-snapshot";
        saveEvent.workspaceId = workspace.id;
        saveEvent.value = "gist:" + data.id;
        Blockly.Events.fire(saveEvent);
      }
      monitorChanges_(workspace);
      MessageDisplay.alert(
          'Workspace Saved. ' +
          '<button class="main-button btn" title="Copy Link to Clipboard" id="temp-copy-button" type="button">'+
            '<span class="octicon octicon-clippy"></span>'+
            ' Copy Link to Share It'+
          '</button>',"info"
        );
      setCopyOnThisButton('#temp-copy-button');
      if (callback)
        callback(null, data.id);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var errorDescr = jqXHR.responseText;
      if (!errorDescr) {
        errorDescr = "Connection Error!";
      }
      MessageDisplay.alert("Error Saving Workspace: " + errorDescr, 'error');
      if (callback)
        callback(errorThrown);
    }
  });
};

var setCopyOnThisButton = function(selector) {
  var cb = new Clipboard(selector, {
        text: function(trigger) {
          return window.location.href;
        }});
  cb.on('success', function(event) {
    MessageDisplay.alert('Link Copied to Clipboard. Share it!!!', 'info', event);
  });
  cb.on('error', function(e) {
    MessageDisplay.alert('Could Not Copy! Please Copy it Manually from Address Bar','error');
  });
};

/**
 * Save blocks to database and show the link.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var linkGistAndAlert = function(opt_workspace) {
  linkGist(opt_workspace, function(err, dataId) {
    if (err) {
      MessageDisplay.alert(
        LINK_ALERT_GITHUB
        .replace('%1', window.location.href)
        .replace('%2', 'https://gist.github.com/' + dataId));
    }
  });
};

var retrieveGisRawUrl_ = function(id, callback, workspace) {
  $.ajax({
    dataType: "json",
    method: "GET",
    url: "https://api.github.com/gists/" + id,
    success: function(data) {
      callback(data.files["workspace.xml"].raw_url);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var errorDescr = jqXHR.responseText;
      if (!errorDescr) {
        errorDescr = "Connection Error!";
      }
      MessageDisplay.alert("Error Loading Workspace: " + errorDescr, 'error');
      window.location.hash = "";
      monitorChanges_(workspace);
    }
  });
};

var urlFromKey_ = function(key, callback, workspace) {
  var keyParts = key.split(":");
  switch (keyParts[0]) {
    case "gist":
      retrieveGisRawUrl_(keyParts[1], callback, workspace);
      break;
    case "xml":
      callback('data:,' + keyParts[1]);
      break;
    default:
  }
};

/**
 * Retrieve XML text from database using given key.
 * @param {string} key Key to XML, obtained from href.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var retrieveXml = function(key, opt_workspace, callback) {
  MessageDisplay.alert("Loading Saved Workspace...");
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  urlFromKey_(key, function(url) {
    makeRequest_({
      headers: {Accept: "text/xml"},
      dataType: "text",
      method: "GET",
      url: url,
      success: function(data) {
        if (!data.length) {
          MessageDisplay.alert(HASH_ERROR.replace('%1', window.location.hash), 'error');
          if (_.isFunction(callback))
            callback('Unknown error');
        } else {
          if (Blockly.Events.isEnabled()) {
            Blockly.Events.setGroup(true);
            var loadEvent = new Blockly.Events.Abstract(null);
            loadEvent.type = "load-snapshot";
            loadEvent.workspaceId = workspace.id;
            loadEvent.value = key;
            Blockly.Events.fire(loadEvent);
          }
          loadXml_(data, workspace);
          MessageDisplay.alert("Workspace Loaded", "info");
          if (Blockly.Events.isEnabled()) {
            Blockly.Events.setGroup(false);
          }
          monitorChanges_(workspace);
          if (_.isFunction(callback))
            callback();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var errorDescr = jqXHR.responseText;
        if (!errorDescr) {
          errorDescr = "Connection Error!";
        }
        MessageDisplay.alert("Error Loading Workspace: " + errorDescr, 'error');
        window.location.hash = "";
        monitorChanges_(workspace);
        if (_.isFunction(callback))
          callback();
      }
    });
  },
  workspace);
};

/**
 * Reference to current AJAX request.
 * @type {XMLHttpRequest}
 * @private
 */
var httpRequest_ = null;

/**
 * Function for AJAX call.
 * @private
 */
var makeRequest_ = function(ajaxOptions) {
  if (httpRequest_) {
    // AJAX call is in-flight.
    httpRequest_.abort();
    httpRequest_ = null;
  }
  var protocolAndRest = ajaxOptions.url.split(":");
  if (protocolAndRest[0] === 'data') {
    var formatAndRest = protocolAndRest[1].split(",");
    ajaxOptions.success(decodeURIComponent(formatAndRest[1]));
  } else {
    httpRequest_ = $.ajax(ajaxOptions);
  }
};

/**
 * Start monitoring the workspace.  If a change is made that changes the XML,
 * clear the key from the URL.  Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
var monitorChanges_ = function(workspace) {
  if (window.location.hash !== "") {
    $('#copy-button').prop('disabled', false);
  }
  $('#save-button').prop('disabled', true);
  setTimeout( function() {
    var startXmlDom = Blockly.Xml.workspaceToDom(workspace);
    var startXmlText = Blockly.Xml.domToText(startXmlDom);
    var bindData = workspace.addChangeListener( function (event) {
      var xmlDom = Blockly.Xml.workspaceToDom(workspace);
      var xmlText = Blockly.Xml.domToText(xmlDom);
      if (startXmlText != xmlText) {
        window.location.hash = '';
        $('#copy-button').prop('disabled', true);
        $('#save-button').prop('disabled', false);
        setTimeout( function() { workspace.removeChangeListener(bindData); });
      }
    });
  } );
};

/**
 * Load blocks from XML.
 * @param {string} xml Text representation of XML.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
var loadXml_ = function(xml, workspace) {
  try {
    xml = Blockly.Xml.textToDom(xml);
  } catch (e) {
    MessageDisplay.alert(XML_ERROR + '\nXML: ' + xml);
    return;
  }
  // Clear the workspace to avoid merge.
  workspace.clear();
  Blockly.Xml.domToWorkspace(xml, workspace);
};

/**
 * Do intial stuff.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
var startup = function(opt_workspace, callback) {
  var workspace = opt_workspace || Blockly.getMainWorkspace();
  // An href with #key trigers an AJAX call to retrieve saved blocks.
  if (window.location.hash.length > 1) {
    retrieveXml(window.location.hash.substring(1), workspace, callback);
  } else {
    monitorChanges_(workspace);
    if (Blockly.Events.isEnabled()) {
      var newEvent = new Blockly.Events.Abstract(null);
      newEvent.type = "new-workspace";
      newEvent.workspaceId = workspace.id;
      Blockly.Events.fire(newEvent);
    }
    if (_.isFunction(callback))
      callback();
  }
};

module.exports = {
  backupOnUnload: backupOnUnload,
  restoreBlocks: restoreBlocks,
  linkGist: linkGist,
  linkGistAndAlert: linkGistAndAlert,
  retrieveXml: retrieveXml,
  startup: startup,
  setCopyOnThisButton: setCopyOnThisButton
};
