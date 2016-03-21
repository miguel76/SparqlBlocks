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

goog.provide('SparqlBlocks.Sparql.query');

goog.require('SparqlBlocks.Sparql');

( function() {

  SparqlBlocks.Sparql.sparqlQuery = function(block) {
    if (!block) {
      return '';
    }
    var statements_where = SparqlBlocks.Sparql.statementToGraphPattern(block, 'WHERE');
    if (statements_where == '') {
      return '';
    }
    var text_limit = block.getFieldValue('LIMIT');
    var code = 'SELECT DISTINCT * WHERE {\n' + statements_where + '\n}';
    var orderByCode = null;
    for (var i = 1; i <= block.orderFieldCount_; i++) {
      var text_order =
          SparqlBlocks.Sparql.valueToCode(
              block, 'ORDER_FIELD' + i,
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
      }
    }
    if (orderByCode) {
      code += '\n' + orderByCode;
    }
    if (text_limit) {
      code += '\nLIMIT ' + text_limit;
    }

    var prefixMatches = code.match(/[^(|!/\^,;\x20|\x09|\x0D|\x0A]+[\x20|\x09|\x0D|\x0A]*:/g);
    var prefixStrings = null;
    if (prefixMatches) {
      prefixStrings = prefixMatches.map( function(str) {
        return str.substr(0,str.length - 1).trim();
      });
    }

    var prefixDeclaration = '';
    if (prefixStrings) {
      prefixStrings.forEach( function(prefix) {
        var extension = SparqlBlocks.Prefixes.lookForPrefix(prefix);
        if (extension) {
          prefixDeclaration += 'PREFIX ' + prefix + ':\t<' + extension + '>\n';
        }
      });
    }
    if (prefixDeclaration.length > 0) {
      code = prefixDeclaration + '\n' + code;
    }

    return code; // [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
  }

  SparqlBlocks.Sparql['sparql_select'] = function(block) {
    var query = SparqlBlocks.Sparql.sparqlQuery(block);
    return query ?
          '{\n' +
            SparqlBlocks.Sparql.prefixLines(query, SparqlBlocks.Sparql.INDENT) +
            '\n}' + SparqlBlocks.Sparql.STMNT_BRK :
          '';
  };

}) ();
