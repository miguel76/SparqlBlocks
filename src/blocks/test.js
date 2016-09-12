/**
 * @license
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
 * @fileoverview SPARQL Test blocks for Blockly.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    WorkspaceActions = require('../core/workspaceActions.js'),
    Storage = require('../core/storage.js'),
    ResourcesToPatterns = require('../core/resourcesToPatterns.js'),
    FieldTable = require('../core/field_table.js'),
    SparqlGen = require('../generators/sparql.js'),
    md5 = require('js-md5'),
    MessageDisplay = require('../core/messageDisplay.js');

var rdfType = '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>';

var typeExt = Types.getExtension;

var HUE = 330;

var questionState = null;

var initQuestionState = function() {
  if (!questionState) {
    questionState = {};
  }
};

exports.getState = function() {
  return questionState;
};

var testBlock = function(options) {
  options = options || {};
  return {
    /**
     * Block for making a test
     * @this Blockly.Block
     */
    init: function() {
      initQuestionState();
      this.setColour(HUE);
      this.setTooltip('1) Look for the right block and 2) Drop it in here');
      this.addedVarNames = [];
      // this.appendDummyInput()
      //     .appendField(questionField, "QUESTION");
      var answerValueInput = this.appendValueInput('ANSWER')
      if (options.index) {
        var indexField = new Blockly.FieldLabel("");
        indexField.EDITABLE = true; // trick to enable serialization
        answerValueInput.appendField(indexField, "INDEX");
      }
      if (options.prefix) {
        answerValueInput.appendField(options.prefix, "PREFIX");
      }
      var questionField = new Blockly.FieldLabel("");
      questionField.EDITABLE = true; // trick to enable serialization
      answerValueInput.appendField(questionField, "QUESTION");
      var nextInput = null;
      if (options.classPattern) {
        this.hasClassPattern = true;
        this.addedVarNames.push('pattern');
        var lastInput = this.appendStatementInput('PATTERN')
                            .setCheck(typeExt("TriplesBlock"));
        nextInput = nextInput || lastInput;
      }
      if (options.propertyBranch) {
        this.hasPropertyBranch = true;
        this.addedVarNames.push('branch');
        var lastInput = this.appendStatementInput('BRANCH')
                            .setCheck(typeExt("PropertyList"));
        nextInput = nextInput || lastInput;
      }
      if (!nextInput) {
        nextInput = this.appendDummyInput('LAST_INPUT');
      }
      this.nextInput = nextInput;
      this.setInputsInline(true);
      // this.currentAnswer = null;
      this.isRightAnswer = false;
      this.check();
    },
    check: function() {
      var id = this.getFieldValue('INDEX');
      if (id && questionState[id] && questionState[id].rightAnswer
          && !this.getInput('ANSWER_TABLE')) {
        var rightAnswer = questionState[id].rightAnswer;
        var rightAnswerLabel = questionState[id].rightAnswerLabel;
        this.isRightAnswer = true;
        var indexBackup = this.getFieldValue('INDEX');
        var questionBackup = this.getFieldValue('QUESTION');
        WorkspaceActions.execute(function() {

          this.removeInput('ANSWER');
          if (this.hasClassPattern) {
            this.removeInput('PATTERN');
          }
          if (options.propertyBranch) {
            this.removeInput('BRANCH');
          }
          if (this.getInput('LAST_INPUT')) {
            this.removeInput('LAST_INPUT');
          }

          var resultField = new FieldTable({
            head: { vars: ['resource'] },
            results: {
              bindings: [
                {
                  'resource': {
                    type: 'uri',
                    value: rightAnswer.substr(1, rightAnswer.length-2)
                  }
                }
              ]
            }
          }, {
            varNames: this.addedVarNames,
            mappings: {
              pattern: function(binding, workspace) {
                return ResourcesToPatterns.patternFromClass(binding['resource'], workspace, rightAnswerLabel);
              },
              branch: function(binding, workspace) {
                return ResourcesToPatterns.branchFromProperty(binding['resource'], workspace, rightAnswerLabel);
              }
            }
          }, true);

          var answerTableInput = this.appendDummyInput("ANSWER_TABLE")

          if (options.index) {
            var indexField = new Blockly.FieldLabel(indexBackup);
            indexField.EDITABLE = true; // trick to enable serialization
            answerTableInput.appendField(indexField, "INDEX");
          }
          if (options.prefix) {
            answerTableInput.appendField(options.prefix, "PREFIX");
          }
          var questionField = new Blockly.FieldLabel(questionBackup);
          questionField.EDITABLE = true; // trick to enable serialization
          answerTableInput.appendField(questionField, "QUESTION");

          answerTableInput.appendField('⭐')
              .appendField(resultField, "ANSWER")
              .appendField('⭐');

        }, this);
        return;
      }
    },
    onchange: function() {
      if (Blockly.dragMode_) {
        return;
      }

      if (this.isRightAnswer) { // && this.getInputTargetBlock('ANSWER')) {
        return;
      }
      var data = JSON.parse(this.data);
      if (!data) {
        return;
      }

      this.check();

      var id = this.getFieldValue('INDEX');
      var value = SparqlGen.valueToCode(
                      this,
                      'ANSWER',
                      SparqlGen.ORDER_NONE);
      var answerBlock = this.getInputTargetBlock('ANSWER');
      var label = null;

      if (!value) {
        var patternBlock = this.getInputTargetBlock('PATTERN');
        if (patternBlock) {
          var subjectBlock = patternBlock.getInputTargetBlock('SUBJECT');
          if (subjectBlock && subjectBlock.type === 'variables_get') {
            label = subjectBlock.getFieldValue('VAR');
            if (label) {
              var propertyList = patternBlock.getInputTargetBlock('PROPERTY_LIST');
              if (propertyList) {
                if (SparqlGen.valueToCode(propertyList, 'VERB', SparqlGen.ORDER_NONE) === rdfType) {
                  value = SparqlGen.valueToCode(propertyList, 'OBJECT', SparqlGen.ORDER_NONE);
                  answerBlock = patternBlock;
                }
              }
            }
          }
        }
      }

      if (!value) {
        var branchBlock = this.getInputTargetBlock('BRANCH');
        if (branchBlock) {
          var objectBlock = branchBlock.getInputTargetBlock('OBJECT');
          if (objectBlock && objectBlock.type === 'variables_get') {
            label = objectBlock.getFieldValue('VAR');
            if (label) {
              value = SparqlGen.valueToCode(branchBlock, 'VERB', SparqlGen.ORDER_NONE);
              answerBlock = branchBlock;
            }
          }
        }
      }

      if (value && md5(value) === data.answerMD5) {
        MessageDisplay.alert("⭐  Bingo! It is the right block!   ⭐", "info");
        if (!questionState[id]) {
          questionState[id] = {};
        }
        questionState[id].rightAnswer = value;
        if (label) {
          questionState[id].rightAnswerLabel = label;
        }
        answerBlock.dispose();
        this.check();
      } else if (answerBlock) {
        answerBlock.unplug();
        MessageDisplay.alert("Sorry, wrong block. Try with another one...", "error");
      }
    }
  };
};

Blocks.block('sparql_test', testBlock({
  index: true
}));
Blocks.block('sparql_test_resource', testBlock({
  index: true,
  prefix: 'Resource for'
}));
Blocks.block('sparql_test_class', testBlock({
  index: true,
  classPattern: true,
  prefix: 'Class/Pattern for'
}));
Blocks.block('sparql_test_property', testBlock({
  index: true,
  propertyBranch: true,
  prefix: 'Property/Branch for'
}));
