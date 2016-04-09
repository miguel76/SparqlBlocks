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
 * @fileoverview Tabular Flyout.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.TabularFlyout');

goog.require('Blockly.Flyout');

/**
 * Class for a tabular flyout.
 * @param {!Object} workspaceOptions Dictionary of options for the workspace.
 * @constructor
 */
SparqlBlocks.TabularFlyout = function(workspaceOptions) {
  // SparqlBlocks.TabularFlyout.superClass_.constructor.call(this, '');
};
goog.inherits(SparqlBlocks.TabularFlyout, Blockly.Flyout);

/**
 * Create the blocks to be shown in this flyout.
 * @param {!Array|string} xmlTable Table of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
SparqlBlocks.TabularFlyout.prototype.createBlocks_ = function(xmlTable) {
  var blockTable = [];
  var gaps = [];
  for (var i = 0; ; i++) {
    var blockRow = [];
    for (var j = 0, xml; xml = xmlTable[i][j]; i++) {
      if (xml.tagName && xml.tagName.toUpperCase() == 'BLOCK') {
        var block = Blockly.Xml.domToBlock(
            xml, /** @type {!Blockly.Workspace} */ (this.workspace_));
        blockRow.push(block);
        // gaps.push(margin * 3);
      }
    }
    blockTable.push(blockRow);
  }
  return blockTable;
}

/**
 * Show and populate the flyout.
 * @param {!Array|string} blockTable Table of blocks to show.
 */
SparqlBlocks.TabularFlyout.prototype.showFromBlocks = function(blockTable) {
  this.hide();
  // Delete any blocks from a previous showing.
  var blocks = this.workspace_.getTopBlocks(false);
  for (var x = 0, block; block = blocks[x]; x++) {
    if (block.workspace == this.workspace_) {
      block.dispose(false, false);
    }
  }
  // Delete any background buttons from a previous showing.
  for (var x = 0, rect; rect = this.buttons_[x]; x++) {
    goog.dom.removeNode(rect);
  }
  this.buttons_.length = 0;

  var margin = this.CORNER_RADIUS;
  this.svgGroup_.style.display = 'block';

  SparqlBlocks.TabularFlyout.prototype.loadDomAndPosition_(blockTable);

  this.width_ = 0;
  this.reflow();

  this.filterForCapacity_();

  // Fire a resize event to update the flyout's scrollbar.
  Blockly.fireUiEventNow(window, 'resize');
  this.reflowWrapper_ = Blockly.bindEvent_(this.workspace_.getCanvas(),
      'blocklyWorkspaceChange', this, this.reflow);
  this.workspace_.fireChangeEvent();
}

