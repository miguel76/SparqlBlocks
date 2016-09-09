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
    BlocklyDialogs = require('./lib-dialogs.js'),
    _ = require('underscore'),
    $ = require('jquery');

var filteredEventManager_ = function(workspace) {
  var listeners_ = [];
  var eventQueue_ = [];

  var addChangeListener_ = function(func) {
    listeners_.push(func);
    return func;
  };

  var removeChangeListener_ = function(func) {
    var i = listeners_.indexOf(func);
    if (i != -1) {
      listeners_.splice(i, 1);
    }
  };

  var fireChangeListener_ = function(event) {
    for (var listenerIndex = 0; listenerIndex < listeners_.length; listenerIndex++) {
      listeners_[listenerIndex](event);
    }
  };

  var fireEventsIfNotDragging = function() {
    if (!Blockly.dragMode_) {
      while (eventQueue_.length) {
        fireChangeListener_(eventQueue_.shift());
      }
    }
  };

  workspace.addChangeListener( function(lastEvent) {
    if (lastEvent.type != Blockly.Events.MOVE ||
        lastEvent.newParentId || lastEvent.oldParentId) {
          var toAdd = true;
          var eventsBetweenCreateAndDelete = [];
          for (var pastEventId = eventQueue_.length - 1; pastEventId >= 0; pastEventId--) {
            var pastEvent = eventQueue_[pastEventId];
            if (pastEvent.blockId == lastEvent.blockId) {
              if (lastEvent.type == Blockly.Events.MOVE) {
                  if (pastEvent.type == Blockly.Events.MOVE &&
                      lastEvent.oldParentId == pastEvent.newParentId &&
                      lastEvent.oldInputName == pastEvent.newInputName) {
                        pastEvent.newParentId = lastEvent.newParentId;
                        pastEvent.newInputName = lastEvent.newInputName;
                        if (!pastEvent.oldParentId && !pastEvent.newParentId) {
                          eventQueue_.splice(pastEventId, 1);
                        }
                        toAdd = false;
                  }
                  break;
              } else if (lastEvent.type == Blockly.Events.DELETE) {
                if (pastEvent.type == Blockly.Events.CREATE) {
                  eventsBetweenCreateAndDelete.push(pastEventId);
                  for (var i = 0; i < eventsBetweenCreateAndDelete.length; i++) {
                    eventQueue_.splice(eventsBetweenCreateAndDelete[i] - i, 1);
                  }
                  toAdd = false;
                  break;
                } else {
                  eventsBetweenCreateAndDelete.push(pastEventId);
                }
              } else if (lastEvent.type == Blockly.Events.CHANGE) {
                if (pastEvent.type == Blockly.Events.CHANGE &&
                    pastEvent.element == lastEvent.element &&
                    pastEvent.name == lastEvent.name &&
                    pastEvent.newValue == lastEvent.oldValue) {
                  pastEvent.newValue = lastEvent.newValue;
                  toAdd = false;
                  break;
                }
              }
            }
          }
          if (toAdd) {
            eventQueue_.push(lastEvent);
          }
    }
    setTimeout(fireEventsIfNotDragging,100);
  });

  return {
    addChangeListener: addChangeListener_,
    removeChangeListener: removeChangeListener_
  };

};

var nonModalDefaultStyle = {
  "top": "inherit",
  "left": "inherit",
  "bottom": "inherit",
  'width': 'inherit',
  "right": "inherit"
};
var modalDefaultStyle = {
  'width': '75%',
  "bottom": "inherit",
  'left': '15%',
  'top': '5%'
};

var replaceInLineBlockly_ = function(div) {
  var toReplaceArray = div.getElementsByClassName("blockly-readOnly");
  var j = 0;
  for (var i = 0; i < toReplaceArray.length; i++) {
    var toReplace = toReplaceArray[i];
    var content = toReplace.innerHTML;
    var zoom = toReplace.getAttribute("blockly-zoom");
    toReplace.innerHTML = "";
    var localWorkspace = Blockly.inject(
      toReplace,
      _.extend(
        {'readOnly': true},
        zoom ?
          { zoom:
              { controls: false,
                wheel: false,
                startScale: zoom }
          } : {} ));
    var recordUndoBackup = Blockly.Events.recordUndo;
    Blockly.Events.recordUndo = false; // trick to permit top-level shadow blocks
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom("<xml>" + content + "</xml>"), localWorkspace);
    Blockly.Events.recordUndo = recordUndoBackup;
  }
};

var setOkButtons = function(div) {
  $(".blocklydialogs-ok").click(function() {
    BlocklyDialogs.hideDialog(true);
  });
};

