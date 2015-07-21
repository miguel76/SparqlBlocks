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
 * @fileoverview SparqlBlocks queries output generation.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

// (function() {

  goog.provide('SparqlBlocks.Prefixes');
  // goog.require('goog.math.Coordinate');

  var prefixMap_ = null;
  var reverseMap_ = {};

  // var startState_ = {};
  //
  // var search_ = function(str, state) {
  //   console.log('search_(' + str + ', ' + state + ')');
  //   if ( state.options ) {
  //     var optsNum = state.options.length;
  //     for (var i; i < optsNum; i++) {
  //       var currOption = currState.options[i];
  //       if (str.startsWith(currOption.read)) {
  //         return search_(str.slice(currOption.read.length), currOption.goTo);
  //       }
  //     }
  //   }
  //   console.log('returning { rest: ' + str + ', state: ' + state + ' }');
  //   return { rest: str, state: state };
  // }
  //
  // var addRule_ = function(extended, prefix) {
  //   console.log('addRule_(' + extended + ', ' + prefix + ')')
  //   var searchRes = search_(extended, startState_);
  //   if (searchRes.rest.length == 0 && !searchRes.state.accept) {
  //     searchRes.state.accept = prefix;
  //   } else {
  //     var opts = searchRes.state.options;
  //     if (!opts) {
  //       searchRes.state.options = opts = [];
  //     }
  //     var optsNum = opts.length;
  //     for (var i = 0; i < optsNum; i++) {
  //       var currOption = opts[i];
  //       var maxCharNum = 0;
  //       for (var charNum = 1; charNum <= extended.length; charNum++) {
  //         if (currOption.read.startsWith(extended.slice(0,charNum))) {
  //           maxCharNum = charNum;
  //         } else {
  //           break;
  //         }
  //       }
  //       if (maxCharNum > 0) {
  //         opts[i] = {
  //           read: extended.slice(0,maxCharNum),
  //           goTo: (maxCharNum < extended.length)
  //                   ? {
  //                     options: [
  //                       { read: currOption.read.slice(maxCharNum),
  //                         goTo: currOption.goTo },
  //                       { read: extended.slice(maxCharNum),
  //                         goTo: { accept: prefix } } ]
  //                   }
  //                   : {
  //                     accept: prefix,
  //                     options: [
  //                       { read: currOption.read.slice(maxCharNum),
  //                         goTo: currOption.goTo } ]
  //                   }
  //         };
  //         console.log("Split after: " + extended.slice(0,maxCharNum));
  //         return;
  //       }
  //     }
  //
  //     opts[optsNum] = {
  //       read: extended,
  //       goTo: { accept: prefix }
  //     };
  //     console.log("New option with: " + extended);
  //
  //   }
  // }

  var lookForPrefix_ = function(prefix) {
    return prefixMap_[prefix];
  }

  var lookForIri_ = function(iri) {
    var prefix = reverseMap_[iri];
    if (prefix) {
      return { prefix: prefix, localPart: '' }
    }
    var base = null;
    var sepIndex = iri.lastIndexOf('#');
    if (sepIndex > -1) {
      base = iri.substr(0,sepIndex + 1);
    } else {
      sepIndex = iri.lastIndexOf('/');
      if (sepIndex > -1) {
        base = iri.substr(0,sepIndex + 1);
      }
    }
    if (base != null) {
      var res = lookForIri_(base);
      if (res) {
        return {
          prefix: res.prefix,
          localPart: res.localPart + iri.substr(sepIndex + 1)
        }
      }
    } else {
      return null;
    }
  }

  $.getJSON( "../prefix.cc/all.file.json", function( data ) {
    prefixMap_ = data;
    Object.keys(data).forEach( function(prefix) {
      if (!reverseMap_[data[prefix]]) {
        reverseMap_[data[prefix]] = prefix;
      }
      // addRule_(data[prefix], prefix);
    });
  });

  SparqlBlocks.Prefixes.lookForPrefix = lookForPrefix_;
  SparqlBlocks.Prefixes.lookForIri = lookForIri_;

// })();
