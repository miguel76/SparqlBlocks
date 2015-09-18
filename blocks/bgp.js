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

goog.provide('SparqlBlocks.Blocks.bgp');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');

(function () {

  var typeExt = SparqlBlocks.Types.getExtension;

  var _init = function(newBlock) {
    newBlock.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynTriples');
  }

  var _initVerb = function(newBlock) {
    _init(newBlock);
    newBlock.setColour(65);
  }

  var _initSubject = function(newBlock) {
    _init(newBlock);
    newBlock.setColour(120);
  }

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
  }

  //Blockly.Blocks.bgp.HUE = 120;

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#rh3u29
  SparqlBlocks.Blocks.block('sparql_verb_objectlist', {
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

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#dt8jdf
  SparqlBlocks.Blocks.block('sparql_verb_object', {
    init: function() {
      _initVerb(this);
      this.appendValueInput("VERB")
          .setCheck(typeExt("Verb"))
          .appendField("━┫");
      this.appendValueInput("OBJECT")
          .setCheck(typeExt("GraphTermOrVar"))
          .appendField("┣━▶");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "PropertyList");
      this.setNextStatement(true, "PropertyList");
      this.setTooltip(SparqlBlocks.Msg.VERB_OBJECT_TOOLTIP);
    }
  });

  SparqlBlocks.Blocks.block('sparql_reversePath_object', {
    init: function() {
      _initVerb(this);
      this.appendValueInput("VERB")
          .setCheck(typeExt("Resource"))
          .appendField("◀━┫");
      this.appendValueInput("OBJECT")
          .setCheck(typeExt("GraphTermOrVar"))
          .appendField("┣━");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "PropertyList");
      this.setNextStatement(true, "PropertyList");
      this.setTooltip(SparqlBlocks.Msg.REVERSEPATH_OBJECT_TOOLTIP);
    }
  });

  SparqlBlocks.Blocks.block('sparql_closurePath_object', {
    init: function() {
      _initVerb(this);
      this.appendValueInput("VERB")
          .setCheck(typeExt("Resource"))
          .appendField("━┫");
      this.appendValueInput("OBJECT")
          .setCheck(typeExt("GraphTermOrVar"))
          .appendField("┣ ✱ ━▶");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "PropertyList");
      this.setNextStatement(true, "PropertyList");
      this.setTooltip(SparqlBlocks.Msg.CLOSUREPATH_OBJECT_TOOLTIP);
    }
  });

  SparqlBlocks.Blocks.block('sparql_reverseClosurePath_object', {
    init: function() {
      _initVerb(this);
      this.appendValueInput("VERB")
          .setCheck(typeExt("Resource"))
          .appendField("◀━ ✱ ┫");
      this.appendValueInput("OBJECT")
          .setCheck(typeExt("GraphTermOrVar"))
          .appendField("┣━");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "PropertyList");
      this.setNextStatement(true, "PropertyList");
      this.setTooltip(SparqlBlocks.Msg.REVERSECLOSUREPATH_OBJECT_TOOLTIP);
    }
  });

  SparqlBlocks.Blocks.block('sparql_isa', {
    init: function() {
      _initVerb(this);
      this.appendValueInput("TYPE")
          .setCheck(typeExt("ResourceOrVar"))
          .appendField("is a");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "PropertyList");
      this.setNextStatement(true, "PropertyList");
      this.setTooltip(SparqlBlocks.Msg.ISA_TOOLTIP);
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#otezbs
  SparqlBlocks.Blocks.block('sparql_subject_propertylist', {
    init: function() {
      _initSubject(this);
      this.appendValueInput("SUBJECT")
          .setCheck(typeExt("ResourceOrVar"));
      this.appendStatementInput("PROPERTY_LIST")
          .setCheck("PropertyList")
          .appendField("  ⌊");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "TriplesBlock");
      this.setNextStatement(true, "TriplesBlock");
      this.setTooltip('');
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#otezbs
  SparqlBlocks.Blocks.block('sparql_typedsubject_propertylist', {
    init: function() {
      _initSubject(this);
      this.appendValueInput("SUBJECT")
          .setCheck(typeExt("ResourceOrVar"));
      this.appendValueInput("TYPE")
          .setCheck(typeExt("ResourceOrVar"))
          .appendField("is a");
      this.appendStatementInput("PROPERTY_LIST")
          .setCheck("PropertyList")
  //        .appendField("  ⌊");
          .appendField("  &");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "TriplesBlock");
      this.setNextStatement(true, "TriplesBlock");
      this.setTooltip(SparqlBlocks.Msg.TYPEDSUBJECT_PROPERTYLIST_TOOLTIP);
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#otezbs
  SparqlBlocks.Blocks.block('sparql_anonsubject_propertylist', {
    init: function() {
      _initSubject(this);
      this.appendStatementInput("PROPERTY_LIST")
          .setCheck("PropertyList")
          // .appendField("⭕");
          .appendField("s.t.");
      this.setInputsInline(true);
      this.setOutput(true, "Resource");
      this.setTooltip(SparqlBlocks.Msg.ANONSUBJECT_PROPERTYLIST_TOOLTIP);
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#9y53zb
  SparqlBlocks.Blocks.block('sparql_subject_verb_objectlist', {
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
      this.setPreviousStatement(true, "TriplesBlock");
      this.setNextStatement(true, "TriplesBlock");
      this.setTooltip('');
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6x98e2
  SparqlBlocks.Blocks.block('sparql_subject_verb_object', {
    init: function() {
      _initSubject(this);
      this.appendValueInput("SUBJECT")
          .setCheck(typeExt("ResourceOrVar"));
      this.appendValueInput("VERB")
          .appendField("has")
          .setCheck(typeExt("Verb"));
          // .appendField(" -[");
      this.appendValueInput("OBJECT")
          .setCheck(typeExt("GraphTermOrVar"))
          .appendField("→");
          // .appendField("]→ ");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "TriplesBlock");
      this.setNextStatement(true, "TriplesBlock");
      this.setTooltip('');
    }
  });

}) ();
