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
 * @fileoverview Defines the blocks used in SparqlBlocks to represent SPARQL
 *  Basic Graph Patterns (BGPs).
 *  They include two main groups of blocks: the BGP blocks and the branch blocks.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Msg = require('../core/msg.js');

var typeExt = Types.getExtension;

/**
 * Set the help URL, the same for every one of these blocks.
 * @param {newBlock} Blockly.Block
 */
var _init = function(newBlock) {
  newBlock.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynTriples');
};

/**
 * Set the block colour, for the branch blocks.
 * @param {newBlock} Blockly.Block
 */
var _initVerb = function(newBlock) {
  _init(newBlock);
  newBlock.setColour(65);
};

/**
 * Set the block colour, for the BGP blocks.
 * @param {newBlock} Blockly.Block
 */
var _initSubject = function(newBlock) {
  _init(newBlock);
  newBlock.setColour(120);
};


/**
 * Get the variables in scope in an inner block.
 * Currently not used!!!!
 * @param {block} Blockly.Block
 * @param {inputName} String name of the input connection
 */
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
  /**
   * Branch block consisting of a single verb (a predicate) followed by a list
   * of objects.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Verb"));
    this.appendStatementInput("OBJECT")
        .setCheck("ObjectList")
        .appendField("↳");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip('');
  }
});

Blocks.block('sparql_verb_object', {
  /**
   * Branch block consisting of a single verb (a predicate) followed by a single
   * object.
   * @this Blockly.Block
   */
  init: function() {
    _initVerb(this);
    this.appendValueInput("VERB")
        .setCheck(typeExt("Verb"))
        .appendField("━");
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.VERB_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_any_verb_object', {
  /**
   * Branch block consisting of an anonymous verb (predicate) followed by an
   * anonymous object.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Branch block consisting of a single verb (a predicate) that is always a
   * variable, followed by a single object.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
  init: function() {
    _initVerb(this);
    this.appendValueInput("OBJECT")
        .setCheck(typeExt("Object"))
        .appendField("━")
        .appendField(new Blockly.FieldVariable(), "VAR")
        .appendField("━▶");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "PropertyList");
    this.setNextStatement(true, "PropertyList");
    this.setTooltip(Msg.VERB_OBJECT_TOOLTIP);
  }
});

Blocks.block('sparql_reversePath_object', {
  /**
   * Branch block consisting of a reverse path (in-going edge) with a single
   * verb (predicate) that must be an IRI (restriction from SPARQL property
   * paths) and a subject.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Branch block consisting of a "star-path", i.e. the transitive closure of a
   * property. It has a single verb (predicate) that must be an IRI (restriction
   * from SPARQL property paths) and an object.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Branch block consisting of a reverse "star-path", i.e. the inverse of the
   * transitive closure of a property. It has a single verb (predicate) that must be an IRI (restriction
   * from SPARQL property paths) and a subject.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Branch block consisting of a type associated with the current subject.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Basic Graph Pattern block consisting of a single subject followed by a list
   * of branches.
   * @this Blockly.Block
   */
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ObjectNotLiteral"));
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip('');
  }
});

Blocks.block('sparql_variable_subject_propertylist', {
  /**
   * Basic Graph Pattern block consisting of a single subject, which is a
   * variable, followed by a list of branches.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
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
  /**
   * Basic Graph Pattern block consisting of a single subject associated to a
   * type and followed by a list of branches.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ResourceOrVar"));
    this.appendValueInput("TYPE")
        .setCheck(typeExt("ObjectNotLiteral"))
        .appendField("is a");
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList")
        .appendField("  &");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip(Msg.TYPEDSUBJECT_PROPERTYLIST_TOOLTIP);
  }
});

Blocks.block('sparql_anonsubject_propertylist', {
  /**
   * Basic Graph Pattern block consisting of a single anonymous subject followed
   * by a list of branches.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
  init: function() {
    _initSubject(this);
    this.appendStatementInput("PROPERTY_LIST")
        .setCheck("PropertyList");
    this.setInputsInline(true);
    this.setOutput(true, typeExt("RootedPropertyList"));
    this.setTooltip(Msg.ANONSUBJECT_PROPERTYLIST_TOOLTIP);
  }
});

Blocks.block('sparql_subject_verb_objectlist', {
  /**
   * Basic Graph Pattern block consisting of a single subject and a single verb
   * (a predicate) followed by a list of objects.
   * Note: currently not used in the standard toolbox.
   * @this Blockly.Block
   */
  init: function() {
    _initSubject(this);
    this.appendValueInput("SUBJECT")
        .setCheck(typeExt("ResourceOrVar"));
    this.appendValueInput("VERB")
        .appendField("has")
        .setCheck(typeExt("Verb"));
    this.appendStatementInput("OBJECT_LIST")
        .setCheck("ObjectList")
        .appendField("↳");
    this.setInputsInline(true);
    this.setPreviousStatement(true, typeExt("TriplesBlock"));
    this.setNextStatement(true, typeExt("GraphPattern"));
    this.setTooltip('');
  }
});
