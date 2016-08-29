/**
 * @fileoverview Shim on Blockly to morph shadow blocks to regular ones when modified
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

var morphShadowRec = function(block) {
  var parentBlock = block.getParent();
  if (parentBlock) {
    morphShadowRec(parentBlock);
  }
  block.setShadow(false);
};

/**
 * When a field changes, generate event and manage shadow state.
 * @param {Object} oldValue The old field value
 * @param {Object} newValue The new field value
 * @protected
 */
Blockly.Block.prototype.blockIsTargetOfConnection = function(childBlock, manageEvent) {
  var noGroup = false;
  if (Blockly.Events.recordUndo) {
    if (Blockly.Events.isEnabled()) {
      noGroup = true; //!Blockly.Events.getGroup();
      Blockly.Events.setGroup(true);
    }
    morphShadowRec(this);
  }
  manageEvent();
  if (noGroup) {
    Blockly.Events.setGroup(false);
  }
};

/**
 * When a field changes, generate event and manage shadow state.
 * @param {Object} oldValue The old field value
 * @param {Object} newValue The new field value
 * @protected
 */
Blockly.Field.prototype.fieldHasChanged = function(oldValue, newValue, manageEvent) {
  var noGroup = false;
  if (this.sourceBlock_) {
    if (true /*this.sourceBlock_.workspace.options.shadowMorphEnabled*/ &&
        Blockly.Events.recordUndo) {
      if (Blockly.Events.isEnabled()) {
        noGroup = true; //!Blockly.Events.getGroup();
        if (noGroup) {
          Blockly.Events.setGroup(true);
        }
      }
      morphShadowRec(this.sourceBlock_);
    }
    if (Blockly.Events.isEnabled()) {
      Blockly.Events.fire(new Blockly.Events.Change(
        this.sourceBlock_, 'field', this.name, oldValue, newValue));
    }
  }
  manageEvent();
  if (noGroup) {
    Blockly.Events.setGroup(false);
  }
};

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
  var that = this;
  this.fieldHasChanged(oldText, newText, function() {
    that.setText(newText);
  });
};

/**
 * Set the checkbox to be checked if strBool is 'TRUE', unchecks otherwise.
 * @param {string} strBool New state.
 */
Blockly.FieldCheckbox.prototype.setValue = function(strBool) {
  var newState = (strBool == 'TRUE');
  if (this.state_ !== newState) {
    var that = this;
    this.fieldHasChanged(this.state_, newState, function() {
      that.state_ = newState;
      if (that.checkElement_) {
        that.checkElement_.style.display = newState ? 'block' : 'none';
      };
    });
  }
};

/**
 * Set the colour.
 * @param {string} colour The new colour in '#rrggbb' format.
 */
Blockly.FieldColour.prototype.setValue = function(colour) {
  if (this.colour_ != colour) {
    var that = this;
    this.fieldHasChanged(this.colour_, colour, function() {
      that.colour_ = colour;
      if (that.borderRect_) {
        that.borderRect_.style.fill = colour;
      }
    });
  }
};

/**
 * Set the language-neutral value for this dropdown menu.
 * @param {string} newValue New value to set.
 */
Blockly.FieldDropdown.prototype.setValue = function(newValue) {
  if (newValue === null || newValue === this.value_) {
    return;  // No change if null.
  }
  if (newValue != this.value_) {
    var that = this;
    this.fieldHasChanged(this.value_, newValue, function() {
      that.value_ = newValue;
      // Look up and display the human-readable text.
      var options = that.getOptions_();
      for (var i = 0; i < options.length; i++) {
        // Options are tuples of human-readable text and language-neutral values.
        if (options[i][1] == newValue) {
          that.setText(options[i][0]);
          return;
        }
      }
      // Value not found.  Add it, maybe it will become valid once set
      // (like variable names).
      that.setText(newValue);
    });
  }
};

/**
 * Set the variable name.
 * @param {string} newValue New text.
 */
Blockly.FieldVariable.prototype.setValue = function(newValue) {
  if (newValue != this.value_) {
    var that = this;
    this.fieldHasChanged(this.value_, newValue, function() {
      that.value_ = newValue;
      that.setText(newValue);
    });
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
        // Run the validator for any side-effects it may have.
        // The validator's opinion on validity is ignored.
        field.callValidator(value);
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
