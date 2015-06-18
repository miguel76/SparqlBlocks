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

goog.provide('SparqlBlocks.Sparql.logic');

goog.require('SparqlBlocks.Sparql');

SparqlBlocks.Sparql['sparql_logic_compare'] = function(block) {
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
      SparqlBlocks.Sparql.ORDER_EQUALITY : SparqlBlocks.Sparql.ORDER_RELATIONAL;
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'A', order) || '0';
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

SparqlBlocks.Sparql['sparql_logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? SparqlBlocks.Sparql.ORDER_LOGICAL_AND :
      SparqlBlocks.Sparql.ORDER_LOGICAL_OR;
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'A', order);
  var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'B', order);
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

SparqlBlocks.Sparql['sparql_logic_negate'] = function(block) {
  // Negation.
  var order = SparqlBlocks.Sparql.ORDER_LOGICAL_NOT;
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

SparqlBlocks.Sparql['sparql_logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

// SparqlBlocks.Sparql['sparql_logic_null'] = function(block) {
//   // Null data type.
//   return ['null', SparqlBlocks.Sparql.ORDER_ATOMIC];
// };

SparqlBlocks.Sparql['sparql_logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = SparqlBlocks.Sparql.valueToCode(block, 'IF',
      SparqlBlocks.Sparql.ORDER_COMMA) || 'false';
  var value_then = SparqlBlocks.Sparql.valueToCode(block, 'THEN',
      SparqlBlocks.Sparql.ORDER_COMMA) || '""';
  var value_else = SparqlBlocks.Sparql.valueToCode(block, 'ELSE',
      SparqlBlocks.Sparql.ORDER_COMMA) || '""';
  var code = 'IF(' + value_if + ', ' + value_then + ', ' + value_else + ')';
  return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
};
