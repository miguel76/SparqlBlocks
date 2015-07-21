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
 * @fileoverview Self Duplicating Blocks for Blockly.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani) from code by fraser@google.com (Neil Fraser)
 */
'use strict';

// (function() {

  goog.provide('SparqlBlocks.SelfDuplication');

  /**
  * Is a hovering element currently showing?
  */
  SparqlBlocks.SelfDuplication.visible = false;

  /**
  * PID of suspended thread to clear tooltip on mouse out.
  * @private
  */
  var mouseOutPid_ = 0;

  /**
  * PID of suspended thread to show the tooltip.
  * @private
  */
  var showPid_ = 0;

  /**
  * Last observed X location of the mouse pointer (freezes when tooltip appears).
  * @private
  */
  var lastX_ = 0;

  /**
  * Last observed Y location of the mouse pointer (freezes when tooltip appears).
  * @private
  */
  var lastY_ = 0;

  /**
  * Current element being pointed at.
  * @private
  */
  var element_ = null;

  /**
  * Once a tooltip has opened for an element, that element is 'poisoned' and
  * cannot respawn a tooltip until the pointer moves over a different element.
  * @private
  */
  var poisonedElement_ = null;

  /**
  * Horizontal offset between mouse cursor and tooltip.
  */
  SparqlBlocks.SelfDuplication.OFFSET_X = 0;

  /**
  * Vertical offset between mouse cursor and tooltip.
  */
  SparqlBlocks.SelfDuplication.OFFSET_Y = 10;

  /**
  * Radius mouse can move before killing tooltip.
  */
  SparqlBlocks.SelfDuplication.RADIUS_OK = 100;

  /**
  * Delay before tooltip appears.
  */
  SparqlBlocks.SelfDuplication.HOVER_MS = 1000;

  /**
  * Horizontal padding between tooltip and screen edge.
  */
  SparqlBlocks.SelfDuplication.MARGINS = 5;

  /**
  * The duplicated block.  Set once by Blockly.Tooltip.createDom.
  * @type Element
  */
  // var duplicateBlock_ = null;

  /**
   * Duplicate this block and its children.
   * @return {!Blockly.Block} The duplicate.
   * @private
   */
  var duplicateInPlace_ = function(block) {
    // Create a duplicate via XML.
    var xmlBlock = Blockly.Xml.blockToDom_(block);
    Blockly.Xml.deleteNext(xmlBlock);
    var newBlock = Blockly.Xml.domToBlock(
        /** @type {!Blockly.Workspace} */ (block.workspace), xmlBlock);
    // Move the duplicate next to the old block.
    var xy = block.getRelativeToSurfaceXY();
    newBlock.moveBy(xy.x, xy.y);
    newBlock.select();
    return newBlock;
  };



  /**
   * Hide the tooltip.
   */
  var hide_ = function(block, duplicateBlock) {
    return function() {
      // console.log('SparqlBlocks.SelfDuplication.visible: ' + SparqlBlocks.SelfDuplication.visible);
      if (duplicateBlock) {
        var blockCoords = block.getRelativeToSurfaceXY();
        var duplicateBlockCoords = duplicateBlock.getRelativeToSurfaceXY();
        var dx = blockCoords.x - duplicateBlockCoords.x;
        var dy = blockCoords.y - duplicateBlockCoords.y;
        var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (dr <= SparqlBlocks.SelfDuplication.RADIUS_OK) {
          duplicateBlock.dispose();
          duplicateBlock = null;
        }
      }
      clearTimeout(showPid_);
    };
  };
  SparqlBlocks.SelfDuplication.hide = hide_;

  /**
   * Create the duplicate and show it.
   * @private
   */
  var show_ = function(block) {
    return function() {
      // if (!block.duplicateBlock) {
        poisonedElement_ = element_;
        // duplicateBlock_ = block.duplicate_();
        unbindMouseEvents_(block);
        var duplicateBlock = duplicateInPlace_(block);
        bindMouseEvents_(block);
        Blockly.bindEvent_(
            duplicateBlock.getSvgRoot(), 'mouseout', null,
            onDuplicateMouseOut_(block, duplicateBlock))
        Blockly.bindEvent_(
            duplicateBlock.getSvgRoot(), 'mouseover', null,
            onDuplicateMouseOver_(block, duplicateBlock))
        duplicateBlock.setDeletable(true);
        duplicateBlock.setMovable(true);
        duplicateBlock.setEditable(true);
      // }
    };
  };

  /**
   * Remove duplicate if the mouse is over a different object.
   * Initialize the tooltip to potentially appear for this object.
   * @param {!Event} e Mouse event.
   * @private
   */
  var onMouseOver_ = function(block) {
    return function(e) {
      // If the tooltip is an object, treat it as a pointer to the next object in
      // the chain to look at.  Terminate when a string or function is found.
      var element = e.target;
      if (!Blockly.dragMode_) {
        show_(block)();
      }
      // if (element_ != element
      //     && (!duplicateBlock_ || duplicateBlock_.getSvgRoot() != element)) {
      //   hide_(block)();
      //   poisonedElement_ = null;
      //   element_ = element;
      // }
      // Forget about any immediately preceeding mouseOut event.
      // clearTimeout(mouseOutPid_);
    };
  };

  /**
   * Hide the tooltip if the mouse leaves the object and enters the workspace.
   * @param {!Event} e Mouse event.
   * @private
   */
  var onMouseOut_ = function(block) {
    return function(e) {
      // Moving from one element to another (overlapping or with no gap) generates
      // a mouseOut followed instantly by a mouseOver.  Fork off the mouseOut
      // event and kill it if a mouseOver is received immediately.
      // This way the task only fully executes if mousing into the void.
      mouseOutPid_ = setTimeout(function() {
            element_ = null;
            poisonedElement_ = null;
            hide_(block)();
          }, 1);
      clearTimeout(showPid_);
    };
  };

  /**
   * Remove duplicate if the mouse is over a different object.
   * Initialize the tooltip to potentially appear for this object.
   * @param {!Event} e Mouse event.
   * @private
   */
  var onDuplicateMouseOver_ = function(block, duplicateBlock) {
    return function(e) {
      // If the tooltip is an object, treat it as a pointer to the next object in
      // the chain to look at.  Terminate when a string or function is found.
      var element = e.target;
      if (duplicateBlock.mouseOutPid_) {
        clearTimeout(duplicateBlock.mouseOutPid_);
      }
    };
  };

  /**
   * Hide the tooltip if the mouse leaves the object and enters the workspace.
   * @param {!Event} e Mouse event.
   * @private
   */
  var onDuplicateMouseOut_ = function(block, duplicateBlock) {
    return function(e) {
      // Moving from one element to another (overlapping or with no gap) generates
      // a mouseOut followed instantly by a mouseOver.  Fork off the mouseOut
      // event and kill it if a mouseOver is received immediately.
      // This way the task only fully executes if mousing into the void.
      if (!Blockly.dragMode_) {
        duplicateBlock.mouseOutPid_ = setTimeout(function() {
          element_ = null;
          poisonedElement_ = null;
          hide_(block, duplicateBlock)();
          duplicateBlock.mouseOutPid_ = null;
        }, 1);
      }
      // clearTimeout(showPid_);
      // element_ = null;
      // poisonedElement_ = null;
      // hide_(block)();
    };
  };

  /**
   * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
   * is already visible, hide it if the mouse strays out of a certain radius.
   * @param {!Event} e Mouse event.
   * @private
   */
  var onMouseMove_ = function(block) {
    return function(e) {
      if (!element_) {
        // No tooltip here to show.
        return;
      } else if (Blockly.dragMode_ != 0) {
        // Don't display a tooltip during a drag.
        return;
      } else if (Blockly.WidgetDiv.isVisible()) {
        // Don't display a tooltip if a widget is open (tooltip would be under it).
        return;
      }
      if (SparqlBlocks.SelfDuplication.visible) {
        // Compute the distance between the mouse position when the tooltip was
        // shown and the current mouse position.  Pythagorean theorem.
        // var dx = lastX_ - e.clientX;
        // var dy = lastY_ - e.clientY;
        // var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        // if (dr > SparqlBlocks.SelfDuplication.RADIUS_OK) {
          hide_(block)();
        // }
      } else if (poisonedElement_ != element_) {
        // The mouse moved, clear any previously scheduled tooltip.
        clearTimeout(showPid_);
        // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
        lastX_ = e.clientX;
        lastY_ = e.clientY;
        showPid_ = setTimeout(show_(block), SparqlBlocks.SelfDuplication.HOVER_MS);
        }
    };
  };

  /**
   * Unbinds the required mouse events onto an SVG element.
   * @param {!Element} element SVG element onto which tooltip is to be bound.
   */
  var unbindMouseEvents_ = function(block) {
    var be = block.boundEvents;
    // if (be) {
      Blockly.unbindEvent_(be.mouseover);
      // Blockly.unbindEvent_(be.mouseout);
      // Blockly.unbindEvent_(be.mousemove);
    // }
  };

  /**
   * Unbinds the required mouse events onto an SVG element.
   * @param {!Element} element SVG element onto which tooltip is to be bound.
   */
  var unbindTheseMouseEvents_ = function(boundEvents) {
      Blockly.unbindEvent_(boundEvents.mouseover);
      // Blockly.unbindEvent_(be.mouseout);
      // Blockly.unbindEvent_(be.mousemove);
    // }
  };

  /**
   * Binds the required mouse events onto an SVG element.
   * @param {!Element} element SVG element onto which tooltip is to be bound.
   */
  var bindMouseEvents_ = function(block, element) {
    if (!element) {
      element = block.svgPath_;
      if (!element) throw "SVG Path Element Not Found for Block: " + block;
    }
    block.boundEvents = {
        mouseover: Blockly.bindEvent_(element, 'mouseover', null, onMouseOver_(block))
        // mouseout: Blockly.bindEvent_(element, 'mouseout', null, onMouseOut_(block)),
        // mousemove: Blockly.bindEvent_(element, 'mousemove', null, onMouseMove_(block))
    };
  };
  SparqlBlocks.SelfDuplication.bindMouseEvents = bindMouseEvents_;

// })();
