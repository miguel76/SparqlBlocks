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
 * @fileoverview Generating SPARQL for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Sparql = require('../sparql.js');

Sparql.sparql_logic_compare = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '=' || operator == '!=') ?
      Sparql.ORDER_EQUALITY : Sparql.ORDER_RELATIONAL;
  var argument0 = Sparql.valueToCode(block, 'A', order) || '0';
  var argument1 = Sparql.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Sparql.sparql_logic_operation = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Sparql.ORDER_LOGICAL_AND :
      Sparql.ORDER_LOGICAL_OR;
  var argument0 = Sparql.valueToCode(block, 'A', order);
  var argument1 = Sparql.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Sparql.sparql_logic_negate = function(block) {
  // Negation.
  var order = Sparql.ORDER_LOGICAL_NOT;
  var argument0 = Sparql.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Sparql.sparql_logic_boolean = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Sparql.ORDER_ATOMIC];
};

// Sparql.sparql_logic_null = function(block) {
//   // Null data type.
//   return ['null', Sparql.ORDER_ATOMIC];
// };

Sparql.sparql_logic_ternary = function(block) {
  // Ternary operator.
  var value_if = Sparql.valueToCode(block, 'IF',
      Sparql.ORDER_COMMA) || 'false';
  var value_then = Sparql.valueToCode(block, 'THEN',
      Sparql.ORDER_COMMA) || '""';
  var value_else = Sparql.valueToCode(block, 'ELSE',
      Sparql.ORDER_COMMA) || '""';
  var code = 'IF(' + value_if + ', ' + value_then + ', ' + value_else + ')';
  return [code, Sparql.ORDER_FUNCTION_CALL];
};

Sparql.sparql_exists = function(block) {
  var statements_op = Sparql.statementToGraphPattern(block, 'OP');
  return [ ( (statements_op === '') ?
                'true' :
                'EXISTS {\n' + statements_op + '\n}'), Sparql.ORDER_FUNCTION_CALL];
};

Sparql.sparql_not_exists = function(block) {
  var statements_op = Sparql.statementToGraphPattern(block, 'OP');
  return [ ( (statements_op === '') ?
                'true' :
                'NOT EXISTS {\n' + statements_op + '\n}'), Sparql.ORDER_FUNCTION_CALL];
};
