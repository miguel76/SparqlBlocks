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
 * @fileoverview Resource blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;

Blocks.block('sparql_prefixed_iri', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#prefNames');
    this.setColour(20);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "PREFIX")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput(""), "LOCAL_NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Iri");
    this.setTooltip(Msg.PREFIXED_IRI_TOOLTIP);
  }
});

Blocks.block('sparql_prefixed_iri_prop', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#prefNames');
    this.setColour(20);
    this.appendDummyInput()
        .appendField("━┫")
        .appendField(new Blockly.FieldTextInput(""), "PREFIX")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput(""), "LOCAL_NAME");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("┣━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.PREFIXED_IRI_TOOLTIP);
  }

});

Blocks.block('sparql_iri', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynIRI');
    this.setColour(20);
    this.appendDummyInput()
        .appendField("<")
        .appendField(new Blockly.FieldTextInput(""), "IRI")
        .appendField(">");
    this.setInputsInline(true);
    this.setOutput(true, "Iri");
    this.setTooltip(Msg.IRI_TOOLTIP);
  }
});

Blocks.block('sparql_iri_prop', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynIRI');
    this.setColour(20);
    this.appendDummyInput()
        .appendField("━┫")
        .appendField("<")
        .appendField(new Blockly.FieldTextInput(""), "IRI")
        .appendField(">");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("┣━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.IRI_TOOLTIP);
  }

});
