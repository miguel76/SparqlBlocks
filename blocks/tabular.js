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
 * @fileoverview Tabular blocks for SPARQL results
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.tabular');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');
var typeExt = SparqlBlocks.Types.getExtension;

//Blockly.Blocks.bgp.HUE = 120;
// Blockly.Blocks.Sparql.varType = "Var";
// Blockly.Blocks.Sparql.exprTypes = ["Var", "GraphTerm", "Number", "String"];

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#s6azf3
SparqlBlocks.Blocks.block('sparql_column', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#sparqlQueryVariables');
    this.setColour(330);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("colName"), "COLNAME");
    this.appendStatementInput("VALUES")
        .setCheck('ValueContainer');
    this.setOutput(true, "Column");
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
    this.setTooltip('');
  }
});

SparqlBlocks.Blocks.block('sparql_value_container', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#docResultDesc');
    this.setColour(330);
    this.appendValueInput("VALUE")
        .setCheck(typeExt("GraphTerm"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, "ValueContainer");
    this.setNextStatement(true, "ValueContainer");
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip('');
  }
});

SparqlBlocks.Blocks.block('sparql_table', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#sparqlSolutions');
    this.setColour(330);
    this.setInputsInline(true);
    // this.setMutator(new Blockly.Mutator(['sparql_table_table',
    //                                      'sparql_table_column']));
    this.setOutput(true, "Table");
    this.setDeletable(false);
    this.setMovable(false);
    this.setTooltip('');
    this.colCount_ = 0;
  },
  /**
   * Create XML to represent the number of columns.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.colCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.colCount_) {
      container.setAttribute('colCount', this.colCount_);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.colCount_ = parseInt(xmlElement.getAttribute('colCount'), 10);
    for (var i = 1; i <= this.colCount_; i++) {
      this.appendValueInput('COL' + i)
          .setCheck('Column');
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'sparql_table_table');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.colCount_; i++) {
      var colBlock = Blockly.Block.obtain(workspace, 'sparql_table_column');
      colBlock.initSvg();
      connection.connect(colBlock.previousConnection);
      connection = colBlock.nextConnection;
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
    for (var i = this.colCount_; i > 0; i--) {
      this.removeInput('COL' + i);
    }
    this.colCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'sparql_table_column':
          this.colCount_++;
          var colInput = this.appendValueInput('COL' + this.colCount_)
              .setCheck('Column');
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            colInput.connection.connect(clauseBlock.valueConnection_);
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
        case 'sparql_table_column':
          var inputCol = this.getInput('COL' + i);
          clauseBlock.valueConnection_ =
            inputCol && inputCol.connection.targetConnection;
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

SparqlBlocks.Blocks.block('sparql_table_table', {
  /**
   * Mutator block for table container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField('table');
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
  }
});

SparqlBlocks.Blocks.block('sparql_table_column', {
  /**
   * Mutator bolck for column.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("column");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.contextMenu = false;
  }
});
