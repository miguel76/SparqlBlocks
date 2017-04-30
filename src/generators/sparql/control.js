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
 * @fileoverview Generating Sparql for control blocks.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Sparql = require('../sparql.js');

Sparql.sparql_filter = function(block) {
  var value_condition =
      Sparql.valueToCode(
          block,
          'CONDITION',
          Sparql.ORDER_NONE);
  return value_condition ?
            'FILTER(' + value_condition + ')' + Sparql.STMNT_BRK :
            '';
};

Sparql.sparql_union = function(block) {
  var statements_op1 = Sparql.statementToGraphPattern(block, 'OP1');
  var statements_op2 = Sparql.statementToGraphPattern(block, 'OP2');
  return (statements_op1 === '') ?
            ( (statements_op2 === '') ?
                  '' :
                  '{\n' + statements_op2 + '\n}' + Sparql.STMNT_BRK ) :
            ( (statements_op2 === '') ?
                  '{\n' + statements_op1 + '\n}' + Sparql.STMNT_BRK :
                  '{\n' + statements_op1 + '\n} UNION {\n' + statements_op2 + '\n}' +
                      Sparql.STMNT_BRK );
};

// Currently not working, wrong syntax!!!
Sparql.sparql_union1 = function(block) {
  var statements_op = Sparql.statementToGraphPattern(block, 'OP');
  return (statements_op === '') ?
            '' :
            'UNION {\n' + statements_op + '\n}' + Sparql.STMNT_BRK;
};

Sparql.sparql_optional = function(block) {
  var statements_op = Sparql.statementToGraphPattern(block, 'OP');
  return (statements_op === '') ?
            '' :
            'OPTIONAL {\n' + statements_op + '\n}' + Sparql.STMNT_BRK;
};

Sparql.sparql_graph = function(block) {
  var statements_op = Sparql.statementToGraphPattern(block, 'OP');
  var value_graphName =
      Sparql.valueToCode(
          block,
          'GRAPHNAME',
          Sparql.ORDER_NONE);
  return (!value_graphName || statements_op === '') ?
            '' :
            'GRAPH ' + value_graphName + ' {\n' + statements_op + '\n}' + Sparql.STMNT_BRK;
};
