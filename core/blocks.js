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
 * @fileoverview Core JavaScript library for SparqlBlocks.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks');
// goog.require('SparqlBlocks.Blocks.block');

SparqlBlocks.Blocks = ( function() {

  var baseInit_ = function(callback) {
    return function() {
    // ['cut', 'copy', 'paste'].forEach(function(event) {
    //   thisBlock.svgPath_.addEventListener(event, function(e) {
    //     console.log(event);
    //   });
    // });
      callback.call(this);
    }
  };

  var baseCustomContextMenu_ = function(callback) {
    return function(options) {
    // options.push({
    //   text: "Save Query as SPARQL",
    //   enabled: true,
    //   callback: saveQuerySparql
    // });
    // options.push({
    //   text: "Copy Fragment as SPARQL",
    //   enabled: true,
    //   callback: copyFragmentSparql
    // });
      if (callback) {
        callback.call(this, options);
      }
    };
  };

  var block_ = function(blockName, block) {
    block.customContextMenu = baseCustomContextMenu_(block.customContextMenu);
    block.init = baseInit_(block.init);
    Blockly.Blocks[blockName] = block;
  };

  var insertOptionBeforeHelp_ = function (options, newOption) {
    var helpCommand = options.pop();
    var isHelp = (helpCommand && helpCommand.text == "Help");
    if (!isHelp && helpCommand) {
      options.push(helpCommand);
    }
    options.push(newOption);
    if (isHelp) {
      options.push(helpCommand);
    }
  };

  /**
   * Zoom the blocks to fit in the workspace if possible.
   */
  Blockly.WorkspaceSvg.prototype.zoomToFit = function() {
    var workspaceBBox = this.svgBackground_.getBBox();
    var blocksBBox = this.svgBlockCanvas_.getBBox();
    var workspaceWidth = workspaceBBox.width - (this.toolbox_ ? this.toolbox_.width : 0) -
        Blockly.Scrollbar.scrollbarThickness;
    var workspaceHeight = workspaceBBox.height -
        Blockly.Scrollbar.scrollbarThickness;
    var blocksWidth = blocksBBox.width;
    var blocksHeight = blocksBBox.height;
    if (blocksWidth == 0) {
      return;  // Prevents zooming to infinity.
    }
    var ratioX = workspaceWidth / blocksWidth;
    var ratioY = workspaceHeight / blocksHeight;
    var ratio = Math.min(ratioX, ratioY);
    var speed = this.options.zoomOptions.scaleSpeed;
    var numZooms = Math.floor(Math.log(ratio) / Math.log(speed));
    var newScale = Math.pow(speed, numZooms);
    if (newScale > this.options.zoomOptions.maxScale) {
      newScale = this.options.zoomOptions.maxScale;
    } else if (newScale < this.options.zoomOptions.minScale) {
      newScale = this.options.zoomOptions.minScale;
    }
    this.scale = newScale;
    this.updateGridPattern_();
    if (this.scrollbar) {
      this.scrollbar.resize();
    }
    Blockly.hideChaff(false);
    if (this.flyout_) {
      // No toolbox, resize flyout.
      this.flyout_.reflow();
    }
    // Center the workspace.
    var metrics = this.getMetrics();
    if (this.scrollbar) {
      this.scrollbar.set(
          (metrics.contentWidth - metrics.viewWidth) / 2,
          (metrics.contentHeight - metrics.viewHeight) / 2);
    } else {
      this.translate(0, 0);
    }
  };

  /**
 * Reset zooming and dragging.
 * @param {!Event} e Mouse down event.
 */
Blockly.WorkspaceSvg.prototype.zoomReset = function(e) {
  this.scale = 1;
  this.updateGridPattern_();
  Blockly.hideChaff(false);
  if (this.flyout_) {
    // No toolbox, resize flyout.
    this.flyout_.reflow();
  }
  // Zoom level has changed, update the scrollbars.
  if (this.scrollbar) {
    this.scrollbar.resize();
  }
  // Center the workspace.
  var metrics = this.getMetrics();
  if (this.scrollbar) {
    this.scrollbar.set((metrics.contentWidth - metrics.viewWidth) / 2,
        (metrics.contentHeight - metrics.viewHeight) / 2);
  } else {
    this.translate(0, 0);
  }
  // This event has been handled.  Don't start a workspace drag.
  e.stopPropagation();
};



  return {
    block: block_,
    insertOptionBeforeHelp: insertOptionBeforeHelp_
  }

}) ();
