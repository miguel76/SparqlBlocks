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
 * @fileoverview Helper functions for generating Sparql for blocks.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
 * Sparql code generator.
 * @type !Blockly.Generator
 */
var Sparql = new Blockly.Generator('Sparql');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Sparql.addReservedWords('');
Sparql.STMNT_BRK = "###\n";
Sparql.STMNT_BRK_RE = /###\n/;
Sparql.stmJoin = function(statements, joinStr) {
  var stmntArray = statements.split(Sparql.STMNT_BRK_RE);
  // console.log('stmntArray (before pop):' + stmntArray);
  stmntArray.pop();
  // console.log('stmntArray (after pop):' + stmntArray);
  return stmntArray.join(joinStr);
};

Sparql.statementToGraphPattern = function(block, inputName) {
  // var stmntArray =
  //     Sparql.statementToCode(block, inputName)
  //         .split(Sparql.STMNT_BRK_RE);
  // stmntArray.pop();
  // return stmntArray.map(function() {
  //
  // }).join('.\n');
  return Sparql.stmJoin(
          Sparql.statementToCode(block, inputName),
          '.\n');
};

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/Sparql/Reference/Operators/Operator_Precedence
 */
Sparql.ORDER_ATOMIC = 0;         // 0 "" ...
Sparql.ORDER_MEMBER = 1;         // . []
Sparql.ORDER_NEW = 1;            // new
Sparql.ORDER_FUNCTION_CALL = 2;  // ()
Sparql.ORDER_INCREMENT = 3;      // ++
Sparql.ORDER_DECREMENT = 3;      // --
Sparql.ORDER_LOGICAL_NOT = 4;    // !
Sparql.ORDER_BITWISE_NOT = 4;    // ~
Sparql.ORDER_UNARY_PLUS = 4;     // +
Sparql.ORDER_UNARY_NEGATION = 4; // -
Sparql.ORDER_TYPEOF = 4;         // typeof
Sparql.ORDER_VOID = 4;           // void
Sparql.ORDER_DELETE = 4;         // delete
Sparql.ORDER_MULTIPLICATION = 5; // *
Sparql.ORDER_DIVISION = 5;       // /
Sparql.ORDER_MODULUS = 5;        // %
Sparql.ORDER_ADDITION = 6;       // +
Sparql.ORDER_SUBTRACTION = 6;    // -
Sparql.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Sparql.ORDER_RELATIONAL = 8;     // < <= > >=
Sparql.ORDER_IN = 8;             // in
Sparql.ORDER_INSTANCEOF = 8;     // instanceof
Sparql.ORDER_EQUALITY = 9;       // == != === !==
Sparql.ORDER_BITWISE_AND = 10;   // &
Sparql.ORDER_BITWISE_XOR = 11;   // ^
Sparql.ORDER_BITWISE_OR = 12;    // |
Sparql.ORDER_LOGICAL_AND = 13;   // &&
Sparql.ORDER_LOGICAL_OR = 14;    // ||
Sparql.ORDER_CONDITIONAL = 15;   // ?:
Sparql.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
Sparql.ORDER_COMMA = 17;         // ,
Sparql.ORDER_NONE = 99;          // (...)

Sparql.VAR_PREFIX = '?';

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Sparql.init = function(workspace) {
  // // Create a dictionary of definitions to be printed before the code.
  // Sparql.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Sparql.functionNames_ = Object.create(null);

  if (!Sparql.variableDB_) {
    Sparql.variableDB_ =
        new Blockly.Names(Sparql.RESERVED_WORDS_, Sparql.VAR_PREFIX);
  }

  // var defvars = [];
  // var variables = workspace.variableList;
  // if (variables.length) {
  //   for (var i = 0; i < variables.length; i++) {
  //     defvars[i] = Sparql.variableDB_.getName(variables[i],
  //         Blockly.Variables.NAME_TYPE);
  //   }
  //   Sparql.definitions_['variables'] =
  //       'var ' + defvars.join(', ') + ';';
  // }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Sparql.finish = function(code) {
  // TODO prepend prefixes declaration
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Sparql.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Sparql string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Sparql string.
 * @private
 */
Sparql.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Sparql from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Sparql code created for this block.
 * @return {string} Sparql code with comments and subsequent blocks added.
 * @private
 */
Sparql.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Sparql.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var childComment = Sparql.allNestedComments(childBlock);
          if (childComment) {
            commentCode += Sparql.prefixLines(childComment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Sparql.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

module.exports = Sparql;
