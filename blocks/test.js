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

goog.provide('SparqlBlocks.Blocks.test');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');

( function() {

  var typeExt = SparqlBlocks.Types.getExtension;

  SparqlBlocks.Blocks.test.HUE = 330;

  var questionState = {};

  SparqlBlocks.Blocks.block('sparql_test', {
    /**
     * Block for making a test
     * @this Blockly.Block
     */
    init: function() {
      this.setColour(SparqlBlocks.Blocks.test.HUE);
      this.setTooltip('1) Look for the right block and 2) Drop it in here');
      this.setEditable(false);
      this.setInputsInline(true);
      this.currentAnswer = null;
      this.isRightAnswer = false;
    },

    onchange: function() {
      if (this.isRightAnswer) {
        return;
      }
      var data = JSON.parse(this.data);
      if (!data) {
        return;
      }

      if (!this.getInput('ANSWER') && data.question) {
        this.appendValueInput('ANSWER').appendField(data.question);
      }

      if (data.id && questionState[data.id] && questionState[data.id].rightAnswer) {
        this.currentAnswer = questionState[data.id].rightAnswer;
        var answerConnection = this.getInput('ANSWER').connection;
        var targetBlock = answerConnection.targetBlock();
        if (targetBlock) {
          targetBlock.dispose();
        }
        var xml = Blockly.Xml.textToDom(questionState[data.id].rightAnswerXML);
        var answerBlock = Blockly.Xml.domToBlock(this.workspace, xml.firstChild);
        answerConnection.connect(answerBlock.outputConnection);
        // newBlock.render();
        answerBlock.setEditable(false);
        answerBlock.setMovable(false);
        this.isRightAnswer = true;
        this.getInput("ANSWER").appendField("⭐");
        this.appendDummyInput().appendField("⭐");
        return;
      }

      var value = SparqlBlocks.Sparql.valueToCode(
                      this,
                      'ANSWER',
                      SparqlBlocks.Sparql.ORDER_NONE);
      if (value && value != this.currentAnswer) {
        if (md5(value) === data.answerMD5) {
          SparqlBlocks.Storage.alert("⭐  Bingo! It is the right block!   ⭐", "info");
          if (!questionState[data.id]) {
            questionState[data.id] = {};
          }
          questionState[data.id].rightAnswer = value;
          var xml = goog.dom.createDom('xml');
          var answerBlock = this.getInputTargetBlock('ANSWER');
          xml.appendChild(Blockly.Xml.blockToDom(answerBlock));
          questionState[data.id].rightAnswerXML = Blockly.Xml.domToText(xml);
          this.isRightAnswer = true;
          answerBlock.setEditable(false);
          answerBlock.setMovable(false);
          this.getInput("ANSWER").appendField("⭐");
          this.appendDummyInput().appendField("⭐");
        } else {
          SparqlBlocks.Storage.alert("Sorry, wrong block. Try with another one...", "error");
        }
      }
      this.currentAnswer = value;
    }

  });


}) ();
