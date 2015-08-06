/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.tuple');

// goog.require('Blockly.Blocks');
// goog.require('SparqlBlocks.Blocks');
var typeExt = SparqlBlocks.Types.getExtension;

SparqlBlocks.Blocks.block('sparql_tuple', {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(330);
    this.appendValueInput('VAL0')
        .setCheck(typeExt('Resource'));
    this.setPreviousStatement(true,'Tuple');
    this.setNextStatement(true,'Tuple');
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    this.setTooltip('');
    this.valCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.valCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.valCount_) {
      container.setAttribute('valCount', this.valCount_);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.valCount_ = parseInt(xmlElement.getAttribute('valCount'), 10);
    for (var i = 1; i <= this.valCount_; i++) {
      this.appendValueInput('VAL' + i)
          .setCheck(typeExt('Resource'));
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'sparql_tuple_tuple');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.valCount_; i++) {
      var valBlock = Blockly.Block.obtain(workspace, 'sparql_tuple_value');
      valBlock.initSvg();
      connection.connect(valBlock.previousConnection);
      connection = valBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect all the col input blocks and remove the inputs.
    for (var i = this.valCount_; i > 0; i--) {
      this.removeInput('VAL' + i);
    }
    this.valCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'col':
          this.valCount_++;
          var valInput = this.appendValueInput('VAL' + this.valCount_)
              .setCheck(typeExt('Resource'));
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            valInput.connection.connect(clauseBlock.valueConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'sparql_tuple_value':
          var inputVal = this.getInput('VAL' + i);
          clauseBlock.valueConnection_ =
              inputVal && inputVal.connection.targetConnection;
          i++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
});

SparqlBlocks.Blocks.block('sparql_tuple_tuple', {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField('tuple');
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
  }
});

SparqlBlocks.Blocks.block('sparql_tuple_value', {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("value");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.contextMenu = false;
  }
});