var track_ = function(workspace, options) {

  options =
      _.extend(
          { startStateId: 0 },
          options );

  var eventManager = filteredEventManager_(workspace);

  var stateList = options.stateList;
  if (!stateList || !stateList.length) {
    return;
  }

  var data = {};
  var stateId = options.startStateId - 1;

  var enterNewState = function() {
    stateId++;
    var currState = stateList[stateId];
    if (!currState) {
      return;
    }


    var dialogDiv = currState.dialog ? document.getElementById(currState.dialog) : null;

    if (dialogDiv) {
      replaceInLineBlockly_(dialogDiv);
      setOkButtons(dialogDiv);
    }

    if (currState.do) {
      currState.do(data);
    }

    if (dialogDiv) {
      BlocklyDialogs.showDialog(
        dialogDiv, currState.useFocus ? data.focus : null, false, currState.modal,
        _.extend(
          {},
          currState.modal ? modalDefaultStyle : nonModalDefaultStyle,
          currState.style ? currState.style : {}
        ),
        function() { setTimeout(enterNewState); });
    }

    if (currState.stepWhen) {
      var listener = eventManager.addChangeListener(function(event) {
        if (currState.stepWhen(
              _.extend(
                {
                  workspace: workspace,
                  block: workspace.getBlockById(event.blockId)
                },
                event,
                event.newParentId ? { newParent: workspace.getBlockById(event.newParentId) } : {},
                event.oldParentId ? { oldParent: workspace.getBlockById(event.oldParentId) } : {}),
              data)) {
            setTimeout( function() {
              eventManager.removeChangeListener(listener);
              BlocklyDialogs.hideDialog();
            });
        }
      });
    }
  };

  enterNewState();
  return {
    getStateId: function() {
      return stateId;
    }
  };

};

var checkBlock = function(block, checkStructure) {
  if (checkStructure.type) {
    if (_.isArray(checkStructure.type)) {
      if (_.indexOf(checkStructure.type, block.type) === -1)
        return false;
    } else if (checkStructure.type !== block.type) {
      return false;
    }
  }
  var inputs = _.keys(checkStructure);
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input === "type") { // type already considered
      continue;
    }
    var contentCheck = checkStructure[input];
    if (_.isArray(contentCheck)) { // check for a list statement blocks
      var containedStmt = block.getInputTargetBlock(input);
      contentCheck = contentCheck.slice(); // create a copy so that can be modified
      for (;containedStmt; containedStmt = containedStmt.getNextBlock()) {
        var contentCheckFound = false;
        for (var contentCheckIndex = 0; contentCheckIndex < contentCheck.length; contentCheckIndex++) {
          var containedContentCheck = contentCheck[contentCheckIndex];
          if (checkBlock(containedStmt, containedContentCheck)) {
            // contentCheckFound = contentCheckIndex;
            contentCheckFound = true;
            contentCheck.splice(contentCheckIndex, 1);
            break;
          }
        }
        if (!contentCheckFound) { // if there is an unmatched item in the content
          return false;
        }
      }
      if (contentCheck.length > 0) { // if there were unmatched items in check structure
        return false;
      }
    } else if (_.isObject(contentCheck)) { // check for a simple input block
      var containedValueBlock = block.getInputTargetBlock(input);
      if (!containedValueBlock || !checkBlock(containedValueBlock, contentCheck)) {
        return false;
      }
    } else if (_.isNull(contentCheck)) { // check for an empty simple input
      if (block.getInputTargetBlock(input)) {
        return false;
      }
    } else { // check for an input field
      var inputValue = block.getFieldValue(input);
      if (contentCheck !== inputValue) {
        return false;
      }
    }

  }
  return true; // if everything went right
};

var checkWorkspace = function(workspace, checkStructure) {
  if (Array.isArray ?
        Array.isArray(checkStructure) :
        Object.prototype.toString.call(checkStructure) === '[object Array]') {
    var blockList = [];
    for (var i = 0; i < checkStructure.length; i++) {
      var foundBlock = checkWorkspace(workspace, checkStructure[i]);
      if (foundBlock) {
        blockList.push(foundBlock);
      } else {
        blockList.splice(0);
        return null;
      }
    }
    return blockList;
  }
  var topBlocks = workspace.getTopBlocks();
  for (var i = 0; i < topBlocks.length; i++) {
    var topBlock = topBlocks[i];
    if (checkBlock(topBlock, checkStructure)) {
      return topBlock;
    }
  }
  return null;
};

module.exports = {
  track: track_,
  check: checkWorkspace,
  replaceInLineBlockly: replaceInLineBlockly_,
  setOkButtons: setOkButtons
};
