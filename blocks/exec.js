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
 * @fileoverview Main blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.exec');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');

( function() {

  var typeExt = SparqlBlocks.Types.getExtension;
  // goog.require('SparqlBlocks.Exec');

  // "<a href="https://commons.wikimedia.org/wiki/File:Octicons-database.svg#/media/File:Octicons-database.svg">Octicons-database</a>" by GitHub - <a rel="nofollow" class="external free" href="https://github.com/github/octicons">https://github.com/github/octicons</a>. Licensed under <a href="http://opensource.org/licenses/mit-license.php" title="MIT license">MIT</a> via <a href="//commons.wikimedia.org/wiki/">Wikimedia Commons</a>.

  var dbFile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH8SURBVHjaYvz//z8DJQAggFiQOXv37mUHGugHxJH//v3TANKqQAxk/rsCpO8A6blAvDcgIOAvTA9AADHCXADUrAVkLxcVFdWTkJBg4ObmZuDi4mIAyX/8+JHh8+fPDI8ePWJ4/fr1EaBYRHBw8FOQPoAAAisA4V27du1/+PAhyLr/uMDv37//nz9//v/KlSsXwvQBBBATzClAjra4uDhBP0tLSzMALfGE8QECCB4GQEGwiS9fvmTg4OBgYGdnZ2BlZQWLffv2jeHdu3cMT58+ZVBWVgarhQGAAMIwgIWFheH9+/cMP378APP//PnD8OnTJ4afP3+C5UBiyAYABBALkhfAmJmZGewCkGIQBvobbAgssEGa//6FRwIDQABhuACkGKaJkZERrBgmxsTEhOECgADCMACmAYRBrgHxQZpBGMSHqYEBgADCMACmGKQIZgDMBTBvgtgwABBAKAaAMMx2mIHILoOp+/XrF9wAgACCpwOQAlBUAVMiOAqRASgsJCUlGYyNjRmePXuG4gKAAEJ2QcLx48dXaWpqcsvLy4MNAWkE2Q7SDErKV65cYbhw4cILoAv9YPoAAogROTcuWbJEEWhQDRAHA0OcH5QXQN4BuQyYLkAaFwNd2lNZWfkKpgcggBhxZedZs2bxAjWoAPE/oJNvFBcX/8SmDiDAAO2Un30ZkCt9AAAAAElFTkSuQmCC";
  var defaultEndpoint = "http://live.dbpedia.org/sparql";
  var execBlock = function(options) {
    return {
      init: function() {
        this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
        this.setColour(330);
        if (options && options.endpointField) {
          this.appendDummyInput()
              .appendField(new Blockly.FieldImage(dbFile, 16, 16, 'Endpoint'))
              .appendField(new Blockly.FieldTextInput(defaultEndpoint), "ENDPOINT");
        }
        this.appendStatementInput("QUERY")
            .setCheck("Select")
            .appendField(" ⚙");
        this.appendStatementInput("RESULTS")
            .setCheck("Table")
            .appendField("↪");
        this.setTooltip(SparqlBlocks.Msg.EXECUTION_TOOLTIP);
      },
      onchange: function() {
        SparqlBlocks.Exec.blockExec(this);
      },
      customContextMenu: function(options) {
        if (this.sparqlQueryStr) {
          var thisBlock = this;
          SparqlBlocks.Blocks.insertOptionBeforeHelp(options, {
            text: "Save Query as SPARQL",
            enabled: true,
            callback: function() {
              var outputBlob = new Blob([thisBlock.sparqlQueryStr], {type : 'application/sparql-query'});
              saveAs(outputBlob, "query.rq" );
            }
          });
        }
        if (this.resultsData) {
          var thisBlock = this;
          SparqlBlocks.Blocks.insertOptionBeforeHelp(options, {
            text: "Save Results as JSON",
            enabled: true,
            callback: function() {
              var jsonString = JSON.stringify(thisBlock.resultsData);
              if (jsonString) {
                var outputBlob =
                    new Blob([jsonString], {type : 'application/sparql-results+json'});
                saveAs(outputBlob, "results.json" );
              }
            }
          });
        }
      }
    };
  }

  SparqlBlocks.Blocks.block('sparql_execution', execBlock());
  SparqlBlocks.Blocks.block('sparql_execution_endpoint', execBlock({endpointField: true}));

  SparqlBlocks.Blocks.block('sparql_execution_in_progress', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
      this.setColour(330);
      this.appendDummyInput()
          .appendField("execution in progress...");
      this.setPreviousStatement(true, "Table");
      this.setTooltip(SparqlBlocks.Msg.EXECUTION_IN_PROGRESS_TOOLTIP);
      this.setDeletable(false);
      this.setMovable(false);
      this.setEditable(false);
    }
  });

  SparqlBlocks.Blocks.block('sparql_execution_error', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-failure');
      this.setColour(330);
      this.appendDummyInput()
          .appendField("Error executing query!");
      this.appendDummyInput()
          .appendField("Error Name")
          .appendField(new Blockly.FieldTextInput("ERROR TYPE"), "ERRORTYPE");
      this.appendDummyInput()
          .appendField("Description")
          .appendField(new Blockly.FieldTextInput("ERROR"), "ERRORDESCR");
      this.setPreviousStatement(true, "Table");
      this.setTooltip('');
      this.setDeletable(false);
      this.setMovable(false);
      this.setEditable(false);
    }
  });

}) ();
