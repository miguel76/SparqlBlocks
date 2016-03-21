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

goog.provide('SparqlBlocks.Blocks.table');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');

( function() {

  var typeExt = SparqlBlocks.Types.getExtension;

  SparqlBlocks.Blocks.table.HUE = 330;

  SparqlBlocks.Blocks.block('sparql_smallTable', {
    /**
     * Block for text value.
     * @this Blockly.Block
     */
    init: function() {
      this.setColour(SparqlBlocks.Blocks.table.HUE);
      this.tableInput = this.appendDummyInput("TABLEINPUT").appendField("","TABLE");
      this.setPreviousStatement(true, typeExt('Table'));
      // this.setOutput(true, 'LiteralString');
      // this.setTooltip(SparqlBlocks.Msg.TEXT_TOOLTIP);
    },
    setData: function(data) {
      this.setTable(new SparqlBlocks.FieldTable(data));
    },
    setTable: function(newTable) {
      this.tableInput.removeField("TABLE");
      this.tableInput.appendField(newTable, "TABLE");
    }


  });

  // new SparqlBlocks.FieldTable( {"head":{"link":[],"vars":["s","p","o"]},"results":{"distinct":false,"ordered":true,"bindings":[{"s":{"type":"uri","value":"http://www.openlinksw.com/virtrdf-data-formats#default-iid"},"p":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"o":{"type":"uri","value":"http://www.openlinksw.com/schemas/virtrdf#QuadMapFormat"}},{"s":{"type":"uri","value":"http://www.openlinksw.com/virtrdf-data-formats#default-iid-nullable"},"p":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"o":{"type":"uri","value":"http://www.openlinksw.com/schemas/virtrdf#QuadMapFormat"}},{"s":{"type":"uri","value":"http://www.openlinksw.com/virtrdf-data-formats#default-iid-nonblank"},"p":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"o":{"type":"uri","value":"http://www.openlinksw.com/schemas/virtrdf#QuadMapFormat"}},{"s":{"type":"uri","value":"http://www.openlinksw.com/virtrdf-data-formats#default-iid-nonblank-nullable"},"p":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"o":{"type":"uri","value":"http://www.openlinksw.com/schemas/virtrdf#QuadMapFormat"}},{"s":{"type":"uri","value":"http://www.openlinksw.com/virtrdf-data-formats#default"},"p":{"type":"uri","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"o":{"type":"uri","value":"http://www.openlinksw.com/schemas/virtrdf#QuadMapFormat"}}]}})

  SparqlBlocks.Blocks.table.loadTable = function(data) {
    var newBlock = workspace.newBlock('sparql_smallTable');
    newBlock.setData(data);
    newBlock.initSvg();
    newBlock.render();
    return newBlock;
  }

}) ();
