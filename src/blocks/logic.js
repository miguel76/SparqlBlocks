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
 * @fileoverview SPARQL Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;
var typeContentExt = function(typeStr) {
  return typeExt(typeStr == "Var" ? "Expr" : typeStr);
};

var HUE = 210;

Blocks.block('sparql_logic_compare', {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var rtlOperators = [
      ['=', 'EQ'],
      ['\u2260', 'NEQ'],
      ['\u200F<\u200F', 'LT'],
      ['\u200F\u2264\u200F', 'LTE'],
      ['\u200F>\u200F', 'GT'],
      ['\u200F\u2265\u200F', 'GTE']
    ];
    var ltrOperators = [
      ['=', 'EQ'],
      ['\u2260', 'NEQ'],
      ['<', 'LT'],
      ['\u2264', 'LTE'],
      ['>', 'GT'],
      ['\u2265', 'GTE']
    ];
    var OPERATORS = this.RTL ? rtlOperators : ltrOperators;
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'BooleanExpr');
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  }
});

Blocks.block('sparql_logic_operation', {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
         [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
    this.setHelpUrl(Blockly.Msg.LOGIC_OPERATION_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'BooleanExpr');
    this.appendValueInput('A')
        .setCheck(typeExt('BooleanExpr'));
    this.appendValueInput('B')
        .setCheck(typeExt('BooleanExpr'))
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return TOOLTIPS[op];
    });
  }
});

Blocks.block('sparql_logic_negate', {
  /**
   * Block for negation.
   * @this Blockly.Block
   */
  init: function() {

    this.jsonInit({
      "message0": Blockly.Msg.LOGIC_NEGATE_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "BOOL",
          "check": typeExt('BooleanExpr')
        }
      ],
      "output": "BooleanExpr",
      "colour": HUE,
      "tooltip": Blockly.Msg.LOGIC_NEGATE_TOOLTIP,
      "helpUrl": Blockly.Msg.LOGIC_NEGATE_HELPURL
    });
  }
});

Blocks.block('sparql_logic_boolean', {
  /**
   * Block for boolean data type: true and false.
   * @this Blockly.Block
   */
  init: function() {
    var BOOLEANS =
        [[Blockly.Msg.LOGIC_BOOLEAN_TRUE, 'TRUE'],
         [Blockly.Msg.LOGIC_BOOLEAN_FALSE, 'FALSE']];
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'LiteralBoolean');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
});

Blocks.block('sparql_logic_null', {
  /**
   * Block for null data type.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_NULL_HELPURL);
    this.setColour(HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LOGIC_NULL);
    this.setTooltip(Blockly.Msg.LOGIC_NULL_TOOLTIP);
  }
});

Blocks.block('sparql_logic_ternary', {
  /**
   * Block for ternary operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LOGIC_TERNARY_HELPURL);
    this.setColour(HUE);
    this.appendValueInput('IF')
        .setCheck(typeExt('BooleanExpr'))
        .appendField(Blockly.Msg.LOGIC_TERNARY_CONDITION);
    this.appendValueInput('THEN')
        .appendField(Blockly.Msg.LOGIC_TERNARY_IF_TRUE);
    this.appendValueInput('ELSE')
        .appendField(Blockly.Msg.LOGIC_TERNARY_IF_FALSE);
    this.setOutput(true,'Expr');
    this.setTooltip(Blockly.Msg.LOGIC_TERNARY_TOOLTIP);
    this.prevParentConnection_ = null;
  }
});

Blocks.block('sparql_exists', {
  /**
   * Block for EXISTS.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#neg-exists');
    this.setColour(HUE);
    this.setOutput(true,'BooleanExpr');
    this.appendStatementInput("OP")
        .setCheck("TriplesBlock")
        .appendField("exists");
    this.setInputsInline(true);
    this.setTooltip(Msg.EXISTS_TOOLTIP);
  }
});

Blocks.block('sparql_not_exists', {
  /**
   * Block for NOT EXISTS.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#neg-notexists');
    this.setColour(HUE);
    this.setOutput(true,'BooleanExpr');
    this.appendStatementInput("OP")
        .setCheck("TriplesBlock")
        .appendField("not exists");
    this.setInputsInline(true);
    this.setTooltip(Msg.NOT_EXISTS_TOOLTIP);
  }
});
