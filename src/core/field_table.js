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

var Blockly = require('blockly');
var JsonToBlocks = require('./jsonToBlocks.js');

/**
 * Class for a tabular field.
 * @param {string} data The initial content of the field.
 * @param {Object} opt_extraColumns An optional set of variables to add
 *    (varNames: Array of strings, mappings: dictionary from varname to funct binding -> cellBlock)
 * @param {boolean} hideHeaders True to hide headers
 * @extends {FieldTable}
 * @constructor
 */
var FieldTable = function(data, opt_extraColumns, hideHeaders) {
  FieldTable.constructor.call(this, '');
  // Set the initial state.
  // this.setValue(json);
  this.width_ = 0;
  this.height_ = 0;
  this.size_ = { width: this.width_, height: this.height_ };
  this.data_ = data;
  this.extraColumns_ = opt_extraColumns ? opt_extraColumns : {
    varNames: [],
    mappings: {}
  };
  this.showHeaders = !hideHeaders;
};
FieldTable.prototype = Object.create(Blockly.Field.prototype);
FieldTable.prototype.constructor = FieldTable;

FieldTable.NO_PATTERN = 0;
FieldTable.CLASS_PATTERN = 1;
FieldTable.PROPERTY_PATTERN = 2;

FieldTable.PATTERN_LABEL = 'pattern';

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
FieldTable.prototype.EDITABLE = false;

FieldTable.prototype.setEventBindingsForBlock_ = function(block) {
  if (block) {
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
        this.createBlockFunc_(block)));
    lstnrs.push(Blockly.bindEvent_(rect, 'mouseover', block,
        block.addSelect));
    lstnrs.push(Blockly.bindEvent_(rect, 'mouseout', block,
        block.removeSelect));
  }
};

FieldTable.prototype.setEventBindings_ = function(colNames, headBlocks, blockRows) {
  var parent = this;
  if (this.showHeaders) {
    colNames.forEach( function(colName) {
      var block = headBlocks[colName];
      parent.setEventBindingsForBlock_(block);
    });
  }
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
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      blocks[blockIndex].removeSelect();
    }
  };
  this.flyout_.listeners_.push(Blockly.bindEvent_(
      this.flyout_.svgBackground_, 'mouseover',
      this.flyout_, deselectAll));
};

/**
 * Install this text on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
FieldTable.prototype.init = function() {
  if (this.rootElement_) {
    // Text has already been initialized once.
    return;
  }
  // FieldTable.superClass_.init.call(this, block);

  var block = this.sourceBlock_;

  this.flyout_ = new Blockly.Flyout({parentWorkspace: block.workspace});
  // this.flyout_.init(block.workspace);
  this.flyout_.scrollbar_ = {
    isVisible: function () {
      return false;
    },
    dispose: function() {}
  };
  this.flyout_.autoClose = false;
  var thisFieldTable = this;
  this.flyout_.createBlockFunc_ = function(block) {
    return FieldTable.prototype.createBlockFunc_.call(thisFieldTable, block);
  };

  // Build the DOM.
  this.rootElement_ = Blockly.createSvgElement(
      'g',
      { 'class': 'field_table' }, block.getSvgRoot()); //name, attrs, parent, opt_workspace
  if (!this.visible_) {
    this.rootElement_.style.display = 'none';
  }

  var flyoutRoot = this.flyout_.createDom();
  flyoutRoot.setAttribute(
      'transform',
      'translate(' + FieldTable.translateX_ + ',' + FieldTable.translateY_ + ')');
  this.rootElement_.appendChild(flyoutRoot);

  this.flyout_.targetWorkspace_ = block.workspace;
  var workspace = this.flyout_.workspace_;
  workspace.targetWorkspace = block.workspace;

  var extraColumns = this.extraColumns_;

  var head = this.data_.head;
  if (head) {
    var headVars = this.data_.head.vars;
    if (headVars) {
      for (var i = 0; i < extraColumns.varNames.length; i++) {
        headVars.push(extraColumns.varNames[i]);
      }
      var varBlocks = this.varBlocks_ = {};
      if (this.showHeaders) {
        headVars.forEach( function(varName) {
          var varBlock = JsonToBlocks.blockFromVar(varName, workspace);
          varBlocks[varName] = varBlock;
        });
      }

      this.blockRows_ = [];
      var bindings = this.data_.results && this.data_.results.bindings;
      if (bindings) {
        this.blockRows_ = bindings.map( function(binding, index) {
          var rowCellBlocks = {};
          headVars.forEach( function(varName) {
            var mapping = extraColumns.mappings[varName];
            if (mapping) {
              var cellBlock = mapping(binding, workspace);
              if (cellBlock) {
                rowCellBlocks[varName] = cellBlock;
              }
            } else {
              var value = binding[varName];
              if (value) {
                var valueBlock = JsonToBlocks.blockFromValue(value, workspace);
                rowCellBlocks[varName] = valueBlock;
              }
            }
          });
          return rowCellBlocks;
        });
      }
    }
  }

};

FieldTable.prototype.render_ = function() {
  var headVars = this.data_.head.vars;
  this.renderCompute_(headVars, this.varBlocks_, this.blockRows_);
  this.setEventBindings_(headVars, this.varBlocks_, this.blockRows_);
};

/**
 * Returns the height and width of the field.
 * @return {!goog.math.Size} Height and width.
 */
