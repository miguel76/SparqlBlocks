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
 * @fileoverview Extension of standard Blockly tooltip
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Tooltip');

Blockly.Tooltip.onMouseOut_ = function(e) {
  Blockly.Tooltip.mouseOutPid_ = setTimeout(function() {
      Blockly.Tooltip.hide();
      Blockly.Tooltip.element_ = null;
      Blockly.Tooltip.poisonedElement_ = null;
    }, 1);
  clearTimeout(Blockly.Tooltip.showPid_);
};

/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseMove_ = function(e) {
  if (!Blockly.Tooltip.element_ || !Blockly.Tooltip.element_.tooltip) {
    // No tooltip here to show.
    return;
  } else if (Blockly.dragMode_ != 0) {
    // Don't display a tooltip during a drag.
    return;
  } else if (Blockly.WidgetDiv.isVisible()) {
    // Don't display a tooltip if a widget is open (tooltip would be under it).
    return;
  }
  if (Blockly.Tooltip.visible) {
    // Compute the distance between the mouse position when the tooltip was
    // shown and the current mouse position.  Pythagorean theorem.
    var dx = Blockly.Tooltip.lastX_ - e.pageX;
    var dy = Blockly.Tooltip.lastY_ - e.pageY;
    var tooltipRadiusOK =
        Blockly.Tooltip.element_.tooltipRadiusOK ||
        Blockly.Tooltip.RADIUS_OK;
    if (Math.sqrt(dx * dx + dy * dy) > tooltipRadiusOK) {
      Blockly.Tooltip.hide();
    }
  } else if (Blockly.Tooltip.poisonedElement_ != Blockly.Tooltip.element_) {
    // The mouse moved, clear any previously scheduled tooltip.
    clearTimeout(Blockly.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Tooltip.lastX_ = e.pageX;
    Blockly.Tooltip.lastY_ = e.pageY;
    var tooltipHoverMs =
        Blockly.Tooltip.element_.tooltipHoverMs ||
        Blockly.Tooltip.HOVER_MS;
    Blockly.Tooltip.showPid_ =
        setTimeout(Blockly.Tooltip.show_, tooltipHoverMs);
  }
};

Blockly.Tooltip.hide = (function() {
  var parentHide = Blockly.Tooltip.hide;
  return function() {
    if (Blockly.Tooltip.element_ && Blockly.Tooltip.element_.hideTooltip) {
      Blockly.Tooltip.element_.hideTooltip();
    }
    parentHide();
  };
})();

Blockly.Tooltip.show_ = (function() {
  var parentShow = Blockly.Tooltip.show_;
  return function() {
    if (Blockly.Tooltip.element_ && Blockly.Tooltip.element_.showTooltip) {
      Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_;
      Blockly.Tooltip.visible = true;
      Blockly.Tooltip.element_.showTooltip();
    } else {
      parentShow();
    }
  };
})();
