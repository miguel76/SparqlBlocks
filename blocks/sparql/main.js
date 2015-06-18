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

goog.provide('SparqlBlocks.Blocks.main');

goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Sparql');
goog.require('SparqlBlocks.Blocks.types');
var typeExt = SparqlBlocks.Blocks.types.getExtension;

//Blockly.Blocks.bgp.HUE = 120;
// Blockly.Blocks.Sparql.varType = "Var";
// Blockly.Blocks.Sparql.exprTypes = ["Var", "GraphTerm", "Number", "String"];

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#s6azf3
Blockly.Blocks['sparql_construct'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(290);
    this.appendDummyInput()
        .appendField("CONSTRUCT");
    this.appendStatementInput("CONSTRUCT")
        .setCheck("ConstructTriples");
    this.appendDummyInput()
        .appendField("WHERE");
    this.appendStatementInput("WHERE")
        .setCheck("TriplesBlock");
    this.setTooltip('');
  }
};

Blockly.Blocks['sparql_select'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(290);
    // this.appendValueInput("VAR")
    //     .setCheck(["var", "graph_term"]);

    // this.appendStatementInput("SELECT")
    //     .setCheck("VarBindings")
    //     .appendField("SELECT");
    this.appendDummyInput()
        .appendField("select all the variables");

    this.appendDummyInput()
        .appendField("and the first")
        .appendField(
            new Blockly.FieldTextInput("10"), "LIMIT")
        .appendField("rows");

    this.appendStatementInput("WHERE")
        .setCheck("TriplesBlock")
        .appendField("where");

    this.appendValueInput("ORDER_FIELD1")
        .setCheck(typeExt("Expr"))
        .appendField("ordered by");
    this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
          "ORDER_DIRECTION1");

    this.appendValueInput("ORDER_FIELD2")
        .setCheck(typeExt("Expr"))
        .appendField(", by");
    this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
          "ORDER_DIRECTION2");

    this.appendValueInput("ORDER_FIELD3")
        .setCheck(typeExt("Expr"))
        .appendField(", and by");
    this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
          "ORDER_DIRECTION3");

    // this.appendDummyInput()
    //     .appendField("ordered by");
    //
    // this.appendValueInput("ORDER_FIELD1")
    //     .setCheck(typeExt("Expr"))
    //     .appendField(
    //       new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
    //       "ORDER_DIRECTION1");
    //
    // this.appendValueInput("ORDER_FIELD2")
    //     .setCheck(typeExt("Expr"))
    //     .appendField(
    //       new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
    //       "ORDER_DIRECTION2");
    //
    // this.appendValueInput("ORDER_FIELD3")
    //     .setCheck(typeExt("Expr"))
    //     .appendField(
    //       new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
    //       "ORDER_DIRECTION3");

    this.setOutput(true, "Select");
    this.setInputsInline(true);
    // this.setNextStatement(true, "QueryClauses");
    this.setTooltip('');
  }
};

// // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#k5jv58
// Blockly.Blocks['sparql_variable'] = {
//   init: function() {
//     this.setHelpUrl('http://www.example.com/');
//     this.setColour(65);
//     this.appendDummyInput()
//         .appendField(new Blockly.FieldVariable("var"), "VARNAME");
//     this.setOutput(true, "var");
//     this.setTooltip('');
//   }
// };

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8nt67n
Blockly.Blocks['sparql_var_binding'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(330);
    this.appendValueInput("EXPR")
        .setCheck(typeExt("Expr"));
    this.appendDummyInput()
        .appendField("as")
        .appendField(new Blockly.FieldTextInput("col name"), "COLNAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "VarBindings");
    this.setNextStatement(true, "VarBindings");
    this.setTooltip('');
  }
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6ttvtd
Blockly.Blocks['sparql_prefixed_iri'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(20);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput("localName"), "LOCAL_NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Iri");
    this.setTooltip('');
  }
};

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
        var progressBlock = Blockly.Block.obtain(this.workspace, 'sparql_execution_in_progress');
        progressBlock.initSvg();
        if (connection.targetConnection) {
          var targetConnection = connection.targetConnection;
          connection.disconnect();
        }
        connection.connect(progressBlock.outputConnection);
        progressBlock.render();

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
