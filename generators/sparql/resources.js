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

goog.provide('SparqlBlocks.Sparql.resources');

goog.require('SparqlBlocks.Sparql');

( function() {

  var VIRTUOSO_PATCH = true;

  var localNameEsc = function(localName) {
    return localName.split('').map( function(c) {
      return _.contains(
        [ '_', '~', '.', '-', '!', '$' , '&', "'", '(', ')', '\\', '*', '+', ',', ';', '=', '/', '?', '#', '@', '%' ],
        c) ? '\\' + c : c;
    }).join('');
  }

  SparqlBlocks.Sparql['sparql_prefixed_iri'] = function(block) {
    var text_prefix = block.getFieldValue('PREFIX');
    var text_local_name = block.getFieldValue('LOCAL_NAME');
    var code = null;
    if (VIRTUOSO_PATCH) {
      var extension = SparqlBlocks.Prefixes.lookForPrefix(text_prefix);
      if (extension) {
        code = '<' + extension + text_local_name + '>';
      }
    }
    if (!code) {
      code = text_prefix + ':' + localNameEsc(text_local_name);
    }
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

}) ();