FieldTable.prototype.getSize = function() {
  if (!this.size_.width) {
    this.render_();
  }
  return this.size_;
};

FieldTable.translateX_ = -13;
FieldTable.translateY_ = -4; //Blockly.BlockSvg.INLINE_PADDING_Y;

FieldTable.prototype.marginX_ = 0;
FieldTable.prototype.marginY_ = 6; //Blockly.BlockSvg.INLINE_PADDING_Y;

FieldTable.prototype.cellSepX_ = 4; //Blockly.BlockSvg.SEP_SPACE_X;
FieldTable.prototype.cellSepY_ = 4; //Blockly.BlockSvg.SEP_SPACE_Y;

FieldTable.prototype.renderCompute_ = function(headVars, headBlocks, blockRows) {
  var fieldTable = this;
  var totalWidth = this.marginX_ * 2;
  var totalHeight = this.marginY_ * 2;
  var maxCellWidth = {};
  var maxCellHeight = [0];
  var cellOffsetX = 0;
  headVars.forEach( function(varName) {
    maxCellWidth[varName] = 0;
  });
  if (this.showHeaders) {
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
  }

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
  this.size_ = { width: this.width_, height: this.height_ };
  this.position_(headVars, headBlocks, blockRows, maxCellWidth, maxCellHeight);
};

FieldTable.prototype.positionBlock_ = function(block, x, y) {
  if (block) {
    block.moveBy(Blockly.BlockSvg.TAB_HEIGHT + x, y);
  }
};

FieldTable.prototype.position_ = function( colNames,
                                                        headBlocks, blockRows,
                                                        maxCellWidth, maxCellHeight) {
  var offsetX = this.marginX_;
  var offsetY = this.marginY_;
  var fieldTable = this;
  if (this.showHeaders) {
    colNames.forEach( function(colName, colIndex) {
      var block = headBlocks[colName];
      fieldTable.positionBlock_(block, offsetX, offsetY);
      offsetX += maxCellWidth[colName] + fieldTable.cellSepX_;
    });
  }
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
FieldTable.prototype.dispose = function() {
  this.flyout_.dispose();
  this.rootElement_.parentNode.removeChild(this.rootElement_);
  this.rootElement_ = null;
};

/**
 * Gets the group element for this field.
 * Used for measuring the size and for positioning.
 * @return {!Element} The flyout element.
 */
FieldTable.prototype.getSvgRoot = function() {
  return /** @type {!Element} */ (this.rootElement_);
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
FieldTable.prototype.setTooltip = function(newTip) {
  this.rootElement_.tooltip = newTip;
};

/**
 * Create a copy of this block on the workspace.
 * @param {!Blockly.Block} originBlock The flyout block to copy.
 * @return {!Function} Function to call when block is clicked.
 * @private
 */
FieldTable.prototype.createBlockFunc_ = function(originBlock) {
  var sourceBlock = this.sourceBlock_;
  var svgRoot = this.getSvgRoot();
  var flyout = this.flyout_;
  var workspace = this.flyout_.targetWorkspace_;
  return function(e) {
    if (Blockly.isRightButton(e)) {
      // Right-click.  Don't create a block, let the context menu show.
      return;
    }
    if (originBlock.disabled) {
      // Beyond capacity.
      return;
    }
    Blockly.Events.disable();
    // Create the new block by cloning the block in the flyout (via XML).
    var xml = Blockly.Xml.blockToDom(originBlock);
    var block = Blockly.Xml.domToBlock(xml, workspace);
    block.setEditable(true);
    block.setCollapsed(false);
    // Place it in the same spot as the flyout copy.
    var svgRootOld = originBlock.getSvgRoot();
    if (!svgRootOld) {
      throw 'originBlock is not rendered.';
    }

    var sourceXY = sourceBlock.getRelativeToSurfaceXY();
    var fieldRelativeXY = Blockly.getRelativeXY_(svgRoot);
    var originBlockXY = originBlock.getRelativeToSurfaceXY();
    block.moveBy(
        originBlockXY.x + sourceXY.x + fieldRelativeXY.x + FieldTable.translateX_,
        originBlockXY.y + sourceXY.y + fieldRelativeXY.y + FieldTable.translateY_);
    Blockly.Events.enable();
    if (Blockly.Events.isEnabled()) {
      Blockly.Events.setGroup(true);
      Blockly.Events.fire(new Blockly.Events.Create(block));
    }
    if (flyout.autoClose) {
      flyout.hide();
    } else {
      flyout.filterForCapacity_();
    }
    // Start a dragging operation on the new block.
    block.onMouseDown_(e);
    Blockly.dragMode_ = Blockly.DRAG_FREE;
    block.setDragging_(true);
  };
};

module.exports = FieldTable;
