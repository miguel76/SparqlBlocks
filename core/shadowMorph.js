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
 * @fileoverview morph shadow blocks to regular ones when modified
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.ShadowMorph');

SparqlBlocks.ShadowMorph = ( function() {

  /**
   * By default there is no difference between the human-readable text and
   * the language-neutral values.  Subclasses (such as dropdown) may define this.
   * @param {string} newText New text.
   */
  Blockly.Field.prototype.setValue = function(newText) {
    if (newText === null) {
      // No change if null.
      return;
    }
    var oldText = this.getValue();
    if (oldText == newText) {
      return;
    }
    var noGroup = false;
    if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
      noGroup = !Blockly.Events.getGroup();
      if (noGroup) {
        Blockly.Events.setGroup(true);
      }
    }
    if (true /*workspace.options.shadowMorphEnabled*/ &&
        this.sourceBlock_ &&
        Blockly.Events.recordUndo) {
      this.sourceBlock_.setShadow(false);
    }
    if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
      Blockly.Events.fire(new Blockly.Events.Change(
          this.sourceBlock_, 'field', this.name, oldText, newText));
    }
    this.setText(newText);
    if (noGroup) {
      Blockly.Events.setGroup(false);
    }
  };

  /**
   * Set whether this block is a shadow block or not.
   * @param {boolean} shadow True if a shadow.
   */
  Blockly.Block.prototype.setShadow = function(shadow) {
    if (this.isShadow_ != shadow) {
      Blockly.Events.fire(new Blockly.Events.Change(
        this, 'shadow', null, this.isShadow_, shadow));
      this.isShadow_ = shadow;
    }
  };

  /**
   * Run a change event.
   * @param {boolean} forward True if run forward, false if run backward (undo).
   */
  Blockly.Events.Change.prototype.run = function(forward) {
    var workspace = Blockly.Workspace.getById(this.workspaceId);
    var block = workspace.getBlockById(this.blockId);
    if (!block) {
      console.warn("Can't change non-existant block: " + this.blockId);
      return;
    }
    if (block.mutator) {
      // Close the mutator (if open) since we don't want to update it.
      block.mutator.setVisible(false);
    }
    var value = forward ? this.newValue : this.oldValue;

    switch (this.element) {
      case 'field':
        var field = block.getField(this.name);
        if (field) {
          field.setValue(value);
        } else {
          console.warn("Can't set non-existant field: " + this.name);
        }
        break;
      case 'comment':
        block.setCommentText(value || null);
        break;
      case 'collapsed':
        block.setCollapsed(value);
        break;
      case 'disabled':
        block.setDisabled(value);
        break;
      case 'inline':
        block.setInputsInline(value);
        break;
      case 'mutation':
        var oldMutation = '';
        if (block.mutationToDom) {
          var oldMutationDom = block.mutationToDom();
          oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
        }
        if (block.domToMutation) {
          value = value || '<mutation></mutation>';
          var dom = Blockly.Xml.textToDom('<xml>' + value + '</xml>');
          block.domToMutation(dom.firstChild);
        }
        Blockly.Events.fire(new Blockly.Events.Change(
            block, 'mutation', null, oldMutation, value));
        break;
      case 'shadow':
        block.setShadow(value);
        break;
      default:
        console.warn('Unknown change type: ' + this.element);
    }
  };

  return {};

}) ();
