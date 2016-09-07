/**
 * @fileoverview Shim on Blockly to permit breaking inline blocks using dummy inputs
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
* Return a new variable name that is not yet being used. This will try to
* generate variable names starting with the provided prefix and followed
* by a number.
 * @param {!Blockly.Workspace} workspace The workspace to be unique in.
 * @param {!prefix} Variable prefix.
* @return {string} New variable name.
*/
var generateUniqueName = function(workspace, prefix) {
  var variableList = Blockly.Variables.allVariables(workspace);
  var newName = '';
  var nameSuffix = 0;
  while (!newName) {
    var potName = '' + prefix + (nameSuffix ? nameSuffix : '');
    var inUse = false;
    for (var i = 0; i < variableList.length; i++) {
      if (variableList[i].toLowerCase() == potName) {
        // This potential name is already used.
        inUse = true;
        break;
      }
    }
    if (inUse) {
      // Try the next potential name.
      nameSuffix++;
    } else {
      // We can use the current potential name.
      newName = potName;
    }
  }
  return newName;
};

var justPrefix = function(varName) {
  return varName.substr(0, varName.length - varName.match(/[0-9]*$/)[0].length);
};

var defaultVarNamesByWorkspace = {};

/**
 * Install this dropdown on a block.
 */
Blockly.FieldVariable.prototype.init = function() {
  if (this.fieldGroup_) {
    // Dropdown has already been initialized once.
    return;
  }
  Blockly.FieldVariable.superClass_.init.call(this);
  // Variables without names (or in shadow blocks) get uniquely named for this workspace.
  var workspace =
      this.sourceBlock_.isInFlyout ?
          this.sourceBlock_.workspace.targetWorkspace :
          this.sourceBlock_.workspace;
  var newValue = null;
  var newValueGenerated = false;
  if (!this.getValue()) {
    newValue = Blockly.Variables.generateUniqueName(workspace);
    newValueGenerated = true;
  } else if (this.sourceBlock_.isShadow_ && !this.sourceBlock_.isInFlyout) {
    newValue = generateUniqueName(workspace, justPrefix(this.getValue()));
    newValueGenerated = true;
  }
  if (newValue) {
    this.value_ = newValue;
    this.setText(newValue);
  }
  // If the selected variable doesn't exist yet, create it.
  // For instance, some blocks in the toolbox have variable dropdowns filled
  // in by default.
  if (!this.sourceBlock_.isInFlyout) {
    this.sourceBlock_.workspace.createVariable(this.getValue());
    if (newValueGenerated) {
      var defaultVarNames = defaultVarNamesByWorkspace[this.sourceBlock_.workspace];
      if (!defaultVarNames) {
        defaultVarNames = [];
        defaultVarNamesByWorkspace[this.sourceBlock_.workspace] = defaultVarNames;
      }
      defaultVarNames.push(this.getValue());
    }
  }
  this.workspace_ = workspace;
};

/**
 * Dispose of all DOM objects belonging to this editable field.
 */
Blockly.FieldVariable.prototype.dispose = function() {
  var varName = this.getValue();
  var block = this.sourceBlock_;
  var workspace = this.workspace_;
  Blockly.Field.prototype.dispose.call(this);
  this.workspace_ = null;
  var defaultVarNames = workspace && defaultVarNamesByWorkspace[workspace];
  if (block && varName && workspace
      && defaultVarNames
      && defaultVarNames.indexOf(varName) != -1
      && workspace.getVariableUses(varName).length == 0) {
    workspace.deleteVariable(varName);
  }
};
