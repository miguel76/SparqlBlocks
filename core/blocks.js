/**
 * @license
 *
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
 * @fileoverview Core JavaScript library for SparqlBlocks.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks');
// goog.require('SparqlBlocks.Blocks.block');

SparqlBlocks.Blocks = ( function() {

  var baseInit_ = function(callback) {
    return function() {
    // ['cut', 'copy', 'paste'].forEach(function(event) {
    //   thisBlock.svgPath_.addEventListener(event, function(e) {
    //     console.log(event);
    //   });
    // });
      callback.call(this);
    }
  };

  var baseCustomContextMenu_ = function(callback) {
    return function(options) {
    // options.push({
    //   text: "Save Query as SPARQL",
    //   enabled: true,
    //   callback: saveQuerySparql
    // });
    // options.push({
    //   text: "Copy Fragment as SPARQL",
    //   enabled: true,
    //   callback: copyFragmentSparql
    // });
      if (callback) {
        callback.call(this, options);
      }
    };
  };

  var block_ = function(blockName, block) {
    block.customContextMenu = baseCustomContextMenu_(block.customContextMenu);
    block.init = baseInit_(block.init);
    Blockly.Blocks[blockName] = block;
  };

  var insertOptionBeforeHelp_ = function (options, newOption) {
    var helpCommand = options.pop();
    var isHelp = (helpCommand && helpCommand.text == "Help");
    if (!isHelp && helpCommand) {
      options.push(helpCommand);
    }
    options.push(newOption);
    if (isHelp) {
      options.push(helpCommand);
    }
  };

  return {
    block: block_,
    insertOptionBeforeHelp: insertOptionBeforeHelp_
  }

}) ();
