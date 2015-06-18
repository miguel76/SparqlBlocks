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
 * @fileoverview Generating Sparql.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Sparql.main');

goog.require('SparqlBlocks.Sparql');

SparqlBlocks.Sparql['sparql_select'] = function(block) {
  var statements_where =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'WHERE'),
          '.\n');
  var code = 'SELECT DISTINCT * WHERE {\n' + statements_where + '\n}';
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['sparql_prefixed_iri'] = function(block) {
  var text_prefix = block.getFieldValue('PREFIX');
  var text_local_name = block.getFieldValue('LOCAL_NAME');
  var code = text_prefix + ':' + text_local_name;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['variables_get'] = function(block) {
  var text_var = block.getFieldValue('VAR');
  var code = '?' + text_var;
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};
