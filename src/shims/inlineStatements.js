/**
 * @fileoverview Shim on Blockly to permit statement connections on the same line with value connections
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
  inputRows.statementEdge = 0;
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
        lastType == Blockly.DUMMY_INPUT) {
      // Create new row.
      row = [];
      if (isInline /*&& input.type != Blockly.NEXT_STATEMENT*/) {
        row.type = Blockly.BlockSvg.INLINE;
      } else {
        row.type = input.type;
      }
      row.height = 0;
      row.width = 0;
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

    row.width += input.fieldWidth + Blockly.BlockSvg.SEP_SPACE_X;

    if (input.type == Blockly.NEXT_STATEMENT) {
      hasStatement = true;
      row.hasStatement = true;
      // fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth + input.renderWidth);
      row.width += 2 * Blockly.BlockSvg.SEP_SPACE_X;
      inputRows.statementEdge =
          Math.max(
              inputRows.statementEdge,
              row.width + 2 * Blockly.BlockSvg.SEP_SPACE_X);
      inputRows.rightEdge =
          Math.max(
            inputRows.rightEdge,
              row.width +
              2 * Blockly.BlockSvg.SEP_SPACE_X - Blockly.BlockSvg.TAB_WIDTH +
              Blockly.BlockSvg.NOTCH_WIDTH +
              (row.type == Blockly.BlockSvg.INLINE && row.hasValue ?
                  Blockly.BlockSvg.TAB_WIDTH - (Blockly.BlockSvg.SEP_SPACE_X /** 1.25*/ + Blockly.BlockSvg.NOTCH_WIDTH)/** 1.25 + Blockly.BlockSvg.TAB_WIDTH*/ :
                  0));
    } else {
      // if (row.type == Blockly.BlockSvg.INLINE) {
        row.width += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X * 1.25 + Blockly.BlockSvg.TAB_WIDTH;
      // }
      inputRows.rightEdge =
          Math.max(
              inputRows.rightEdge,
              row.width + Blockly.BlockSvg.SEP_SPACE_X * 2 +
              (input.type == Blockly.DUMMY_INPUT) ? 0 : Blockly.BlockSvg.TAB_WIDTH);
    }

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        // hasStatement = true;
        // fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
        if (input.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        }
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    } else if (input.type == Blockly.INPUT_VALUE) {
      row.hasValue = true;
    }
  }

  // Make inline rows a bit thicker in order to enclose the values.
  for (var y = 0, row; row = inputRows[y]; y++) {
    row.thicker = false;
    if (row.type == Blockly.BlockSvg.INLINE && !row.hasStatement) {
      for (var z = 0, input; input = row[z]; z++) {
        if (input.type == Blockly.INPUT_VALUE) {
          row.height += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
          row.thicker = true;
          break;
        }
      }
    }
  }

  // // Compute the statement edge.
  // // This is the width of a block where statements are nested.
  // inputRows.statementEdge = Math.max(inputRows.statementEdge, 2 * Blockly.BlockSvg.SEP_SPACE_X);
  //
  // // Compute the preferred right edge.  Inline blocks may extend beyond.
  // // This is the width of the block where external inputs connect.
  // if (hasStatement) {
  //   inputRows.rightEdge = Math.max(inputRows.rightEdge,
  //       inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH /*+ fieldValueWidth +
  //           Blockly.BlockSvg.SEP_SPACE_X * 2 + Blockly.BlockSvg.TAB_WIDTH*/);
  // }
  // if (!hasStatement) {
    if (hasValue) {
      inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
          Blockly.BlockSvg.SEP_SPACE_X * 2 + Blockly.BlockSvg.TAB_WIDTH);
      } else if (hasDummy) {
      inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
          Blockly.BlockSvg.SEP_SPACE_X * 2);
      }
  // }

  inputRows.hasValue = hasValue;
  inputRows.hasStatement = hasStatement;
  inputRows.hasDummy = hasDummy;
  return inputRows;
};

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {!Array.<string>} inlineSteps Inline block outlines.
 * @param {!Array.<string>} highlightInlineSteps Inline block highlights.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps, highlightSteps,
    inlineSteps, highlightInlineSteps, inputRows, iconWidth) {
  var cursorX;
  var cursorY = 0;
  var connectionX, connectionY;
  for (var y = 0, row; row = inputRows[y]; y++) {
    cursorX = Blockly.BlockSvg.SEP_SPACE_X;
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }
    highlightSteps.push('M', (inputRows.rightEdge - 0.5) + ',' +
        (cursorY + 0.5));
    if (this.isCollapsed()) {
      // Jagged right edge.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      steps.push(Blockly.BlockSvg.JAGGED_TEETH);
      highlightSteps.push('h 8');
      var remainder = row.height - Blockly.BlockSvg.JAGGED_TEETH_HEIGHT;
      steps.push('v', remainder);
      if (this.RTL) {
        highlightSteps.push('v 3.9 l 7.2,3.4 m -14.5,8.9 l 7.3,3.5');
        highlightSteps.push('v', remainder - 0.7);
      }
      this.width += Blockly.BlockSvg.JAGGED_TEETH_WIDTH;
    } else if (row.type == Blockly.BlockSvg.INLINE) {
      if (row.hasStatement && y == 0) {
        // If the first input is a statement stack, add a small row on top.
        steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
        if (this.RTL) {
          highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1);
        }
        cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
      }
      // Inline inputs.
      for (var x = 0, input; input = row[x]; x++) {
        var fieldX = cursorX;
        var fieldY = cursorY;
        if (row.thicker) {
          // Lower the field slightly.
          fieldY += Blockly.BlockSvg.INLINE_PADDING_Y;
        }
        // TODO: Align inline field rows (left/right/centre).
        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type != Blockly.DUMMY_INPUT) {
          cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
        }
        if (input.type == Blockly.INPUT_VALUE) {
          inlineSteps.push('M', (cursorX - Blockly.BlockSvg.SEP_SPACE_X) +
                           ',' + (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y));
          inlineSteps.push('h', Blockly.BlockSvg.TAB_WIDTH - 2 -
                           input.renderWidth);
          inlineSteps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
          inlineSteps.push('v', input.renderHeight + 1 -
                                Blockly.BlockSvg.TAB_HEIGHT);
          inlineSteps.push('h', input.renderWidth + 2 -
                           Blockly.BlockSvg.TAB_WIDTH);
          inlineSteps.push('z');
          if (this.RTL) {
            // Highlight right edge, around back of tab, and bottom.
            highlightInlineSteps.push('M',
                (cursorX - Blockly.BlockSvg.SEP_SPACE_X - 2.5 +
                 Blockly.BlockSvg.TAB_WIDTH - input.renderWidth) + ',' +
                (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 0.5));
            highlightInlineSteps.push(
                Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL);
            highlightInlineSteps.push('v',
                input.renderHeight - Blockly.BlockSvg.TAB_HEIGHT + 2.5);
            highlightInlineSteps.push('h',
                input.renderWidth - Blockly.BlockSvg.TAB_WIDTH + 2);
          } else {
            // Highlight right edge, bottom.
            highlightInlineSteps.push('M',
                (cursorX - Blockly.BlockSvg.SEP_SPACE_X + 0.5) + ',' +
                (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 0.5));
            highlightInlineSteps.push('v', input.renderHeight + 1);
            highlightInlineSteps.push('h', Blockly.BlockSvg.TAB_WIDTH - 2 -
                                           input.renderWidth);
            // Short highlight glint at bottom of tab.
            highlightInlineSteps.push('M',
                (cursorX - input.renderWidth - Blockly.BlockSvg.SEP_SPACE_X +
                 0.9) + ',' + (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y +
                 Blockly.BlockSvg.TAB_HEIGHT - 0.7));
            highlightInlineSteps.push('l',
                (Blockly.BlockSvg.TAB_WIDTH * 0.46) + ',-2.1');
          }
          // Create inline input connection.
          if (this.RTL) {
            connectionX = -cursorX -
                Blockly.BlockSvg.TAB_WIDTH + Blockly.BlockSvg.SEP_SPACE_X +
                input.renderWidth + 1;
          } else {
            connectionX = cursorX +
                Blockly.BlockSvg.TAB_WIDTH - Blockly.BlockSvg.SEP_SPACE_X -
                input.renderWidth - 1;
          }
          connectionY = cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 1;
          input.connection.setOffsetInBlock(connectionX, connectionY);
        } else if (input.type == Blockly.NEXT_STATEMENT) {
          // // Nested statement.
          // // var input = row[0];
          // var fieldX = cursorX;
          // var fieldY = cursorY;
          // if (input.align != Blockly.ALIGN_LEFT) {
          //   var fieldRightX = inputRows.statementEdge - input.fieldWidth -
          //       2 * Blockly.BlockSvg.SEP_SPACE_X;
          //   if (input.align == Blockly.ALIGN_RIGHT) {
          //     fieldX += fieldRightX;
          //   } else if (input.align == Blockly.ALIGN_CENTRE) {
          //     fieldX += fieldRightX / 2;
          //   }
          // }
          // this.renderFields_(input.fieldRow, fieldX, fieldY);
          // cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;
          cursorX += 2 * Blockly.BlockSvg.SEP_SPACE_X - input.renderWidth;
          steps.push('H', cursorX);
          steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
          steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
          steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
          steps.push('H', inputRows.rightEdge);
          if (this.RTL) {
            highlightSteps.push('M',
                (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
                 Blockly.BlockSvg.DISTANCE_45_OUTSIDE) +
                ',' + (cursorY + Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
            highlightSteps.push(
                Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL);
            highlightSteps.push('v',
                row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
            highlightSteps.push(
                Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL);
            highlightSteps.push('H', inputRows.rightEdge - 0.5);
          } else {
            highlightSteps.push('M',
                (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
                 Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
                (cursorY + row.height - Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
            highlightSteps.push(
                Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR);
            highlightSteps.push('H', inputRows.rightEdge - 0.5);
          }
          // Create statement connection.
          connectionX = this.RTL ? -cursorX : cursorX + 1;
          input.connection.setOffsetInBlock(connectionX, cursorY + 1);

          if (input.connection.isConnected()) {
            // this.width = Math.max(this.width, inputRows.statementEdge +
            //     input.connection.targetBlock().getHeightWidth().width);
            this.width = Math.max(
                this.width,
                cursorX - 2.5 * Blockly.BlockSvg.SEP_SPACE_X +
                  input.connection.targetBlock().getHeightWidth().width);
          }
          if (y == inputRows.length - 1 ||
              inputRows[y + 1].type == Blockly.NEXT_STATEMENT) {
            // If the final input is a statement stack, add a small row underneath.
            // Consecutive statement stacks are also separated by a small divider.
            steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
            if (this.RTL) {
              highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1);
            }
            cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
          }
        }
      }

      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      if (!row.hasStatement) {
        steps.push('H', cursorX);
        highlightSteps.push('H', cursorX - 0.5);
        steps.push('v', row.height);
        if (this.RTL) {
          highlightSteps.push('v', row.height - 1);
        }
      }
    } else if (row.type == Blockly.INPUT_VALUE) {
      // External input.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.rightEdge - input.fieldWidth -
            Blockly.BlockSvg.TAB_WIDTH - 2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      steps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
      var v = row.height - Blockly.BlockSvg.TAB_HEIGHT;
      steps.push('v', v);
      if (this.RTL) {
        // Highlight around back of tab.
        highlightSteps.push(Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL);
        highlightSteps.push('v', v + 0.5);
      } else {
        // Short highlight glint at bottom of tab.
        highlightSteps.push('M', (inputRows.rightEdge - 5) + ',' +
            (cursorY + Blockly.BlockSvg.TAB_HEIGHT - 0.7));
        highlightSteps.push('l', (Blockly.BlockSvg.TAB_WIDTH * 0.46) +
            ',-2.1');
      }
      // Create external input connection.
      connectionX = this.RTL ? -inputRows.rightEdge - 1 :
          inputRows.rightEdge + 1;
      input.connection.setOffsetInBlock(connectionX, cursorY);
      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.rightEdge +
            input.connection.targetBlock().getHeightWidth().width -
            Blockly.BlockSvg.TAB_WIDTH + 1);
      }
    } else if (row.type == Blockly.DUMMY_INPUT) {
      // External naked field.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.rightEdge - input.fieldWidth -
            2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (inputRows.hasValue) {
          fieldRightX -= Blockly.BlockSvg.TAB_WIDTH;
        }
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      steps.push('v', row.height);
      if (this.RTL) {
        highlightSteps.push('v', row.height - 1);
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // Nested statement.
      var input = row[0];
      if (y == 0) {
        // If the first input is a statement stack, add a small row on top.
        steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
        if (this.RTL) {
          highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1);
        }
        cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
      }
      var fieldX = cursorX;
      var fieldY = cursorY;
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.statementEdge - input.fieldWidth -
            2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;
      steps.push('H', cursorX);
      steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
      steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
      steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
      steps.push('H', inputRows.rightEdge);
      if (this.RTL) {
        highlightSteps.push('M',
            (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
             Blockly.BlockSvg.DISTANCE_45_OUTSIDE) +
            ',' + (cursorY + Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
        highlightSteps.push(
            Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL);
        highlightSteps.push('v',
            row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
        highlightSteps.push(
            Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL);
        highlightSteps.push('H', inputRows.rightEdge - 0.5);
      } else {
        highlightSteps.push('M',
            (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
             Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
            (cursorY + row.height - Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
        highlightSteps.push(
            Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR);
        highlightSteps.push('H', inputRows.rightEdge - 0.5);
      }
      // Create statement connection.
      connectionX = this.RTL ? -cursorX : cursorX + 1;
      input.connection.setOffsetInBlock(connectionX, cursorY + 1);

      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.statementEdge +
            input.connection.targetBlock().getHeightWidth().width);
      }
      if (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
        if (this.RTL) {
          highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1);
        }
        cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
      }
    }
    cursorY += row.height;
  }
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push('V', cursorY);
    if (this.RTL) {
      highlightSteps.push('V', cursorY - 1);
    }
  }
  return cursorY;
};
