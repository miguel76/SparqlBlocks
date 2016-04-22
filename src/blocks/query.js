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
 * @fileoverview Query blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('Blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../msg/en.json'),
    orderFields = require('./order_fields.js');

var typeExt = Types.getExtension;

Blocks.block('sparql_construct', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#construct');
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
});

Blocks.block('sparql_select', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#select');
    this.setColour(290);
    // this.appendValueInput("VAR")
    //     .setCheck(["var", "graph_term"]);

    // this.appendStatementInput("SELECT")
    //     .setCheck("VarBindings")
    //     .appendField("SELECT");
    this.appendDummyInput()
        .appendField("select all the variables");

    this.appendStatementInput("WHERE")
        .setCheck(typeExt("GraphPattern"))
        .appendField("where");

    orderFields.init.call(this);

    // this.setOutput(true, "Select");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("SelectQuery"));
    this.setTooltip(Msg.SELECT_TOOLTIP);
  },
  saveQueryAsSparql: function() {
    var sparqlFragment = Sparql.blockToCode(this);
    if (sparqlFragment) {
      var outputBlob = new Blob([sparqlFragment], {type : 'application/sparql-query'});
      saveAs(outputBlob, "query.rq" );
    }
  },
  customContextMenu: function(options) {
    var thisBlock = this;
    Blocks.insertOptionBeforeHelp(options, {
      text: "Save Query as SPARQL",
      enabled: true,
      callback: function() {
        thisBlock.saveQueryAsSparql();
      }
    });
  },
  onchange: function() {
    // If it is a subquery, add next statement connection
    var prevTargetConnection = this.previousConnection.targetConnection;
    if (prevTargetConnection) {
      var check = prevTargetConnection.check_;
      if (check && check.indexOf("GraphPattern") != -1) {
        if (!this.nextConnection) {
          this.setNextStatement(true, typeExt("GraphPattern"));
        }
      } else {
        if (this.nextConnection) {
          this.setNextStatement(false);
        }
      }
    } else {
      if (this.nextConnection) {
        if (!this.nextConnection.targetConnection) {
          this.setNextStatement(false);
          this.setPreviousStatement(true, "SelectQuery");
        } else {
          this.setPreviousStatement(true, "GraphPattern");
        }
      }
    }

    // Dynamically add or remove order fields as needed
    orderFields.onchange.call(this);
  },
  /**
   * Create XML to represent the number of order fields.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: orderFields.mutationToDom,
  /**
   * Parse XML to restore the order fields.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: orderFields.domToMutation
});

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8nt67n
Blocks.block('sparql_var_binding', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#selectExpressions');
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
});

Blocks.query = {orderFields: orderFields};
