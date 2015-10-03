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
 * @fileoverview Table field.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani), based on work by fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('SparqlBlocks.FieldTable');

goog.require('SparqlBlocks.JsonToBlocks');
// goog.require('Blockly.Field');
// goog.require('Blockly.Tooltip');
// goog.require('goog.dom');
// goog.require('goog.math.Size');


/**
 * Class for a tabular field.
 * @param {string} data The initial content of the field.
 * @param {Function=} opt_changeHandler An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {SparqlBlocks.FieldTable}
 * @constructor
 */
SparqlBlocks.FieldTable = function(data, opt_changeHandler) {
  SparqlBlocks.FieldTable.superClass_.constructor.call(this, '');
  this.setChangeHandler(opt_changeHandler);
  // Set the initial state.
  // this.setValue(json);
  this.width_ = 0;
  this.height_ = 0;
  this.size_ = new goog.math.Size(this.width_, this.height_);
  this.data_ = data;
  this.flyout_ = new Blockly.Flyout({});
  this.flyout_.autoClose = false;
};
goog.inherits(SparqlBlocks.FieldTable, Blockly.Field);

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
SparqlBlocks.FieldTable.prototype.EDITABLE = false;

SparqlBlocks.FieldTable.prototype.setEventBindingsForBlock_ = function(block) {

  var root = block.getSvgRoot();

  // Create an invisible rectangle under the block to act as a button.  Just
  // using the block as a button is poor, since blocks have holes in them.
  var rect = Blockly.createSvgElement('rect', {'fill-opacity': 0}, null);
  // Add the rectangles under the blocks, so that the blocks' tooltips work.
  this.flyout_.workspace_.getCanvas().insertBefore(rect, root);
  block.flyoutRect_ = rect;

  var lstnrs = this.flyout_.listeners_;
  lstnrs.push(Blockly.bindEvent_(
      root, 'mousedown', null,
      this.flyout_.blockMouseDown_(block)));
  lstnrs.push(Blockly.bindEvent_(root, 'mouseover', block,
      block.addSelect));
  lstnrs.push(Blockly.bindEvent_(root, 'mouseout', block,
      block.removeSelect));
  lstnrs.push(Blockly.bindEvent_(rect, 'mousedown', null,
      this.flyout_.createBlockFunc_(block)));
  lstnrs.push(Blockly.bindEvent_(rect, 'mouseover', block,
      block.addSelect));
  lstnrs.push(Blockly.bindEvent_(rect, 'mouseout', block,
      block.removeSelect));
}

SparqlBlocks.FieldTable.prototype.setEventBindings_ = function(colNames, headBlocks, blockRows) {
  var parent = this;
  colNames.forEach( function(colName) {
    var block = headBlocks[colName];
    parent.setEventBindingsForBlock_(block);
  });
  blockRows.forEach( function(blockRow) {
    colNames.forEach( function(colName) {
      var block = blockRow[colName];
      parent.setEventBindingsForBlock_(block);
    });
  });

  // IE 11 is an incompetant browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function(e) {
    var blocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = blocks[i]; i++) {
      block.removeSelect();
    }
  };
  this.flyout_.listeners_.push(Blockly.bindEvent_(
      this.flyout_.svgBackground_, 'mouseover',
      this.flyout_, deselectAll));
}

/**
 * Install this text on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
SparqlBlocks.FieldTable.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Text has already been initialized once.
    return;
  }
  // SparqlBlocks.FieldTable.superClass_.init.call(this, block);

  this.sourceBlock_ = block;

  // Build the DOM.
  var offsetX = - 13;
  var offsetY = - 15;
  this.rootElement_ = Blockly.createSvgElement(
      'g',
      { 'class': 'field_table' }, block.getSvgRoot()); //name, attrs, parent, opt_workspace
  if (!this.visible_) {
    this.rootElement_.style.display = 'none';
  }

  var flyoutRoot = this.flyout_.createDom();
  flyoutRoot.setAttribute('transform', 'translate(' + offsetX + ',' + offsetY + ')');
  this.rootElement_.appendChild(flyoutRoot);

  this.flyout_.targetWorkspace_ = block.workspace;
  var workspace = this.flyout_.workspace_;
  workspace.targetWorkspace = block.workspace;

  var head = this.data_.head;
  if (head) {
    var headVars = this.data_.head.vars;
    if (headVars) {
      var varBlocks = this.varBlocks_ = {};
      headVars.forEach( function(varName) {
        var varBlock =
            SparqlBlocks.JsonToBlocks.blockFromVar(varName, workspace);
        varBlocks[varName] = varBlock;
      });

      this.blockRows_ = [];
      var bindings = this.data_.results && this.data_.results.bindings;
      if (bindings) {
        this.blockRows_ = bindings.map( function(binding, index) {
          var rowCellBlocks = {};
          headVars.forEach( function(varName) {
            var value = binding[varName];
            if (value) {
              var valueBlock =
                  SparqlBlocks.JsonToBlocks.blockFromValue(value, workspace);
              rowCellBlocks[varName] = valueBlock;
            }
          });
          return rowCellBlocks;
        });
      }
    }
  }

};

SparqlBlocks.FieldTable.prototype.render_ = function() {
  var headVars = this.data_.head.vars;
  this.renderCompute_(headVars, this.varBlocks_, this.blockRows_);
  this.setEventBindings_(headVars, this.varBlocks_, this.blockRows_);
};

/**
 * Returns the height and width of the field.
 * @return {!goog.math.Size} Height and width.
 */
