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

goog.provide('SparqlBlocks.Storage');

SparqlBlocks.Storage = (function() {

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
      Blockly.Xml.domToWorkspace(workspace, xml);
    }
  };



  /**
   * Save blocks to database and return a link containing key to XML.
   * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
   */
  var linkGist = function(opt_workspace) {
    var workspace = opt_workspace || Blockly.getMainWorkspace();
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var data = Blockly.Xml.domToPrettyText(xml);
    makeRequest_({
      dataType: "json",
      method: "POST",
      data: JSON.stringify({
        "files": {
          "workspace.xml": {
            "content": data
          }
        }
      }),
      url: "https://api.github.com/gists",
      success: function(data) {
        window.location.hash = "gist:" + data.id;
        alert(
          LINK_ALERT_GITHUB
          .replace('%1', window.location.href)
          .replace('%2', 'https://gist.github.com/' + data.id));
        monitorChanges_(workspace);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(HTTPREQUEST_ERROR + '\n' + 'httpRequest_.status: ' + jqXHR.status);
      }
    });


  };

  var retrieveGisRawUrl_ = function(id, callback) {
    $.ajax({
      dataType: "json",
      method: "GET",
      url: "https://api.github.com/gists/" + id,
      success: function(data) {
        callback(data.files["workspace.xml"].raw_url);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(HTTPREQUEST_ERROR + '\n' + 'httpRequest_.status: ' + jqXHR.status);
      }
    });
  }

  var urlFromKey_ = function(key, callback) {
    var keyParts = key.split(":");
    switch (keyParts[0]) {
      case "gist":
        retrieveGisRawUrl_(keyParts[1], callback);
        break;
      default:
    }
  }

  /**
   * Retrieve XML text from database using given key.
   * @param {string} key Key to XML, obtained from href.
   * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
   */
  var retrieveXml = function(key, opt_workspace) {
    var workspace = opt_workspace || Blockly.getMainWorkspace();
    urlFromKey_(key, function(url) {
      makeRequest_({
        headers: {Accept: "text/xml"},
        dataType: "text",
        method: "GET",
        url: url,
        success: function(data) {
          if (!data.length) {
            alert(HASH_ERROR.replace('%1', window.location.hash));
          } else {
            loadXml_(data, workspace);
          }
          monitorChanges_(workspace);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert(HTTPREQUEST_ERROR + '\n' + 'httpRequest_.status: ' + jqXHR.status);
        }
      });
    });
  };

  /**
   * Reference to current AJAX request.
   * @type {XMLHttpRequest}
   * @private
   */
  var httpRequest_ = null;

  /**
   * Callback function for AJAX call.
   * @private
   */
  var makeRequest_ = function(ajaxOptions) {
    if (httpRequest_) {
      // AJAX call is in-flight.
      httpRequest_.abort();
    }
    httpRequest_ = $.ajax(ajaxOptions);
  };

  /**
   * Start monitoring the workspace.  If a change is made that changes the XML,
   * clear the key from the URL.  Stop monitoring the workspace once such a
   * change is detected.
   * @param {!Blockly.WorkspaceSvg} workspace Workspace.
   * @private
   */
  var monitorChanges_ = function(workspace) {
    var startXmlDom = Blockly.Xml.workspaceToDom(workspace);
    var startXmlText = Blockly.Xml.domToText(startXmlDom);
    function change() {
      var xmlDom = Blockly.Xml.workspaceToDom(workspace);
      var xmlText = Blockly.Xml.domToText(xmlDom);
      if (startXmlText != xmlText) {
        window.location.hash = '';
        workspace.removeChangeListener(bindData);
      }
    }
    var bindData = workspace.addChangeListener(change);
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
      alert(XML_ERROR + '\nXML: ' + xml);
      return;
    }
    // Clear the workspace to avoid merge.
    workspace.clear();
    Blockly.Xml.domToWorkspace(workspace, xml);
  };

  /**
   * Present a text message to the user.
   * Designed to be overridden if an app has custom dialogs, or a butter bar.
   * @param {string} message Text to alert.
   */
  var alert = function(message) {
    window.alert(message);
  };

  return {
    backupOnUnload: backupOnUnload,
    restoreBlocks: restoreBlocks,
    linkGist: linkGist,
    retrieveXml: retrieveXml,
    alert: alert
  };

}) ();