SparqlBlocks.FieldTable.prototype.loadDomAndPosition_ = function(blockTable) {

  // Lay out the blocks vertically.
  var cursorY = margin;
  for (var i = 0, block; block = blocks[i]; i++) {
    var allBlocks = block.getDescendants();
    for (var j = 0, child; child = allBlocks[j]; j++) {
      // Mark blocks as being inside a flyout.  This is used to detect and
      // prevent the closure of the flyout if the user right-clicks on such a
      // block.
      child.isInFlyout = true;
      // There is no good way to handle comment bubbles inside the flyout.
      // Blocks shouldn't come with predefined comments, but someone will
      // try this, I'm sure.  Kill the comment.
      child.setCommentText(null);
    }
    block.render();
    var root = block.getSvgRoot();
    var blockHW = block.getHeightWidth();
    var x = this.RTL ? 0 : margin / this.workspace_.scale +
        Blockly.BlockSvg.TAB_WIDTH;
    block.moveBy(x, cursorY);
    cursorY += blockHW.height + gaps[i];

    // Create an invisible rectangle under the block to act as a button.  Just
    // using the block as a button is poor, since blocks have holes in them.
    var rect = Blockly.createSvgElement('rect', {'fill-opacity': 0}, null);
    // Add the rectangles under the blocks, so that the blocks' tooltips work.
    this.workspace_.getCanvas().insertBefore(rect, block.getSvgRoot());
    block.flyoutRect_ = rect;
    this.buttons_[i] = rect;

    if (this.autoClose) {
      this.listeners_.push(Blockly.bindEvent_(root, 'mousedown', null,
          this.createBlockFunc_(block)));
    } else {
      this.listeners_.push(Blockly.bindEvent_(root, 'mousedown', null,
          this.blockMouseDown_(block)));
    }
    this.listeners_.push(Blockly.bindEvent_(root, 'mouseover', block,
        block.addSelect));
    this.listeners_.push(Blockly.bindEvent_(root, 'mouseout', block,
        block.removeSelect));
    this.listeners_.push(Blockly.bindEvent_(rect, 'mousedown', null,
        this.createBlockFunc_(block)));
    this.listeners_.push(Blockly.bindEvent_(rect, 'mouseover', block,
        block.addSelect));
    this.listeners_.push(Blockly.bindEvent_(rect, 'mouseout', block,
        block.removeSelect));
  }

  // IE 11 is an incompetant browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function(e) {
    var blocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = blocks[i]; i++) {
      block.removeSelect();
    }
  };
  this.listeners_.push(Blockly.bindEvent_(this.svgBackground_, 'mouseover',
      this, deselectAll));


  // Build the DOM.
  var offsetY = 6 - Blockly.BlockSvg.FIELD_HEIGHT;
  this.rootElement_ = Blockly.createSvgElement(
      'g',
      { 'class': 'sbTable',
        'y': offsetY }, null); //name, attrs, parent, opt_workspace
  if (!this.visible_) {
    this.rootElement_.style.display = 'none';
  }

  var head = this.data_.head;
  if (head) {
    var headElement =
        Blockly.createSvgElement('g', { 'class': 'sbHead'}, this.rootElement_);
    var headVars = this.data_.head.vars;
    if (headVars) {
      var totalWidth = 0;
      var totalHeight = 0;
      var maxCellWidth = {};
      var maxCellHeight = [0];
      var cellOffsetX = 0;
      var varBlocks = {};
      headVars.forEach( function(varName) {
        var varBlock =
            SparqlBlocks.JsonToBlocks.selfDuplicatingBlockFromVar(varName, workspace);
        varBlock.render();
        var blockSize = varBlock.getHeightWidth();
        if (blockSize.height > maxCellHeight[0]) {
          maxCellHeight[0] = blockSize.height;
        }
        headElement.appendChild(varBlock.getSvgRoot());
        maxCellWidth[varName] = blockSize.width;
        varBlocks[varName] = varBlock;
      });
      totalHeight += maxCellHeight[0];

      var blockRows = [];
      var bindings = this.data_.results && this.data_.results.bindings;
      if (bindings) {
        var bodyElement =
            Blockly.createSvgElement('g', { 'class': 'sbBody'}, this.rootElement_);
        blockRows = bindings.map( function(binding, index) {
          maxCellHeight[index + 1] = 0; // leaves index 0 for the head
          var rowCellBlocks = {};
          headVars.forEach( function(varName) {
            var value = binding[varName];
            if (value) {
              var valueBlock =
                  SparqlBlocks.JsonToBlocks.selfDuplicatingBlockFromValue(value, workspace);
              valueBlock.render();
              var blockSize = valueBlock.getHeightWidth();
              if (blockSize.width > maxCellWidth[varName]) {
                maxCellWidth[varName] = blockSize.width;
              }
              if (blockSize.height > maxCellHeight[index + 1]) {
                maxCellHeight[index + 1] = blockSize.height;
              }
              bodyElement.appendChild(valueBlock.getSvgRoot());
              rowCellBlocks[varName] = valueBlock;
            }
          });
          totalHeight += maxCellHeight[index + 1];
          return rowCellBlocks;
        });
        headVars.forEach( function(varName) {
          totalWidth += maxCellWidth[varName];
        });
      }
    }
  }
  this.size_ = new goog.math.Size(totalWidth, totalHeight);
  this.position_(headVars, varBlocks, blockRows, maxCellWidth, maxCellHeight);
  block.getSvgRoot().appendChild(this.rootElement_);

};

SparqlBlocks.FieldTable.prototype.positionBlock_ = function(block, x, y) {
  block.getSvgRoot().setAttribute(
      'transform',
      'translate(' + x + ',' + y + ')');
  // block.moveConnections_(x, y);
}

SparqlBlocks.FieldTable.prototype.position_ = function( colNames,
                                                      headBlocks, blockRows,
                                                      maxCellWidth, maxCellHeight) {
  var offsetX = 0;
  colNames.forEach( function(colName, colIndex) {
    var block = headBlocks[colName];
    positionBlock_(block, offsetX, 0);
    offsetX += maxCellWidth[colName];
  });
  var offsetY = 0;
  blockRows.forEach( function(blockRow, rowIndex) {
    var offsetX = 0;
    offsetY += maxCellHeight[rowIndex];
    colNames.forEach( function(colName, colIndex) {
      var block = blockRow[colName];
      positionBlock_(block, offsetX, offsetY);
      offsetX += maxCellWidth[colName];
    });
  });
};

/**
 * Show and populate the flyout.
 * @param {!Array|string} xmlTable Table of blocks to show.
 */
SparqlBlocks.TabularFlyout.prototype.show = function(xmlTable) {
  load
}
