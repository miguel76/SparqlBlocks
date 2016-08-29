/**
 * @fileoverview Shim on Blockly to permit connecting to shadow blocks (that will morph to regular ones)
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
 * Checks whether the current connection can connect with the target
 * connection.
 * @param {Blockly.Connection} target Connection to check compatibility with.
 * @return {number} Blockly.Connection.CAN_CONNECT if the connection is legal,
 *    an error code otherwise.
 * @private
 */
Blockly.Connection.prototype.canConnectWithReason_ = function(target) {
  if (!target) {
    return Blockly.Connection.REASON_TARGET_NULL;
  }
  if (this.isSuperior()) {
    var blockA = this.sourceBlock_;
    var blockB = target.getSourceBlock();
  } else {
    var blockB = this.sourceBlock_;
    var blockA = target.getSourceBlock();
  }
  if (blockA && blockA == blockB) {
    return Blockly.Connection.REASON_SELF_CONNECTION;
  } else if (target.type != Blockly.OPPOSITE_TYPE[this.type]) {
    return Blockly.Connection.REASON_WRONG_TYPE;
  } else if (blockA && blockB && blockA.workspace !== blockB.workspace) {
    return Blockly.Connection.REASON_DIFFERENT_WORKSPACES;
  } else if (!this.checkType_(target)) {
    return Blockly.Connection.REASON_CHECKS_FAILED;
  } else if (blockA.isShadow() && !blockB.isShadow()) {
    // return Blockly.Connection.REASON_SHADOW_PARENT;
    return Blockly.Connection.CAN_CONNECT;
  }
  return Blockly.Connection.CAN_CONNECT;
};

/**
 * Connect two connections together.  This is the connection on the superior
 * block.
 * @param {!Blockly.Connection} childConnection Connection on inferior block.
 * @private
 */
Blockly.Connection.prototype.connect_ = function(childConnection) {
  var parentConnection = this;
  var parentBlock = parentConnection.getSourceBlock();
  var childBlock = childConnection.getSourceBlock();
  parentBlock.blockIsTargetOfConnection(childBlock, function() {
    // Disconnect any existing parent on the child connection.
    if (childConnection.isConnected()) {
      childConnection.disconnect();
    }
    if (parentConnection.isConnected()) {
      // Other connection is already connected to something.
      // Disconnect it and reattach it or bump it as needed.
      var orphanBlock = parentConnection.targetBlock();
      var shadowDom = parentConnection.getShadowDom();
      // Temporarily set the shadow DOM to null so it does not respawn.
      parentConnection.setShadowDom(null);
      // Displaced shadow blocks dissolve rather than reattaching or bumping.
      if (orphanBlock.isShadow()) {
        // Save the shadow block so that field values are preserved.
        shadowDom = Blockly.Xml.blockToDom(orphanBlock);
        orphanBlock.dispose();
        orphanBlock = null;
      } else if (parentConnection.type == Blockly.INPUT_VALUE) {
        // Value connections.
        // If female block is already connected, disconnect and bump the male.
        if (!orphanBlock.outputConnection) {
          throw 'Orphan block does not have an output connection.';
        }
        // Attempt to reattach the orphan at the end of the newly inserted
        // block.  Since this block may be a row, walk down to the end
        // or to the first (and only) shadow block.
        var connection = Blockly.Connection.lastConnectionInRow_(
            childBlock, orphanBlock);
        if (connection) {
          orphanBlock.outputConnection.connect(connection);
          orphanBlock = null;
        }
      } else if (parentConnection.type == Blockly.NEXT_STATEMENT) {
        // Statement connections.
        // Statement blocks may be inserted into the middle of a stack.
        // Split the stack.
        if (!orphanBlock.previousConnection) {
          throw 'Orphan block does not have a previous connection.';
        }
        // Attempt to reattach the orphan at the bottom of the newly inserted
        // block.  Since this block may be a stack, walk down to the end.
        var newBlock = childBlock;
        while (newBlock.nextConnection) {
          var nextBlock = newBlock.getNextBlock();
          if (nextBlock && !nextBlock.isShadow()) {
            newBlock = nextBlock;
          } else {
            if (orphanBlock.previousConnection.checkType_(
                newBlock.nextConnection)) {
              newBlock.nextConnection.connect(orphanBlock.previousConnection);
              orphanBlock = null;
            }
            break;
          }
        }
      }
      if (orphanBlock) {
        // Unable to reattach orphan.
        parentConnection.disconnect();
        if (Blockly.Events.recordUndo) {
          // Bump it off to the side after a moment.
          var group = Blockly.Events.getGroup();
          setTimeout(function() {
            // Verify orphan hasn't been deleted or reconnected (user on meth).
            if (orphanBlock.workspace && !orphanBlock.getParent()) {
              Blockly.Events.setGroup(group);
              if (orphanBlock.outputConnection) {
                orphanBlock.outputConnection.bumpAwayFrom_(parentConnection);
              } else if (orphanBlock.previousConnection) {
                orphanBlock.previousConnection.bumpAwayFrom_(parentConnection);
              }
              Blockly.Events.setGroup(false);
            }
          }, Blockly.BUMP_DELAY);
        }
      }
      // Restore the shadow DOM.
      parentConnection.setShadowDom(shadowDom);
    }
    var event;
    if (Blockly.Events.isEnabled()) {
      event = new Blockly.Events.Move(childBlock);
    }
    // Establish the connections.
    Blockly.Connection.connectReciprocally_(parentConnection, childConnection);
    // Demote the inferior block so that one is a child of the superior one.
    childBlock.setParent(parentBlock);
    if (event) {
      event.recordNew();
      Blockly.Events.fire(event);
    }
  });
};

