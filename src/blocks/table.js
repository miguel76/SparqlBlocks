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
 * @fileoverview SPARQL Table blocks for Blockly.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('Blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    FieldTable = require('../core/field_table.js'),
    Msg = require('../core/msg.js');

  var typeExt = Types.getExtension;

  Blocks.table.HUE = 330;

  Blocks.block('sparql_smallTable', {
    /**
     * Block for text value.
     * @this Blockly.Block
     */
    init: function() {
      this.setColour(Blocks.table.HUE);
      this.tableInput = this.appendDummyInput("TABLEINPUT").appendField("","TABLE");
      this.setPreviousStatement(true, typeExt('Table'));
      // this.setOutput(true, 'LiteralString');
      // this.setTooltip(Msg.TEXT_TOOLTIP);
    },
    setData: function(data) {
      this.setTable(new FieldTable(data));
    },
    setTable: function(newTable) {
      this.tableInput.removeField("TABLE");
      this.tableInput.appendField(newTable, "TABLE");
    }


  });

  Blocks.table.loadTable = function(data) {
    var newBlock = workspace.newBlock('sparql_smallTable');
    newBlock.setData(data);
    newBlock.initSvg();
    newBlock.render();
    return newBlock;
  }

}) ();
