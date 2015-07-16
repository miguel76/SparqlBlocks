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
goog.require('SparqlBlocks.Core.prefixes');

SparqlBlocks.Sparql['sparql_select'] = function(block) {
  var statements_where =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'WHERE'),
          '.\n');
  var text_limit = block.getFieldValue('LIMIT');
  var code = 'SELECT DISTINCT * WHERE {\n' + statements_where + '\n}';
  var orderByCode = null;
  for (var i = 1; true; i++) {
    var text_order =
        SparqlBlocks.Sparql.valueToCode(
            this, 'ORDER_FIELD' + i,
            SparqlBlocks.Sparql.ORDER_NONE);
    if (text_order) {
      var text_orderDir = block.getFieldValue('ORDER_DIRECTION' + i);
      if (orderByCode) {
        orderByCode += ', ';
      } else {
        orderByCode = 'ORDER BY ';
      }
      if (text_orderDir && text_orderDir == 'DESC') {
        orderByCode += 'DESC';
      }
      orderByCode += '(' + text_order + ')';
    } else {
      break;
    }
  }
  if (orderByCode) {
    code += '\n' + orderByCode;
  }
  if (text_limit) {
    code += '\nLIMIT ' + text_limit;
  }

  var prefixStrings =
      code.match(/[^(|!/\^,;\x20|\x09|\x0D|\x0A]+[\x20|\x09|\x0D|\x0A]*:/g).map( function(str) {
        return str.substr(0,str.length - 1).trim();
      });

  var prefixDeclaration = '';
  prefixStrings.forEach( function(prefix) {
    var extension = SparqlBlocks.Core.prefixes.lookForPrefix(prefix);
    if (extension) {
      prefixDeclaration += 'PREFIX ' + prefix + ':\t<' + extension + '>\n';
    }
  });
  if (prefixDeclaration.length > 0) {
    code = prefixDeclaration + '\n' + code;
  }

  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['sparql_prefixed_iri'] = function(block) {
  var text_prefix = block.getFieldValue('PREFIX');
  var text_local_name = block.getFieldValue('LOCAL_NAME');
  var code = text_prefix + ':' + text_local_name;
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['sparql_iri'] = function(block) {
  var text_iri = block.getFieldValue('IRI');
  var code = '<' + text_iri + '>';
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};

SparqlBlocks.Sparql['variables_get'] = function(block) {
  var text_var = block.getFieldValue('VAR');
  var code = '?' + text_var;
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
};
