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
 * @fileoverview BGP blocks for SPARQL
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;

var _init = function(newBlock) {
  newBlock.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynTriples');
};

var _initVerb = function(newBlock) {
  _init(newBlock);
  newBlock.setColour(65);
};

var _initSubject = function(newBlock) {
  _init(newBlock);
  newBlock.setColour(120);
};

var _varsInScopeFromInput = function(block, inputName) {
  var inputConnection = block.getInputConnection(inputName);
  if (inputConnection) {
    var inputBlock = inputName.targetBlock;
    if (inputBlock) {
      var varsInScope = inputBlock.varsInScope();
      if (varsInScope) {
        return varsInScope;
      }
    }
  }
  return [];
};

Blocks.block('sparql_verb_objectlist', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Verb"));
    //     .appendField("-[");
    // this.appendDummyInput()
    //     .appendField("]");
    this.appendStatementInput("OBJECT")
        .setCheck("ObjectList")
        .appendField("↳");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip('');
  },
  getVarsInScope: function() {
    return _.union(
        _varsInScopeFromInput(this, "VERB"),
        _varsInScopeFromInput(this, "OBJECT"));
  }
});

Blocks.block('sparql_verb_object', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Verb"))
        // .appendField("━┫");
        .appendField("━");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        // .appendField("┣━▶(");
        .appendField("━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.VERB_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_any_verb_object', {
  init: function() {
    _initVerb(this);
    this.appendDummyInput()
        .appendField("━▶ ◯");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.VERB_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_variable_verb_object', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        // .appendField("┣━▶(");
        .appendField("━")
        .appendField(new Blockly.FieldVariable(), "VAR")
        .appendField("━▶");
    // this.appendDummyInput()
    //     .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.VERB_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_reversePath_object', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Iri"))
        .appendField("◀━┫");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("ObjectNotLiteral"))
        .appendField("┣━");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.REVERSEPATH_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_closurePath_object', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Iri"))
        .appendField("━┫");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("┣ ✱ ━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.CLOSUREPATH_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_reverseClosurePath_object', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Iri"))
        .appendField("◀━ ✱ ┫");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("ObjectNotLiteral"))
        .appendField("┣━");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.REVERSECLOSUREPATH_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_isa', {
  init: function() {
    _initVerb(this);
    this.appendValueInput("TYPE")
        .setCheck(typeExt("ObjectNotLiteral"))
        .appendField("is a");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.ISA_TOOLTIP);
  }
});

Blocks.block('sparql_subject_propertylist', {
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ObjectNotLiteral"));
        // .appendField("(");
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList");
        // .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip('');
  }
});

Blocks.block('sparql_variable_subject_propertylist', {
  init: function() {
    this.setColour(330);
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList")
        .appendField(new Blockly.FieldVariable(), "VAR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip('');
  }
});

Blocks.block('sparql_typedsubject_propertylist', {
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ResourceOrVar"));
    this.appendValueInput("TYPE")
        .setCheck(typeExt("ObjectNotLiteral"))
        .appendField("is a");
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList")
//        .appendField("  ⌊");
        .appendField("  &");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.TYPEDSUBJECT_PROPERTYLIST_TOOLTIP);
  }
});

Blocks.block('sparql_anonsubject_propertylist', {
  init: function() {
    _initSubject(this);
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList");
        // .appendField("✱");
        // .appendField("◯");
        // .appendField("s.t.");
    this.setInputsInline(true);
    this.setOutput(true, typeExt("RootedPropertyList"));
    this.setTooltip(Msg.ANONSUBJECT_PROPERTYLIST_TOOLTIP);
  }
});

Blocks.block('sparql_subject_verb_objectlist', {
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ResourceOrVar"));
    this.appendValueInput("VERB")
        .appendField("has")
        .setCheck(typeExt("Verb"));
//        .appendField(" -[");
    // this.appendDummyInput()
    //     .appendField("]");
    this.appendStatementInput("OBJECT_LIST")
        .setCheck("ObjectList")
        .appendField("↳");
//        .appendField("               ↳");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip('');
  }
});
