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

goog.provide('SparqlBlocks.Guide');

SparqlBlocks.Guide = (function() {

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
      for (var i = 0, func; func = listeners_[i]; i++) {
        func(event);
      }
    };

    var fireEventsIfNotDragging = function() {
      if (!Blockly.dragMode_) {
        while (eventQueue_.length) {
          // console.log("firing event");
          fireChangeListener_(eventQueue_.shift());
        }
      }
    }

    workspace.addChangeListener( function(lastEvent) {
      if (lastEvent.type != Blockly.Events.MOVE
          || lastEvent.newParentId || lastEvent.oldParentId) {
            // Simplify eventQueue_
            // console.log("adding event to queue");
            var toAdd = true;
            var eventsBetweenCreateAndDelete = [];
            for (var pastEventId = eventQueue_.length - 1; pastEventId >= 0; pastEventId--) {
              // console.log("cehcking an old event...");
              var pastEvent = eventQueue_[pastEventId];
              if (pastEvent.blockId = lastEvent.blockId) {
                // console.log("already seen...");
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
    // Blockly.bindEvent_(
    //   workspace.getParentSvg(),
    //   'mouseup',
    //   this,
    //   function() {
    //     setTimeout(fireEventsIfNotDragging);
    //   });

    return {
      addChangeListener: addChangeListener_,
      removeChangeListener: removeChangeListener_
    };

  }

  var track_ = function(workspace, options) {

    options =
        _.extend(
            {
              stateList: [
                {
                  dialog: "Welcome to ...",
                  modal: true
                },
                {
                  dialog: "Add a graph pattern ...",
                  stepWhen: function(event, data) {
                    return event.type == Blockly.Events.CREATE &&
                            event.block.type == "sparql_typedsubject_propertylist";
                  }
                },
                {
                  dialog: "Thank you ...",
                  modal: true
                }
              ]
            },
            options );

    var eventManager = filteredEventManager_(workspace);

    var stateList = options.stateList;
    if (!stateList || !stateList.length) {
      console.err("Empty State List!");
      return;
    }

    var data = {};
    var stateId = -1;

    var enterNewState = function() {
      stateId++;
      var currState = stateList[stateId];
      if (!currState) {
        return;
      }
      if (currState.modal) {
        console.log("Modal: " + currState.dialog);
        alert(currState.dialog);
        setTimeout(enterNewState);
        return;
      } else {
        console.log("Not Modal: " + currState.dialog);
      }
      if (currState.stepWhen) {
        var listener = eventManager.addChangeListener(function(event) {
          if (currState.stepWhen(
                _.extend(
                  {
                    workspace: workspace,
                    block: Blockly.Block.getById(event.blockId)
                  },
                  event ),
                data)) {
              setTimeout( function() {
                eventManager.removeChangeListener(listener);
                enterNewState();
              });
          }
        });
      }
    }

    enterNewState();

  }

  return {
    track: track_
  }

})();
