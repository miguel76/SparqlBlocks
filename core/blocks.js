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

  // fix a bug in Blockly: using this.getIcons() instead of undefined this.icons_
  Blockly.BlockSvg.prototype.setEditable = function(editable) {
    Blockly.BlockSvg.superClass_.setEditable.call(this, editable);
    var icons = this.getIcons();
    if (this.rendered) {
      for (var i = 0; i < icons.length; i++) {
        icons[i].updateEditable();
      }
    }
  };

  // fix a bug in Blockly
  Blockly.BlockSvg.disconnectUiStep_ = function(group, magnitude, start) {
    var DURATION = 200;  // Milliseconds.
    var WIGGLES = 3;  // Half oscillations.

    var ms = (new Date()) - start;
    var percent = ms / DURATION;

    if (percent > 1) {
      group.skew_ = '';
    } else {
      var skew = Math.round(Math.sin(percent * Math.PI * WIGGLES) *
                    (1 - percent) * magnitude);
      group.skew_ = 'skewX(' + skew + ')';
      var closure = function() {
        Blockly.BlockSvg.disconnectUiStep_(group, magnitude, start);
      };
      Blockly.BlockSvg.disconnectUiStop_.group = group;
      Blockly.BlockSvg.disconnectUiStop_.pid = setTimeout(closure, 10);
    }
    // group.translate_ may be undefined because setDraggin is yet to be called
    group.setAttribute(
        'transform',
        (group.translate_ ? group.translate_ : "") + group.skew_);
  };


  return {
    block: block_,
    insertOptionBeforeHelp: insertOptionBeforeHelp_
  }

}) ();
