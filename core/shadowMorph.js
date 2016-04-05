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
 * @fileoverview morph shadow blocks to regular ones when modified
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.ShadowMorph');

SparqlBlocks.ShadowMorph = ( function() {

  var materializeToTop = function(block, event) {
    var parentBlock = block.getParent();
    if (parentBlock) {
      materializeToTop(parentBlock);
    }
    if (block.isShadow()) {

      var shadowId = Blockly.genUid();
      var shadowDom = Blockly.Xml.blockToDomWithXY(block);
      shadowDom.setAttribute("id", shadowId);
      if (event && event.type === Blockly.Events.CHANGE && event.element === "field") {
        for (var child = shadowDom.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === Node.ELEMENT_NODE &&
              child.nodeName === "FIELD" &&
              child.getAttribute("name") === event.name) {
                child.textContent = event.oldValue;
                break;
          }
        }
      }

      block.workspace.undoStack_.pop();
      Blockly.Events.setGroup(true);

      var moveShadowEvent = new Blockly.Events.Move(block);
      moveShadowEvent.blockId = shadowId;
      moveShadowEvent.newParentId = null;
      moveShadowEvent.newInputName = null;
      moveShadowEvent.newCoordinate = block.getRelativeToSurfaceXY();
      Blockly.Events.fire(moveShadowEvent);

      block.parentBlock_ = null;
      var deleteShadowEvent = new Blockly.Events.Delete(block);
      block.parentBlock_ = parentBlock;
      deleteShadowEvent.blockId = shadowId;
      deleteShadowEvent.oldXml = shadowDom;

      Blockly.Events.fire(deleteShadowEvent);

      block.setShadow(false);

      // record event as creation of a new block and connection to parent block
      var createEvent = new Blockly.Events.Create(block);
      Blockly.Events.fire(createEvent);

      var moveEvent = new Blockly.Events.Move(block);
      moveEvent.oldParentId = null;
      moveEvent.oldInputName = null;
      moveEvent.oldCoordinate = block.getRelativeToSurfaceXY();
      moveEvent.recordNew();
      Blockly.Events.fire(moveEvent);

      Blockly.Events.setGroup(false);
    }
  }

  var track_ = function(workspace) {
    workspace.addChangeListener( function(event) {
      var block = Blockly.Block.getById(event.blockId);
      switch (event.type) {
        case Blockly.Events.CHANGE:
          materializeToTop(block, event);
          break;
        default:
      }
    });
  }

  return {
    track: track_
  };

}) ();
