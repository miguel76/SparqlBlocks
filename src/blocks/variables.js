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
 * @fileoverview SPARQL Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

Blocks.variables.HUE = 330;

Blocks.block('sparql_variable', {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {

    // this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blocks.variables.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(), "VAR");
    this.setOutput(true, "Var");
    this.setTooltip('');
    // this.appendDummyInput()
    //     .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
    //     .appendField(new Blockly.FieldVariable(
    //     Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
    //     .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    // this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    // this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    // this.contextMenuType_ = 'variables_set';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  }
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  // customContextMenu: function(options) {
  //   var option = {enabled: true};
  //   var name = this.getFieldValue('VAR');
  //   option.text = this.contextMenuMsg_.replace('%1', name);
  //   var xmlField = goog.dom.createDom('field', null, name);
  //   xmlField.setAttribute('name', 'VAR');
  //   var xmlBlock = goog.dom.createDom('block', null, xmlField);
  //   xmlBlock.setAttribute('type', this.contextMenuType_);
  //   option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
  //   options.push(option);
  // }
});

Blockly.Blocks['variables_get'] = Blockly.Blocks['sparql_variable']
Blockly.Blocks['variables_set'] = null;
