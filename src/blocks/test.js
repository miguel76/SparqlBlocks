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
    Storage = require('../core/storage.js');

var typeExt = Types.getExtension;

var HUE = 330;

var questionState = null;

var initQuestionState = function() {
  if (!questionState) {
    questionState = {};
  }get
}

exports.getState = function() {
  return questionState;
};

var fixAsRightAnswer = function(questionBlock, answerBlock) {
  answerBlock.setEditable(false);
  if (!questionBlock.isRightAnswer) {
    answerBlock.setTooltip('Looks like you have found the right answer!');
    questionBlock.setTooltip('Looks like you have found the right answer!');
    questionBlock.getInput("ANSWER").appendField("⭐");
    questionBlock.appendDummyInput().appendField("⭐");
    questionBlock.isRightAnswer = true;
  }
}

Blocks.block('sparql_test', {
  /**
   * Block for making a test
   * @this Blockly.Block
   */
  init: function() {
    initQuestionState();
    this.setColour(HUE);
    this.setTooltip('1) Look for the right block and 2) Drop it in here');
    var questionField = new Blockly.FieldLabel("");
    questionField.EDITABLE = true; // trick to enable serialization
    this.appendValueInput('ANSWER')
        .appendField(questionField, "QUESTION");
    this.setInputsInline(true);
    this.currentAnswer = null;
    this.isRightAnswer = false;
  },

  onchange: function() {
    if (Blockly.dragMode_) {
      return;
    }

    if (this.isRightAnswer && this.getInputTargetBlock('ANSWER')) {
      return;
    }
    var data = JSON.parse(this.data);
    if (!data) {
      return;
    }

    if (data.id && questionState[data.id] && questionState[data.id].rightAnswer) {
      this.currentAnswer = questionState[data.id].rightAnswer;
      WorkspaceActions.execute(function() {
        var answerConnection = this.getInput('ANSWER').connection;
        var targetBlock = answerConnection.targetBlock();
        if (targetBlock) {
          targetBlock.dispose();
        }
        var xml = Blockly.Xml.textToDom(questionState[data.id].rightAnswerXML);
        var answerBlock = Blockly.Xml.domToBlock(xml.firstChild, this.workspace);
        answerConnection.connect(answerBlock.outputConnection);
        fixAsRightAnswer(this, answerBlock);
      }, this);
      return;
    }

    var value = Sparql.valueToCode(
                    this,
                    'ANSWER',
                    Sparql.ORDER_NONE);
    if (value && value != "" && value != this.currentAnswer) {
      if (md5(value) === data.answerMD5) {
        Storage.alert("⭐  Bingo! It is the right block!   ⭐", "info");
        if (!questionState[data.id]) {
          questionState[data.id] = {};
        }
        questionState[data.id].rightAnswer = value;
        var xml = goog.dom.createDom('xml');
        var answerBlock = this.getInputTargetBlock('ANSWER');
        xml.appendChild(Blockly.Xml.blockToDom(answerBlock));
        questionState[data.id].rightAnswerXML = Blockly.Xml.domToText(xml);
        fixAsRightAnswer(this, answerBlock);
      } else {
        var answerBlock = this.getInputTargetBlock('ANSWER');
        answerBlock.unplug();
        Storage.alert("Sorry, wrong block. Try with another one...", "error");
      }
    }
    this.currentAnswer = value;
  }

});
