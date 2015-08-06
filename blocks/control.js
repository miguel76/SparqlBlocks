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
 * @fileoverview Control blocks for SPARQL
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.control');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');
var typeExt = SparqlBlocks.Types.getExtension;

//Blockly.Blocks.bgp.HUE = 120;

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#otezbs
SparqlBlocks.Blocks.block('sparql_filter', {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(210);
    this.appendValueInput("CONDITION")
        .setCheck(typeExt("BooleanExpr"))
        .appendField("provided that");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "TriplesBlock");
    this.setNextStatement(true, "TriplesBlock");
    this.setTooltip('');
  }
});

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#otezbs
SparqlBlocks.Blocks.block('sparql_union', {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(260);
    this.appendStatementInput("OP1")
        .setCheck("TriplesBlock");
        // .appendField("this");
    this.appendStatementInput("OP2")
        .setCheck("TriplesBlock")
        .appendField("or");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "TriplesBlock");
    this.setNextStatement(true, "TriplesBlock");
    this.setTooltip('');
  }
});

SparqlBlocks.Blocks.block('sparql_optional', {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(260);
    this.appendStatementInput("OP")
        .setCheck("TriplesBlock")
        .appendField("optionally");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "TriplesBlock");
    this.setNextStatement(true, "TriplesBlock");
    this.setTooltip('');
  }
});
