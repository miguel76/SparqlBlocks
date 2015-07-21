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
 * @fileoverview Main blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.exec');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');
var typeExt = SparqlBlocks.Types.getExtension;
// goog.require('SparqlBlocks.Exec');

var unconnect_ = function(connection) {
  var targetBlock = connection.targetBlock();
  if (targetBlock) {
    targetBlock.dispose();
  }
}

Blockly.Blocks['sparql_execution'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendValueInput("QUERY")
        .setCheck("Select")
        .appendField(" ⚙");
    this.appendValueInput("RESULTS")
        .setCheck("Table")
        .appendField("↪");
    this.setTooltip('');
  },
  onchange: function() {
    SparqlBlocks.Exec.blockExec(this);
  }
};

Blockly.Blocks['sparql_execution_in_progress'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("execution in progress...");
    this.setOutput(true, "Table");
    this.setTooltip('');
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
  }
};

Blockly.Blocks['sparql_execution_error'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Error executing query!");
    this.appendDummyInput()
        .appendField("Error Name")
        .appendField(new Blockly.FieldTextInput("ERROR TYPE"), "ERRORTYPE");
    this.appendDummyInput()
        .appendField("Description")
        .appendField(new Blockly.FieldTextInput("ERROR"), "ERRORDESCR");
    this.setOutput(true, "Table");
    this.setTooltip('');
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
  }
};
