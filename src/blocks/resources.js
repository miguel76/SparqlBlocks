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
    Msg = require('../core/msg.js'),
    Prefixes = require('../core/prefixes.js'),
    Resources = require('../core/resources.js');

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
  },
  onchange: function(e) {
    Resources.saveResource(this);
  }
});

Blocks.block('sparql_prefixed_iri_prop', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#prefNames');
    this.setColour(65);
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("━")
        // .appendField("━┫")
        .appendField(new Blockly.FieldTextInput(""), "PREFIX")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput(""), "LOCAL_NAME")
        // .appendField("┣━▶");
        .appendField("━▶");
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
    this.appendDummyInput('RESOURCE')
        .appendField("<")
        .appendField(new Blockly.FieldTextInput(""), "IRI")
        .appendField(">");
    this.setInputsInline(true);
    this.setOutput(true, "Iri");
    this.setTooltip(Msg.IRI_TOOLTIP);
  },
  usesPrefix_ : function() {
    return !!this.getField('PREFIX');
  },
  onchange: function(e) {
    if (e.blockId == this.id && !this.usesPrefix_() && e.recordUndo
        && e.type == Blockly.Events.CHANGE && e.element == 'field') {
      var luRes = Prefixes.lookForIri(e.newValue);
      if (luRes) {
        var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
        this.removeInput('RESOURCE');
        this.appendDummyInput('RESOURCE')
            .appendField(new Blockly.FieldTextInput(luRes.prefix), "PREFIX")
            .appendField(":")
            .appendField(new Blockly.FieldTextInput(luRes.localPart), "LOCAL_NAME");
        var newMutation = Blockly.Xml.domToText(this.mutationToDom());
        var mutationEvent = new Blockly.Events.Change(
                this, 'mutation', null, oldMutation, newMutation);
        var changePrefixEvent = new Blockly.Events.Change(
                this, 'field', 'PREFIX', '', luRes.prefix);
        var changeLocalEvent = new Blockly.Events.Change(
                this, 'field', 'LOCAL_NAME', '', luRes.localPart);
        mutationEvent.group = e.group;
        changePrefixEvent.group = e.group;
        changeLocalEvent.group = e.group;
        Blockly.Events.fire(mutationEvent);
        Blockly.Events.fire(changePrefixEvent);
        Blockly.Events.fire(changeLocalEvent);
      }
    }
    Resources.saveResource(this);
  },
  /**
   * Create XML to represent if it is in prefix form.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('uses_prefix', this.usesPrefix_());
    return container;
  },
  /**
   * Parse XML to restore or not the prefix form.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var attrUsesPrefix = xmlElement.getAttribute('uses_prefix')
    if (attrUsesPrefix && attrUsesPrefix == 'true' && !this.usesPrefix_()) {
      this.removeInput('RESOURCE');
      this.appendDummyInput('RESOURCE')
          .appendField(new Blockly.FieldTextInput(''), 'PREFIX')
          .appendField(':')
          .appendField(new Blockly.FieldTextInput(''), 'LOCAL_NAME');
    } else if (this.usesPrefix_()) {
      this.removeInput('RESOURCE');
      this.appendDummyInput('RESOURCE')
          .appendField('<')
          .appendField(new Blockly.FieldTextInput(''), 'IRI')
          .appendField('>');
    }
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
