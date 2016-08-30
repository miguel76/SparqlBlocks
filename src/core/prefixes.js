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
 * @fileoverview Maintain a map of IRI prefixes loaded from JSON (prefix.cc)
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var $ = require('jquery');

var prefixMap_ = require('../../resources/json/prefix.cc.json');

var reverseMap_ = {};
Object.keys(prefixMap_).forEach( function(prefix) {
  if (!reverseMap_[prefixMap_[prefix]]) {
    reverseMap_[prefixMap_[prefix]] = prefix;
  }
});

var lookForPrefix_ = function(prefix) {
  return prefixMap_[prefix];
};

var lookForIri_ = function(iri) {
  var prefix = reverseMap_[iri];
  if (prefix) {
    return { prefix: prefix, localPart: '' };
  }
  var base = null;
  var toSearch = iri.substr(0, iri.length - 1);
  var sepIndex = toSearch.lastIndexOf('#');
  if (sepIndex > -1) {
    base = iri.substr(0,sepIndex + 1);
  } else {
    sepIndex = toSearch.lastIndexOf('/');
    if (sepIndex > -1) {
      base = iri.substr(0,sepIndex + 1);
    }
  }
  if (base) {
    var res = lookForIri_(base);
    if (res) {
      return {
        prefix: res.prefix,
        localPart: res.localPart + iri.substr(sepIndex + 1)
      };
    }
  }
  return null;
};

module.exports = {
  lookForPrefix: lookForPrefix_,
  lookForIri: lookForIri_
};
