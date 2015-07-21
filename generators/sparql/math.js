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
 * @fileoverview Generating SPARQL for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Sparql.math');

goog.require('SparqlBlocks.Sparql');


SparqlBlocks.Sparql['sparql_math_number'] = function(block) {
  // Numeric value.
  var numStr = block.getFieldValue('NUM');
  var asIntStr = "" + parseInt(numStr);
  if (numStr == asIntStr) {
    return [numStr, SparqlBlocks.Sparql.ORDER_ATOMIC];
  }
  var asFloat = parseFloat(numStr);
  if (!isNaN(asFloat)) {
    return ["" + asFloat, SparqlBlocks.Sparql.ORDER_ATOMIC];
  }
  throw "Not a number: " + numStr;
};

SparqlBlocks.Sparql['sparql_math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', SparqlBlocks.Sparql.ORDER_ADDITION],
    'MINUS': [' - ', SparqlBlocks.Sparql.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', SparqlBlocks.Sparql.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', SparqlBlocks.Sparql.ORDER_DIVISION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'A', order) || '0';
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'B', order) || '0';
  var code;
  code = argument0 + operator + argument1;
  return [code, order];
};

SparqlBlocks.Sparql['sparql_math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = SparqlBlocks.Sparql.valueToCode(block, 'NUM',
        SparqlBlocks.Sparql.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, SparqlBlocks.Sparql.ORDER_UNARY_NEGATION];
  }
  arg = SparqlBlocks.Sparql.valueToCode(block, 'NUM',
        SparqlBlocks.Sparql.ORDER_NONE) || '0';
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'ABS(' + arg + ')';
      break;
    case 'ROUND':
      code = 'ROUND(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'CEIL(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'FLOOR(' + arg + ')';
      break;
  }
  if (code) {
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  }
  throw 'Unknown math operator: ' + operator;
};

SparqlBlocks.Sparql.isWhole = function(argument0) {
  var code = 'FLOOR(' + argument0 + ') = ' + argument0;
  return [code, SparqlBlocks.Sparql.ORDER_EQUALITY];
}

SparqlBlocks.Sparql.isNotWhole = function(argument0) {
  var code = 'FLOOR(' + argument0 + ') != ' + argument0;
  return [code, SparqlBlocks.Sparql.ORDER_EQUALITY];
}

SparqlBlocks.Sparql.divisible = function(argument0,argument1) {
  return SparqlBlocks.Sparql.isWhole(argument0 + ' / ' + argument1)[0];
}

SparqlBlocks.Sparql.notDivisible = function(argument0,argument1) {
  return SparqlBlocks.Sparql.isNotWhole(argument0 + ' / ' + argument1)[0];
}

SparqlBlocks.Sparql['sparql_math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = SparqlBlocks.Sparql.valueToCode(block, 'NUMBER_TO_CHECK',
      SparqlBlocks.Sparql.ORDER_DIVISION) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  switch (dropdown_property) {
    case 'EVEN':
      return SparqlBlocks.Sparql.divisible(number_to_check, '2');
    case 'ODD':
      return SparqlBlocks.Sparql.notDivisible(number_to_check, '2');
    case 'WHOLE':
      return SparqlBlocks.Sparql.isWhole(number_to_check);
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      return [code, SparqlBlocks.Sparql.ORDER_RELATIONAL];
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      return [code, SparqlBlocks.Sparql.ORDER_RELATIONAL];
    case 'DIVISIBLE_BY':
      var divisor = SparqlBlocks.Sparql.valueToCode(block, 'DIVISOR',
          SparqlBlocks.Sparql.ORDER_MODULUS) || '0';
      return SparqlBlocks.Sparql.divisible(number_to_check, divisor);
  }
};

// Rounding functions have a single operand.
SparqlBlocks.Sparql['sparql_math_round'] = SparqlBlocks.Sparql['sparql_math_single'];
// Trigonometry functions have a single operand.
// SparqlBlocks.Sparql['sparql_math_trig'] = SparqlBlocks.Sparql['sparql_math_single'];

SparqlBlocks.Sparql.idivAbs = function(argument0,argument1) {
  var code = 'FLOOR(ABS(' + argument0 + ' / ' + argument1 + '))';
  return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
}

SparqlBlocks.Sparql.idiv = function(argument0,argument1) {
  var code =
      SparqlBlocks.Sparql.idivAbs(argument0, argument1)[0] +
      ' * (ABS(' + argument0 + ') / ' + argument0 + ')' +
      ' * (ABS(' + argument1 + ') / ' + argument1 + ')';
  return [code, SparqlBlocks.Sparql.ORDER_MULTIPLICATION];
}

SparqlBlocks.Sparql.modulo = function(argument0,argument1) {
  var code =
      argument0 + ' - ' +
      SparqlBlocks.Sparql.idivAbs(argument0, argument1)[0] +
      ' * ABS(' + argument0 + ') / ' + argument0 +
      ' * ABS(' + argument1 + ')';
  return [code, SparqlBlocks.Sparql.ORDER_SUBTRACTION];
}

SparqlBlocks.Sparql['sparql_math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'DIVIDEND',
      SparqlBlocks.Sparql.ORDER_DIVISION) || '0';
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'DIVISOR',
      SparqlBlocks.Sparql.ORDER_DIVISION) || '0';
  return SparqlBlocks.Sparql.modulo(argument0, argument1);
};

SparqlBlocks.Sparql['sparql_math_constrain'] = function(block) {
  // Constrain a number between two limits.
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
      SparqlBlocks.Sparql.ORDER_RELATIONAL) || '0';
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'LOW',
      SparqlBlocks.Sparql.ORDER_RELATIONAL);
  var argument2 = SparqlBlocks.Sparql.valueToCode(block, 'HIGH',
      SparqlBlocks.Sparql.ORDER_RELATIONAL);
  var code =
      'IF(' + argument0 + ' < ' + argument1 + ', ' + argument1 + ', ' +
      'IF(' + argument0 + ' > ' + argument2 + ', ' + argument2 + ', ' +
      argument0 + ') )';
  return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
};

SparqlBlocks.Sparql['sparql_math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'FROM',
      SparqlBlocks.Sparql.ORDER_ADDITION) || '0';
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'TO',
      SparqlBlocks.Sparql.ORDER_SUBTRACTION) || '0';
  var code = 'FLOOR(RAND() * (' + argument1 + ' - ' + argument0 + ' + 1) + ' + argument0 + ')';
  return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
};

SparqlBlocks.Sparql['sparql_math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  return ['RAND()', SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
};
