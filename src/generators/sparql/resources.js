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

var Sparql = require('../sparql.js'),
    Prefixes = require('../../core/prefixes.js'),
    _ = require('underscore');

var VIRTUOSO_PATCH = true;

var localNameEsc = function(localName) {
  return localName.split('').map( function(c) {
    return _.contains(
      [ '_', '~', '.', '-', '!', '$' , '&', "'", '(', ')', '\\', '*', '+', ',', ';', '=', '/', '?', '#', '@', '%' ],
      c) ? '\\' + c : c;
  }).join('');
};

var codeFromPrefixed = function(prefix, localName) {
  var code = null;
  if (VIRTUOSO_PATCH) {
    var extension = Prefixes.lookForPrefix(prefix);
    if (extension) {
      code = '<' + extension + localName + '>';
    }
  }
  if (!code) {
    code = prefix + ':' + localNameEsc(localName);
  }
  return [code, Sparql.ORDER_ATOMIC];
}

Sparql.sparql_prefixed_iri = function(block) {
  var text_prefix = block.getFieldValue('PREFIX');
  var text_local_name = block.getFieldValue('LOCAL_NAME');
  return codeFromPrefixed(text_prefix, text_local_name);
};

Sparql.sparql_iri = function(block) {
  var text_iri = block.getFieldValue('IRI');
  if (text_iri) {
    return ['<' + text_iri + '>', Sparql.ORDER_ATOMIC];
  } else {
    var text_prefix = block.getFieldValue('PREFIX');
    var text_local_name = block.getFieldValue('LOCAL_NAME');
    return codeFromPrefixed(text_prefix, text_local_name);
  }
};

Sparql.variables_get = function(block) {
  var text_var = block.getFieldValue('VAR');
  var code = '?' + text_var;
  return [code, Sparql.ORDER_ATOMIC];
};