SparqlBlocks.FieldTable.prototype.getSize = function() {
  if (!this.size_.width) {
    this.render_();
  }
  return this.size_;
};

SparqlBlocks.FieldTable.prototype.marginX_ = 0;
SparqlBlocks.FieldTable.prototype.marginY_ = 6; //Blockly.BlockSvg.INLINE_PADDING_Y;

SparqlBlocks.FieldTable.prototype.cellSepX_ = 4; //Blockly.BlockSvg.SEP_SPACE_X;
SparqlBlocks.FieldTable.prototype.cellSepY_ = 4; //Blockly.BlockSvg.SEP_SPACE_Y;

SparqlBlocks.FieldTable.prototype.renderCompute_ = function(headVars, headBlocks, blockRows) {
  var fieldTable = this;
  var totalWidth = this.marginX_ * 2;
  var totalHeight = this.marginY_ * 2;
  var maxCellWidth = {};
  var maxCellHeight = [0];
  var cellOffsetX = 0;
  headVars.forEach( function(varName) {
    var varBlock = headBlocks[varName];
    varBlock.render();
    var blockSize = varBlock.getHeightWidth();
    if (blockSize.height > maxCellHeight[0]) {
      maxCellHeight[0] = blockSize.height;
    }
    maxCellWidth[varName] = blockSize.width;
  });
  totalHeight += maxCellHeight[0];

  blockRows.forEach( function(blockRow, rowIndex) {
    maxCellHeight[rowIndex + 1] = 0; // leaves index 0 for the head
    var rowCellBlocks = {};
    headVars.forEach( function(varName) {
      var valueBlock = blockRow[varName];
      if (valueBlock) {
        valueBlock.render();
        var blockSize = valueBlock.getHeightWidth();
        if (blockSize.width > maxCellWidth[varName]) {
          maxCellWidth[varName] = blockSize.width;
        }
        if (blockSize.height > maxCellHeight[rowIndex + 1]) {
          maxCellHeight[rowIndex + 1] = blockSize.height;
        }
      }
    });
    totalHeight += maxCellHeight[rowIndex + 1] + fieldTable.cellSepY_;
  });

  headVars.forEach( function(varName, colIndex) {
    totalWidth += maxCellWidth[varName] + (colIndex > 0 ? fieldTable.cellSepX_ : 0);
  });

  this.width_ = totalWidth;
  this.height_ = totalHeight;
  this.size_ = new goog.math.Size(this.width_, this.height_);
  this.position_(headVars, headBlocks, blockRows, maxCellWidth, maxCellHeight);
}

SparqlBlocks.FieldTable.prototype.positionBlock_ = function(block, x, y) {
  block.moveBy(Blockly.BlockSvg.TAB_HEIGHT + x, y);
}

SparqlBlocks.FieldTable.prototype.position_ = function( colNames,
                                                        headBlocks, blockRows,
                                                        maxCellWidth, maxCellHeight) {
  var offsetX = this.marginX_;
  var offsetY = this.marginY_;
  var fieldTable = this;
  colNames.forEach( function(colName, colIndex) {
    var block = headBlocks[colName];
    fieldTable.positionBlock_(block, offsetX, offsetY);
    offsetX += maxCellWidth[colName] + fieldTable.cellSepX_;
  });
  blockRows.forEach( function(blockRow, rowIndex) {
    var offsetX = fieldTable.marginX_;
    offsetY += maxCellHeight[rowIndex] + fieldTable.cellSepY_;
    colNames.forEach( function(colName, colIndex) {
      var block = blockRow[colName];
      fieldTable.positionBlock_(block, offsetX, offsetY);
      offsetX += maxCellWidth[colName] + fieldTable.cellSepX_;
    });
  });
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
SparqlBlocks.FieldTable.prototype.dispose = function() {
  this.flyout_.dispose();
  goog.dom.removeNode(this.rootElement_);
  this.rootElement_ = null;
};

/**
 * Gets the group element for this field.
 * Used for measuring the size and for positioning.
 * @return {!Element} The flyout element.
 */
SparqlBlocks.FieldTable.prototype.getSvgRoot = function() {
  return /** @type {!Element} */ (this.rootElement_);
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
SparqlBlocks.FieldTable.prototype.setTooltip = function(newTip) {
  this.rootElement_.tooltip = newTip;
};
