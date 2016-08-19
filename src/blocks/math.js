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
 * @fileoverview SPARQL Math blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;

var HUE = 230;

Blocks.block('sparql_math_number', {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'NUM');
    this.setOutput(true, 'LiteralNumber');
    this.setTooltip(Msg.MATH_NUMBER_TOOLTIP);
  }
});

Blocks.block('sparql_math_arithmetic', {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
         [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
         [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
         [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE']];
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'NumberExpr');
    this.appendValueInput('A')
        .setCheck(typeExt('NumberExpr'));
    this.appendValueInput('B')
        .setCheck(typeExt('NumberExpr'))
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE
      };
      return TOOLTIPS[mode];
    });
  }
});

Blocks.block('sparql_math_single', {
  /**
   * Block for advanced math operators with single operand.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
         ['-', 'NEG']];
    this.setHelpUrl(Blockly.Msg.MATH_SINGLE_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'NumberExpr');
    this.appendValueInput('NUM')
     .setCheck(typeExt('NumberExpr'))
     .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ABS': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
        'NEG': Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG
      };
      return TOOLTIPS[mode];
    });
  }
});

Blocks.block('sparql_math_number_property', {
  /**
   * Block for checking if a number is even, odd, prime, whole, positive,
   * negative or if it is divisible by certain number.
   * @this Blockly.Block
   */
  init: function() {
    var PROPERTIES =
        [[Blockly.Msg.MATH_IS_EVEN, 'EVEN'],
         [Blockly.Msg.MATH_IS_ODD, 'ODD'],
         [Blockly.Msg.MATH_IS_PRIME, 'PRIME'],
         [Blockly.Msg.MATH_IS_WHOLE, 'WHOLE'],
         [Blockly.Msg.MATH_IS_POSITIVE, 'POSITIVE'],
         [Blockly.Msg.MATH_IS_NEGATIVE, 'NEGATIVE'],
         [Blockly.Msg.MATH_IS_DIVISIBLE_BY, 'DIVISIBLE_BY']];
    this.setColour(HUE);
    this.appendValueInput('NUMBER_TO_CHECK')
        .setCheck(typeExt('NumberExpr'));
    var dropdown = new Blockly.FieldDropdown(PROPERTIES, function(option) {
      var divisorInput = (option == 'DIVISIBLE_BY');
      this.sourceBlock_.updateShape_(divisorInput);
    });
    this.appendDummyInput()
        .appendField(dropdown, 'PROPERTY');
    this.setInputsInline(true);
    this.setOutput(true, 'BooleanExpr');
    this.setTooltip(Blockly.Msg.MATH_IS_TOOLTIP);
  },
  /**
   * Create XML to represent whether the 'divisorInput' should be present.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var divisorInput = (this.getFieldValue('PROPERTY') == 'DIVISIBLE_BY');
    container.setAttribute('divisor_input', divisorInput);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
    this.updateShape_(divisorInput);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} divisorInput True if this block has a divisor input.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function(divisorInput) {
    // Add or remove a Value Input.
    var inputExists = this.getInput('DIVISOR');
    if (divisorInput) {
      if (!inputExists) {
        this.appendValueInput('DIVISOR')
            .setCheck(typeExt('NumberExpr'));
      }
    } else if (inputExists) {
      this.removeInput('DIVISOR');
    }
  }
});

Blocks.block('sparql_math_round', {
  /**
   * Block for rounding functions.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
         [Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP, 'ROUNDUP'],
         [Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN, 'ROUNDDOWN']];
    this.setHelpUrl(Blockly.Msg.MATH_ROUND_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'NumberExpr');
    this.appendValueInput('NUM')
        .setCheck(typeExt('NumberExpr'))
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setTooltip(Blockly.Msg.MATH_ROUND_TOOLTIP);
  }
});

Blocks.block('sparql_math_modulo', {
  /**
   * Block for remainder of a division.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.MATH_MODULO_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "DIVIDEND",
          "check": typeExt('NumberExpr')
        },
        {
          "type": "input_value",
          "name": "DIVISOR",
          "check": typeExt('NumberExpr')
        }
      ],
      "inputsInline": true,
      "output": "NumberExpr",
      "colour": HUE,
      "tooltip": Blockly.Msg.MATH_MODULO_TOOLTIP,
      "helpUrl": Blockly.Msg.MATH_MODULO_HELPURL
    });
  }
});

Blocks.block('sparql_math_constrain', {
  /**
   * Block for constraining a number between two limits.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.MATH_CONSTRAIN_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": typeExt('NumberExpr')
        },
        {
          "type": "input_value",
          "name": "LOW",
          "check": typeExt('NumberExpr')
        },
        {
          "type": "input_value",
          "name": "HIGH",
          "check": typeExt('NumberExpr')
        }
      ],
      "inputsInline": true,
      "output": "NumberExpr",
      "colour": HUE,
      "tooltip": Blockly.Msg.MATH_CONSTRAIN_TOOLTIP,
      "helpUrl": Blockly.Msg.MATH_CONSTRAIN_HELPURL
    });
  }
});

Blocks.block('sparql_math_random_int', {
  /**
   * Block for random integer between [X] and [Y].
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.MATH_RANDOM_INT_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "FROM",
          "check": typeExt('NumberExpr')
        },
        {
          "type": "input_value",
          "name": "TO",
          "check": typeExt('NumberExpr')
        }
      ],
      "inputsInline": true,
      "output": "NumberExpr",
      "colour": HUE,
      "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
      "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
    });
  }
});

Blocks.block('sparql_math_random_float', {
  /**
   * Block for random fraction between 0 and 1.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL);
    this.setColour(HUE);
    this.setOutput(true, 'NumberExpr');
    this.appendDummyInput()
        .appendField(Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM);
    this.setTooltip(Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP);
  }
});
