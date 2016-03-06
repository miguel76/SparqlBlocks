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
 * @fileoverview SparqlBlocks queries output generation.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Output');
goog.require('SparqlBlocks.Tooltip');
goog.require('SparqlBlocks.JsonToBlocks');

SparqlBlocks.Output = (function() {

  var blocksFromHeaderVar_ = function(varName, workspace, connection) {
    var colBlock = workspace.newBlock('sparql_column');
    colBlock.initSvg();
    connection.connect(colBlock.outputConnection);
    colBlock.render();
    return colBlock;
  }

  var containerBlockFromValue_ = function(value, workspace, connection) {
    var containerBlock = workspace.newBlock('sparql_value_container');
    containerBlock.initSvg();
    connection.connect(containerBlock.previousConnection);
    containerBlock.render();
    var innerConnection = containerBlock.getInput('VALUE').connection;
    var valueBlock =
        SparqlBlocks.JsonToBlocks.selfDuplicatingBlockFromValue(value, workspace);
    innerConnection.connect(valueBlock.outputConnection);
    valueBlock.render();
    return containerBlock;
  }

  var colBlockFromVar_ = function(varName, values, workspace, connection) {
    var colBlock = workspace.newBlock('sparql_column');
    colBlock.initSvg();
    colBlock.setFieldValue(varName, 'COLNAME');
    connection.connect(colBlock.outputConnection);
    colBlock.render();
    var currConnection = colBlock.getInput('VALUES').connection;
    values.forEach( function(value) {
      var contBlock = containerBlockFromValue_(value, workspace, currConnection);
      currConnection = contBlock.nextConnection;
    });
    return colBlock;
  }

  var blocksFromSelectResults_ = function(workspace, data) {
    console.log('data: ' + JSON.stringify(data));
    var tableBlock = workspace.newBlock('sparql_table');
    tableBlock.initSvg();
    var headerVars = data.head.vars;
    var bindings = data.results.bindings;
    var colNum = headerVars.length;
    for (var colIndex = 0; colIndex < colNum; colIndex++) {
      tableBlock
          .appendValueInput('COL' + (colIndex + 1))
          .setCheck('Column');
      var colConnection = tableBlock.getInput('COL' + (colIndex + 1)).connection;
      var varName = headerVars[colIndex];
      var column = colBlockFromVar_(
        varName,
        bindings.map( function(binding) { return binding[varName]; } ),
        workspace, colConnection );
    }
    tableBlock.colCount_ = colNum;
    tableBlock.resultsData = data;
    return tableBlock;
  }

  return {
    blocksFromSelectResults: blocksFromSelectResults_
  }

})();
