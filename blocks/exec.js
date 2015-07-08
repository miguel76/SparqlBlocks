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

goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Sparql');
goog.require('SparqlBlocks.Blocks.types');
var typeExt = SparqlBlocks.Blocks.types.getExtension;
goog.require('SparqlBlocks.Core.exec');

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
    var queryStr = SparqlBlocks.Sparql.valueToCode(
      this,
      'QUERY',
      SparqlBlocks.Sparql.ORDER_NONE);
    if ((!queryStr && !this.sparqlQueryStr) || queryStr != this.sparqlQueryStr) {
      this.sparqlQueryStr = queryStr;
      if (queryStr) {
        console.log('Ready to execute query: ' + queryStr);
        var connection = this.getInput('RESULTS').connection;
        SparqlBlocks.Core.exec.sparqlExecAndPublish(
            null, queryStr,
            this.workspace, connection);

        // var blocks = this.rootBlock_.getDescendants();
        // for (var i = 0, child; child = blocks[i]; i++) {
        //   child.render();
        // }
        // // The root block should not be dragable or deletable.
        // this.rootBlock_.setMovable(false);
        // this.rootBlock_.setDeletable(false);
        // var margin = this.workspace_.flyout_.CORNER_RADIUS * 2;
        // var x = this.workspace_.flyout_.width_ + margin;
        // if (this.block_.RTL) {
        //   x = -x;
        // }
        // this.rootBlock_.moveBy(x, margin);

      } else {
        console.log('Empty query');
      }

    }
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
  }
};

Blockly.Blocks['sparql_execution_error'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Error executing query!");
    this.setOutput(true, "Table");
    this.setTooltip('');
  }
};
