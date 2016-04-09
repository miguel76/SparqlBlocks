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

  /**
   * Create a custom event and fire it.
   * @param {!Blockly.Events.Abstract} event Custom data for event.
   */
  Blockly.Events.fire = function(event) {
    var workspace = Blockly.Workspace.getById(event.workspaceId);
    var block = workspace.getBlockById(event.blockId);

    // If the shadowMorph option is enabled, check if a shadow block is being
    // changed. In that case, the block must be morphed to a regular one.
    if (workspace.options.shadowMorphEnabled &&
        event.type === Blockly.Events.CHANGE && event.element !== 'shadow' &&
        block.isShadow()) {

      // The call to .setShadow(false) will fire the corresponding event, so
      // Blockly.Events.setGroup is used to join that event to the same event
      // group as the current event.
      var currGroupBackup = Blockly.Events.getGroup();
      Blockly.Events.setGroup(event.group || true);
      block.setShadow(false);
      event.group = Blockly.Events.getGroup();
      Blockly.Events.setGroup(currGroupBackup);
    }

    if (!Blockly.Events.isEnabled()) {
      return;
    }
    if (!Blockly.Events.FIRE_QUEUE_.length) {
      // First event added; schedule a firing of the event queue.
      setTimeout(Blockly.Events.fireNow_, 0);
    }
    Blockly.Events.FIRE_QUEUE_.push(event);
  };

  return {};

}) ();
