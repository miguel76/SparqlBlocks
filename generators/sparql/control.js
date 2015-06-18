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

goog.provide('SparqlBlocks.Sparql.control');

goog.require('SparqlBlocks.Sparql');


SparqlBlocks.Sparql['sparql_filter'] = function(block) {
  var value_condition =
      SparqlBlocks.Sparql.valueToCode(
          block,
          'CONDITION',
          SparqlBlocks.Sparql.ORDER_NONE);
  return value_condition ?
            'FILTER(' + value_condition + ')' + SparqlBlocks.Sparql.STMNT_BRK :
            '';
};

SparqlBlocks.Sparql['sparql_union'] = function(block) {
  var statements_op1 =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'OP1'),
          '.\n');
  var statements_op2 =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'OP2'),
          '.\n');
  return (statements_op1 == '') ?
            ( (statements_op2 == '') ?
                  '' :
                  '{\n' + statements_op2 + '\n}' + SparqlBlocks.Sparql.STMNT_BRK ) :
            ( (statements_op2 == '') ?
                  '{\n' + statements_op1 + '\n}' + SparqlBlocks.Sparql.STMNT_BRK :
                  '{\n' + statements_op1 + '\n} UNION {\n' + statements_op2 + '\n}' +
                      SparqlBlocks.Sparql.STMNT_BRK )
};

SparqlBlocks.Sparql['sparql_optional'] = function(block) {
  var statements_op =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'OP'),
          '.\n');
  return (statements_op == '') ?
            '' :
            'OPTIONAL {\n' + statements_op + '\n}' + SparqlBlocks.Sparql.STMNT_BRK;
};