/**
 * Filter the queued events and merge duplicates.
 * @param {!Array.<!Blockly.Events.Abstract>} queueIn Array of events.
 * @param {boolean} forward True if forward (redo), false if backward (undo).
 * @return {!Array.<!Blockly.Events.Abstract>} Array of filtered events.
 */
Blockly.Events.filter = function(queueIn, forward) {
  var queue = queueIn.slice();
  var groupsToMergeIn = {};
  var addGroupsToMerge = function (groupFrom, groupTo) {
    if (groupFrom && groupTo && groupFrom != groupTo) {
      groupsToMergeIn[groupFrom] = groupTo;
    }
  };
  if (!forward) {
    // Undo is merged in reverse order.
    queue.reverse();
  }
  // Merge duplicates.  O(n^2), but n should be very small.
  for (var i = 0, event1; event1 = queue[i]; i++) {
    for (var j = i + 1, event2; event2 = queue[j]; j++) {
      if (event1.type == event2.type &&
          event1.blockId == event2.blockId &&
          event1.workspaceId == event2.workspaceId) {
        if (event1.type == Blockly.Events.MOVE) {
          // Merge move events.
          event1.newParentId = event2.newParentId;
          event1.newInputName = event2.newInputName;
          event1.newCoordinate = event2.newCoordinate;
          addGroupsToMerge(event2.group, event1.group);
          queue.splice(j, 1);
          j--;
        } else if (event1.type == Blockly.Events.CHANGE &&
            event1.element == event2.element &&
            event1.name == event2.name) {
          // Merge change events.
          event1.newValue = event2.newValue;
          addGroupsToMerge(event2.group, event1.group);
          queue.splice(j, 1);
          j--;
        } else if (event1.type == Blockly.Events.UI &&
            event2.element == 'click' &&
            (event1.element == 'commentOpen' ||
             event1.element == 'mutatorOpen' ||
             event1.element == 'warningOpen')) {
          // Merge change events.
          event1.newValue = event2.newValue;
          addGroupsToMerge(event2.group, event1.group);
          queue.splice(j, 1);
          j--;
        }
      }
    }
  }
  // Remove null events.
  for (var i = queue.length - 1; i >= 0; i--) {
    if (queue[i].isNull()) {
      queue.splice(i, 1);
    }
  }
  // Merge groups
  for (var i = 1, event; event = queue[i]; i++) {
    var newGroup;
    while (newGroup = groupsToMergeIn[event.group]) {
      event.group = newGroup;
    }
  }
  if (!forward) {
    // Restore undo order.
    queue.reverse();
  }
  // Move mutation events to the top of the queue.
  // Intentionally skip first event.
  for (var i = 1, event; event = queue[i]; i++) {
    if (event.type == Blockly.Events.CHANGE &&
        event.element == 'mutation') {
      queue.unshift(queue.splice(i, 1)[0]);
    }
  }
  return queue;
};
