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
  if (text_limit) {
    code += '\nLIMIT ' + text_limit;
  }

  const WS = "\x20|\x09|\x0D|\x0A"
  const	PN_CHARS_BASE	=
      "[A-Z]|[a-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]" +
      "|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]" +
      "|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\u10000-\uEFFFF]";
  const	PN_CHARS_U =	PN_CHARS_BASE  + "|\_";
  const	PN_CHARS = PN_CHARS_U + "|\-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040]";
  const	PN_PREFIX	=	PN_CHARS_BASE + "((" + PN_CHARS + "|\.)*" + PN_CHARS + ")?";

  const PNAME_NS = "(" + PN_PREFIX + ")(" + WS + ")*\:";

  // var prefixStrings = code.match('/' + PNAME_NS + '/g');
  // var prefixStrings = code.match(new RegExp(PNAME_NS, 'g'));
  // var prefixStrings = "pippo ciccio : pluto clu: giy hui".match(new RegExp(PNAME_NS, 'g'));

  var prefixStrings =
      code.match(/[^(|!/\^,;\x20|\x09|\x0D|\x0A]+[\x20|\x09|\x0D|\x0A]*:/g).map( function(str) {
        return str.substr(0,str.length - 1).trim();
      });

  console.log('prefixStrings: ' + prefixStrings);

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
