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
 * @fileoverview Generating SPARQL for text blocks.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Sparql.texts');

goog.require('SparqlBlocks.Sparql');


SparqlBlocks.Sparql['sparql_text'] = function(block) {
  // Text value.
  var code = SparqlBlocks.Sparql.quote_(block.getFieldValue('TEXT'));
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['sparql_text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  var code;
  if (block.itemCount_ == 0) {
    return ['\'\'', SparqlBlocks.Sparql.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'ADD0',
        SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
    code = 'STR(' + argument0 + ')';
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  } else if (block.itemCount_ == 2) {
    var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'ADD0',
        SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
    var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'ADD1',
        SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
    code = 'CONCAT(STR(' + argument0 + '), STR(' + argument1 + '))';
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  } else {
    code = new Array(block.itemCount_);
    for (var n = 0; n < block.itemCount_; n++) {
      code[n] = SparqlBlocks.Sparql.valueToCode(block, 'ADD' + n,
          SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
    }
    code = 'CONCAT(STR(' + code.join('), STR(') + '))';
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  }
};

SparqlBlocks.Sparql['sparql_text_length'] = function(block) {
  // String length.
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
      SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
  return ['STRLEN(' + argument0 + ')', SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
};

SparqlBlocks.Sparql['sparql_text_isEmpty'] = function(block) {
  // Is the string null?
  var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
      SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
  return ['STRLEN(' + argument0 + ') == 0', SparqlBlocks.Sparql.ORDER_EQUALITY];
};

// SparqlBlocks.Sparql['sparql_text_indexOf'] = function(block) {
//   // Search the text for a substring.
//   var operator = block.getFieldValue('END') == 'FIRST' ?
//       'indexOf' : 'lastIndexOf';
//   var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'FIND',
//       SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
//   var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
//       SparqlBlocks.Sparql.ORDER_MEMBER) || '\'\'';
//   var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
//   return [code, SparqlBlocks.Sparql.ORDER_MEMBER];
// };

// SparqlBlocks.Sparql['sparql_text_contains'] = function(block) {
//   // Search the text for a substring.
//   var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'FIND',
//       SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
//   var argument1 = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
//       SparqlBlocks.Sparql.ORDER_MEMBER) || '\'\'';
//   var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
//   return [code, SparqlBlocks.Sparql.ORDER_MEMBER];
// };

SparqlBlocks.Sparql['sparql_text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = SparqlBlocks.Sparql.valueToCode(block, 'AT',
      SparqlBlocks.Sparql.ORDER_SUBTRACTION) || '1';
  var text = SparqlBlocks.Sparql.valueToCode(block, 'VALUE',
      SparqlBlocks.Sparql.ORDER_COMMA) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'SUBSTR(' + text + ', 1, 1)';
      return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
    case 'LAST':
      var code = 'SUBSTR(' + text + ', STRLEN(' + text + '), 1)';
      return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
    case 'FROM_START':
      // Blockly uses one-based indicies.
      var code = 'SUBSTR(' + text + ', ' + at + ', 1)';
      return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
    case 'FROM_END':
      var code = 'SUBSTR(' + text + ', STRLEN(' + text + ') + 1 - ' + at + ', 1)';
      return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
    // case 'RANDOM':
    //   var functionName = SparqlBlocks.Sparql.provideFunction_(
    //       'text_random_letter',
    //       [ 'function ' + SparqlBlocks.Sparql.FUNCTION_NAME_PLACEHOLDER_ +
    //           '(text) {',
    //         '  var x = Math.floor(Math.random() * text.length);',
    //         '  return text[x];',
    //         '}']);
    //   code = functionName + '(' + text + ')';
    //   return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  }
  throw 'Unhandled option (text_charAt).';
};

SparqlBlocks.Sparql['sparql_text_getSubstring'] = function(block) {
  // Get substring.
  var text = SparqlBlocks.Sparql.valueToCode(block, 'STRING',
      SparqlBlocks.Sparql.ORDER_COMMA) || '\'\'';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var at1 = SparqlBlocks.Sparql.valueToCode(block, 'AT1',
      SparqlBlocks.Sparql.ORDER_SUBTRACTION) || '1';
  var at2 = SparqlBlocks.Sparql.valueToCode(block, 'AT2',
      SparqlBlocks.Sparql.ORDER_ADDITION) || '1';
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = text;
  } else {
    var pos;
    if (where1 == 'FIRST') {
      pos = '1';
    } else if (where1 == 'LAST') {
      pos = 'STRLEN(' + text + ')';
    } else if (where1 == 'FROM_START') {
      pos = at1;
    } else if (where1 == 'FROM_END') {
      pos = 'STRLEN(' + text + ') + 1 - ' + at1;
    } else {
      throw 'Unhandled option (text_getSubstring): ' + where1;
    }
    var len;
    if (where2 == 'FIRST') {
      len = '2 - ' + pos;
    } else if (where2 == 'LAST') {
      len = null;
    } else if (where2 == 'FROM_START') {
      if (where1 == 'FIRST') {
        len = at2;
      } else if (where1 == 'FROM_END') {
        len = at1 + ' + ' + at2 + ' - STRLEN(' + text + ')';
      }
      len = at2 + ' + 1 - ' + pos;
    } else if (where2 == 'FROM_END') {
      if (where1 == 'FIRST') {
        len = 'STRLEN(' + text + ') + 1 - ' + at2;
      } else if (where1 == 'LAST') {
        len = '2 - ' + at2;
      } else if (where1 == 'FROM_END') {
        len = at1 + ' - ' + at2 + ' + 1';
      }
      len = 'STRLEN(' + text + ') + 2 - ' + at2 + ' - ' + pos;
    } else {
      throw 'Unhandled option (text_getSubstring): ' + where2;
    }
    var code;
    if (len) {
      code = 'SUBSTR(' + text + ', ' + pos + ', ' + len + ')';
    } else {
      code = 'SUBSTR(' + text + ', ' + pos + ')';
    }
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  }
};

SparqlBlocks.Sparql['sparql_text_changeCase'] = function(block) {
  // Change capitalization.
  var FUNCTIONS = {
    'UPPERCASE': 'UCASE',
    'LOWERCASE': 'LCASE'
  };
  var caseStr = block.getFieldValue('CASE');
  var functionName = FUNCTIONS[caseStr];
  var code;
  if (functionName) {
    // Upper and lower case are functions built into JavaScript.
    var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'TEXT',
        SparqlBlocks.Sparql.ORDER_NONE) || '\'\'';
    code = functionName + '(' + argument0 + ')';
    return [code, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
  }
  throw "Unknown case type: " + caseStr;
};

// SparqlBlocks.Sparql['sparql_text_trim'] = function(block) {
//   // Trim spaces.
//   var OPERATORS = {
//     'LEFT': ".replace(/^[\\s\\xa0]+/, '')",
//     'RIGHT': ".replace(/[\\s\\xa0]+$/, '')",
//     'BOTH': '.trim()'
//   };
//   var operator = OPERATORS[block.getFieldValue('MODE')];
//   var argument0 = SparqlBlocks.Sparql.valueToCode(block, 'TEXT',
//       SparqlBlocks.Sparql.ORDER_MEMBER) || '\'\'';
//   return [argument0 + operator, SparqlBlocks.Sparql.ORDER_FUNCTION_CALL];
// };
