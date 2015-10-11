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

goog.provide('SparqlBlocks.Sparql');

// goog.require('Blockly.Generator');


/**
 * Sparql code generator.
 * @type !Blockly.Generator
 */
 SparqlBlocks.Sparql = new Blockly.Generator('Sparql');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
SparqlBlocks.Sparql.addReservedWords('');
SparqlBlocks.Sparql.STMNT_BRK = "###\n";
SparqlBlocks.Sparql.STMNT_BRK_RE = /###\n/;
SparqlBlocks.Sparql.stmJoin = function(statements, joinStr) {
  var stmntArray = statements.split(SparqlBlocks.Sparql.STMNT_BRK_RE);
  // console.log('stmntArray (before pop):' + stmntArray);
  stmntArray.pop();
  // console.log('stmntArray (after pop):' + stmntArray);
  return stmntArray.join(joinStr);
}

SparqlBlocks.Sparql.statementToGraphPattern = function(block, inputName) {
  // var stmntArray =
  //     SparqlBlocks.Sparql.statementToCode(block, inputName)
  //         .split(SparqlBlocks.Sparql.STMNT_BRK_RE);
  // stmntArray.pop();
  // return stmntArray.map(function() {
  //
  // }).join('.\n');
  return SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, inputName),
          '.\n');
}

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/Sparql/Reference/Operators/Operator_Precedence
 */
SparqlBlocks.Sparql.ORDER_ATOMIC = 0;         // 0 "" ...
SparqlBlocks.Sparql.ORDER_MEMBER = 1;         // . []
SparqlBlocks.Sparql.ORDER_NEW = 1;            // new
SparqlBlocks.Sparql.ORDER_FUNCTION_CALL = 2;  // ()
SparqlBlocks.Sparql.ORDER_INCREMENT = 3;      // ++
SparqlBlocks.Sparql.ORDER_DECREMENT = 3;      // --
SparqlBlocks.Sparql.ORDER_LOGICAL_NOT = 4;    // !
SparqlBlocks.Sparql.ORDER_BITWISE_NOT = 4;    // ~
SparqlBlocks.Sparql.ORDER_UNARY_PLUS = 4;     // +
SparqlBlocks.Sparql.ORDER_UNARY_NEGATION = 4; // -
SparqlBlocks.Sparql.ORDER_TYPEOF = 4;         // typeof
SparqlBlocks.Sparql.ORDER_VOID = 4;           // void
SparqlBlocks.Sparql.ORDER_DELETE = 4;         // delete
SparqlBlocks.Sparql.ORDER_MULTIPLICATION = 5; // *
SparqlBlocks.Sparql.ORDER_DIVISION = 5;       // /
SparqlBlocks.Sparql.ORDER_MODULUS = 5;        // %
SparqlBlocks.Sparql.ORDER_ADDITION = 6;       // +
SparqlBlocks.Sparql.ORDER_SUBTRACTION = 6;    // -
SparqlBlocks.Sparql.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
SparqlBlocks.Sparql.ORDER_RELATIONAL = 8;     // < <= > >=
SparqlBlocks.Sparql.ORDER_IN = 8;             // in
SparqlBlocks.Sparql.ORDER_INSTANCEOF = 8;     // instanceof
SparqlBlocks.Sparql.ORDER_EQUALITY = 9;       // == != === !==
SparqlBlocks.Sparql.ORDER_BITWISE_AND = 10;   // &
SparqlBlocks.Sparql.ORDER_BITWISE_XOR = 11;   // ^
SparqlBlocks.Sparql.ORDER_BITWISE_OR = 12;    // |
SparqlBlocks.Sparql.ORDER_LOGICAL_AND = 13;   // &&
SparqlBlocks.Sparql.ORDER_LOGICAL_OR = 14;    // ||
SparqlBlocks.Sparql.ORDER_CONDITIONAL = 15;   // ?:
SparqlBlocks.Sparql.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
SparqlBlocks.Sparql.ORDER_COMMA = 17;         // ,
SparqlBlocks.Sparql.ORDER_NONE = 99;          // (...)

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
SparqlBlocks.Sparql.init = function(workspace) {
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
SparqlBlocks.Sparql.finish = function(code) {
  // TODO prepend prefixes declaration
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
SparqlBlocks.Sparql.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Sparql string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Sparql string.
 * @private
 */
SparqlBlocks.Sparql.quote_ = function(string) {
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
SparqlBlocks.Sparql.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += SparqlBlocks.Sparql.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = SparqlBlocks.Sparql.allNestedComments(childBlock);
          if (comment) {
            commentCode += SparqlBlocks.Sparql.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = SparqlBlocks.Sparql.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
