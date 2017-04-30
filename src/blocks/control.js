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

var Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;

Blocks.block('sparql_filter', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#scopeFilters');
    this.setColour(210);
    this.appendValueInput("CONDITION")
        .setCheck(typeExt("BooleanExpr"))
        .appendField("filter");
        // .appendField("provided that");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("GraphPattern"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.FILTER_TOOLTIP);
  }
});

Blocks.block('sparql_union', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#alternatives');
    this.setColour(260);
    this.appendStatementInput("OP1")
        .setCheck(typeExt("GraphPattern"));
        // .appendField("this");
    this.appendDummyInput().appendField("union");
    this.appendStatementInput("OP2")
        .setCheck(typeExt("GraphPattern"));
        // .appendField("union");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("GraphPattern"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.UNION_TOOLTIP);
  }
});

// The generator is currently not working, do not use!!!
Blocks.block('sparql_union1', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#alternatives');
    this.setColour(260);
    this.appendDummyInput().appendField("union");
    this.appendStatementInput("OP")
        .setCheck(typeExt("GraphPattern"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("GraphPattern"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.UNION_TOOLTIP);
  }
});

Blocks.block('sparql_optional', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#optionals');
    this.setColour(260);
    this.appendStatementInput("OP")
        .setCheck(typeExt("GraphPattern"))
        .appendField("optional");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("GraphPattern"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.OPTIONAL_TOOLTIP);
  }
});

Blocks.block('sparql_graph', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#optionals');
    this.setColour(260);
    this.appendValueInput("GRAPHNAME")
        .setCheck(typeExt("ResourceOrVar"))
        .appendField("choose graph");
    this.appendDummyInput();
    this.appendStatementInput("OP")
        .setCheck(typeExt("GraphPattern"))
        .appendField("");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("GraphPattern"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.GRAPH_TOOLTIP);
  }
});
