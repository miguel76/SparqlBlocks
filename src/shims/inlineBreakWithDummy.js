/**
 * @fileoverview Shim on Blockly to permit breaking inline blocks using dummy inputs
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
 * Computes the height and widths for each row and field.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
 *     position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function(iconWidth) {
  var inputList = this.inputList;
  var inputRows = [];
  inputRows.rightEdge = iconWidth + Blockly.BlockSvg.SEP_SPACE_X * 2;
  if (this.previousConnection || this.nextConnection) {
    inputRows.rightEdge = Math.max(inputRows.rightEdge,
        Blockly.BlockSvg.NOTCH_WIDTH + Blockly.BlockSvg.SEP_SPACE_X);
  }
  var fieldValueWidth = 0;  // Width of longest external value field.
  var fieldStatementWidth = 0;  // Width of longest statement field.
  var hasValue = false;
  var hasStatement = false;
  var hasDummy = false;
  var lastType = undefined;
  var isInline = this.getInputsInline() && !this.isCollapsed();
  for (var i = 0, input; input = inputList[i]; i++) {
    if (!input.isVisible()) {
      continue;
    }
    var row;
    if (!isInline || !lastType ||
        lastType == Blockly.NEXT_STATEMENT ||
        input.type == Blockly.NEXT_STATEMENT ||
        lastType == Blockly.DUMMY_INPUT) {
      // Create new row.
      row = [];
      if (isInline && input.type != Blockly.NEXT_STATEMENT) {
        row.type = Blockly.BlockSvg.INLINE;
      } else {
        row.type = input.type;
      }
      row.height = 0;
      inputRows.push(row);
    } else {
      row = inputRows[inputRows.length - 1];
    }
    lastType = input.type;
    row.push(input);

    // Compute minimum input size.
    input.renderHeight = Blockly.BlockSvg.MIN_BLOCK_Y;
    // The width is currently only needed for inline value inputs.
    if (isInline && input.type == Blockly.INPUT_VALUE) {
      input.renderWidth = Blockly.BlockSvg.TAB_WIDTH +
          Blockly.BlockSvg.SEP_SPACE_X * 1.25;
    } else {
      input.renderWidth = 0;
    }
    // Expand input size if there is a connection.
    if (input.connection && input.connection.isConnected()) {
      var linkedBlock = input.connection.targetBlock();
      var bBox = linkedBlock.getHeightWidth();
      input.renderHeight = Math.max(input.renderHeight, bBox.height);
      input.renderWidth = Math.max(input.renderWidth, bBox.width);
    }
    // Blocks have a one pixel shadow that should sometimes overhang.
    if (!isInline && i == inputList.length - 1) {
      // Last value input should overhang.
      input.renderHeight--;
    } else if (!isInline && input.type == Blockly.INPUT_VALUE &&
        inputList[i + 1] && inputList[i + 1].type == Blockly.NEXT_STATEMENT) {
      // Value input above statement input should overhang.
      input.renderHeight--;
    }

    row.height = Math.max(row.height, input.renderHeight);
    input.fieldWidth = 0;
    if (inputRows.length == 1) {
      // The first row gets shifted to accommodate any icons.
      input.fieldWidth += this.RTL ? -iconWidth : iconWidth;
    }
    var previousFieldEditable = false;
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      if (j != 0) {
        input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
      }
      // Get the dimensions of the field.
      var fieldSize = field.getSize();
      field.renderWidth = fieldSize.width;
      field.renderSep = (previousFieldEditable && field.EDITABLE) ?
          Blockly.BlockSvg.SEP_SPACE_X : 0;
      input.fieldWidth += field.renderWidth + field.renderSep;
      row.height = Math.max(row.height, fieldSize.height);
      previousFieldEditable = field.EDITABLE;
    }

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        hasStatement = true;
        fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    }
  }

  // Make inline rows a bit thicker in order to enclose the values.
  for (var y = 0, row; row = inputRows[y]; y++) {
    row.thicker = false;
    if (row.type == Blockly.BlockSvg.INLINE) {
      for (var z = 0, input; input = row[z]; z++) {
        if (input.type == Blockly.INPUT_VALUE) {
          row.height += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
          row.thicker = true;
          break;
        }
      }
    }
  }

  // Compute the statement edge.
  // This is the width of a block where statements are nested.
  inputRows.statementEdge = 2 * Blockly.BlockSvg.SEP_SPACE_X +
      fieldStatementWidth;
  // Compute the preferred right edge.  Inline blocks may extend beyond.
  // This is the width of the block where external inputs connect.
  if (hasStatement) {
    inputRows.rightEdge = Math.max(inputRows.rightEdge,
        inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH);
  }
  if (hasValue) {
    inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
        Blockly.BlockSvg.SEP_SPACE_X * 2 + Blockly.BlockSvg.TAB_WIDTH);
  } else if (hasDummy) {
    inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
        Blockly.BlockSvg.SEP_SPACE_X * 2);
  }

  inputRows.hasValue = hasValue;
  inputRows.hasStatement = hasStatement;
  inputRows.hasDummy = hasDummy;
  return inputRows;
};
