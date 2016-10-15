/**
 * @fileoverview Shim on Blockly to permit shadow blocks in flyout
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
 * Show and populate the flyout.
 * @param {!Array|string} xmlList List of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
Blockly.Flyout.prototype.show = function(xmlList) {
  this.hide();
  this.clearOldBlocks_();

  if (xmlList == Blockly.Variables.NAME_TYPE) {
    // Special category for variables.
    xmlList =
        Blockly.Variables.flyoutCategory(this.workspace_.targetWorkspace);
  } else if (xmlList == Blockly.Procedures.NAME_TYPE) {
    // Special category for procedures.
    xmlList =
        Blockly.Procedures.flyoutCategory(this.workspace_.targetWorkspace);
  }

  this.svgGroup_.style.display = 'block';
  // Create the blocks to be shown in this flyout.
  var contents = [];
  var gaps = [];
  this.permanentlyDisabled_.length = 0;
  for (var i = 0, xml; xml = xmlList[i]; i++) {
    if (xml.tagName) {
      var tagName = xml.tagName.toUpperCase();
      var default_gap = this.horizontalLayout_ ? this.GAP_X : this.GAP_Y;
      if (tagName == 'BLOCK' || tagName == 'SHADOW') {
        var curBlock = Blockly.Xml.domToBlock(xml, this.workspace_);
        if (curBlock.disabled) {
          // Record blocks that were initially disabled.
          // Do not enable these blocks as a result of capacity filtering.
          this.permanentlyDisabled_.push(curBlock);
        }
        contents.push({type: 'block', block: curBlock});
        var gap = parseInt(xml.getAttribute('gap'), 10);
        gaps.push(isNaN(gap) ? default_gap : gap);
      } else if (xml.tagName.toUpperCase() == 'SEP') {
        // Change the gap between two blocks.
        // <sep gap="36"></sep>
        // The default gap is 24, can be set larger or smaller.
        // This overwrites the gap attribute on the previous block.
        // Note that a deprecated method is to add a gap to a block.
        // <block type="math_arithmetic" gap="8"></block>
        var newGap = parseInt(xml.getAttribute('gap'), 10);
        // Ignore gaps before the first block.
        if (!isNaN(newGap) && gaps.length > 0) {
          gaps[gaps.length - 1] = newGap;
        } else {
          gaps.push(default_gap);
        }
      } else if (tagName == 'BUTTON') {
        var label = xml.getAttribute('text');
        var curButton = new Blockly.FlyoutButton(this.workspace_,
            this.targetWorkspace_, label);
        contents.push({type: 'button', button: curButton});
        gaps.push(default_gap);
      }
    }
  }

  this.layout_(contents, gaps);

  // IE 11 is an incompetent browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function() {
    var topBlocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = topBlocks[i]; i++) {
      block.removeSelect();
    }
  };

  this.listeners_.push(Blockly.bindEvent_(this.svgBackground_, 'mouseover',
      this, deselectAll));

  if (this.horizontalLayout_) {
    this.height_ = 0;
  } else {
    this.width_ = 0;
  }
  this.reflow();

  this.filterForCapacity_();

  // Correctly position the flyout's scrollbar when it opens.
  this.position();

  this.reflowWrapper_ = this.reflow.bind(this);
  this.workspace_.addChangeListener(this.reflowWrapper_);
};
