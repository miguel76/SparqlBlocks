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
// goog.require('SparqlBlocks.Blocks.query');

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
        if (options && options.endpointField) {
          this.appendDummyInput()
          //     // .appendField(new Blockly.FieldImage(dbFile, 16, 16, 'Endpoint'))
          //     .appendField("⚙")
              .appendField("from")
              .appendField(new Blockly.FieldTextInput(defaultEndpoint), "ENDPOINT");
                  // // .appendField(new Blockly.FieldImage(dbFile, 16, 16, 'Endpoint'))
                  // .appendField("⚙")
                  // .appendField(new Blockly.FieldTextInput(defaultEndpoint), "ENDPOINT");
        }
        if (options && options.baseQuery) {
          this.setColour(290);
          // this.appendDummyInput()
          //     .appendField("select all the variables");
          this.appendStatementInput("WHERE")
              .setCheck(typeExt("GraphPattern"))
              .appendField("where");
          SparqlBlocks.Blocks.query.orderFields.init.call(this);
          this.setInputsInline(true);
          this.appendStatementInput("RESULTS")
              .setCheck(typeExt("Table"))
              .appendField("↪");
              // .appendField("", "RESULTS_CONTAINER");
        } else {
          this.setColour(330);
          this.appendStatementInput("QUERY")
              .setCheck(typeExt("SelectQuery"))
              .appendField(" ⚙");
          this.appendDummyInput("RESULTS")
              .appendField("↪")
              .appendField("", "RESULTS_CONTAINER");
        }

        this.setTooltip(SparqlBlocks.Msg.EXECUTION_TOOLTIP);
      },
      onchange: function() {
        if (options && options.baseQuery) {
          SparqlBlocks.Blocks.query.orderFields.onchange.call(this);
        }
        if (!options || !options.dontExecute) {
          if (options && options.baseQuery) {
            blockExec_(this, this);
            // SparqlBlocks.Exec.blockExec(this, this);
          } else {
            SparqlBlocks.Exec.blockExec(this);
          }
        }
      },
      /**
       * Create XML to represent the number of order fields.
       * @return {Element} XML storage element.
       * @this Blockly.Block
       */
      mutationToDom: SparqlBlocks.Blocks.query.orderFields.mutationToDom,
      /**
       * Parse XML to restore the order fields.
       * @param {!Element} xmlElement XML storage element.
       * @this Blockly.Block
       */
      domToMutation: SparqlBlocks.Blocks.query.orderFields.domToMutation,
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
          SparqlBlocks.Blocks.insertOptionBeforeHelp(options, {
            text: "Open Query in YASGUI",
            enabled: true,
            callback: function() {
              var endpointUri_txt = thisBlock.getFieldValue('ENDPOINT');
              var yasguiUrl =
                  "http://yasgui.org/#query=" +
                  encodeURIComponent(thisBlock.sparqlQueryStr) +
                  (endpointUri_txt?
                    "&endpoint=" + encodeURIComponent(endpointUri_txt):
                    "");
              window.open(yasguiUrl,'_blank');
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

  var DESCR_LENGTH = 40;

  var connect_ = function(connection, block) {
    var oldBlock = connection.targetBlock();
    if (oldBlock) {
      oldBlock.dispose();
    }
    block.setDeletable(false);
    block.setMovable(false);
    connection.connect(block.previousConnection);
    block.initSvg();
    block.render();
  }

  var sparqlExecAndPublish_ = function(endpointUrl, query, workspace, connection, callback) {

    var progressBlock = workspace.newBlock('sparql_execution_in_progress');
    // progressBlock.initSvg();
    connect_(connection, progressBlock);

    return SparqlBlocks.Exec.sparqlExec(endpointUrl, query, function(err, data) {
      var resultBlock = null;
      if (err) {
        resultBlock = workspace.newBlock('sparql_execution_error');
        // var errorType = (err.textStatus) ? err.textStatus : "unknown problem";
        // if (err.jqXHR.status) {
        //   errorType += " " + err.jqXHR.status;
        // }
        // if (err.jqXHR.statusText) {
        //   errorType += ": " + err.jqXHR.statusText;
        // }
        // resultBlock.setFieldValue(errorType, 'ERRORTYPE');
        var errorDescr = err.errorThrown; //err.jqXHR.responseText;
        if (errorDescr) {
          var errorDescrShort = null;
          if (errorDescr.length > DESCR_LENGTH) {
            errorDescrShort = errorDescr.substr(0, DESCR_LENGTH - 3) + '...';
          } else {
            errorDescrShort = errorDescr;
          }
          resultBlock.setFieldValue(errorDescrShort, 'ERRORDESCR');
          resultBlock.setTooltip(errorDescr);
        } else {
          resultBlock.setFieldValue("Unable to reach the Endpoint", 'ERRORDESCR');
          resultBlock.setTooltip("There has been an error connecting to the SPARQL Endpoint. Check the Endpoint URI. If the URI is correct, check the browser log for details.");
        }
      } else {
        resultBlock = SparqlBlocks.Blocks.table.loadTable(data);
      }
      connect_(connection, resultBlock);
      callback(data);
    });
  }

  var blockExecQuery_ = function(block, queryStr) {
    var resInput = block.getInput('RESULTS');
    if (!resInput) return;
    var resConnection = resInput.connection;
    if (!resConnection) return;
    var endpointUri_txt = block.getFieldValue('ENDPOINT');
    var endpointUri = endpointUri_txt ? encodeURI(endpointUri_txt) : null;
    if (endpointUri != block.endpointUri || queryStr != block.sparqlQueryStr) {
      block.endpointUri = endpointUri;
      block.sparqlQueryStr = queryStr;
      if (block.queryReq) {
        block.queryReq.abort();
      }
      if (queryStr) {
        console.log('Ready to execute query: ' + queryStr);
        block.resultsData = null;
        block.queryReq = sparqlExecAndPublish_(
            endpointUri, queryStr,
            block.workspace,
            resConnection,
            function(data) {
              block.queryReq = null;
              block.resultsData = data;
            } );
      } else {
        console.log('Empty query');
        block.resultsData = null;
        var phBlock = block.workspace.newBlock('sparql_execution_placeholder');
        // newBlock.initSvg();
        connect_(resConnection, phBlock);
        block.queryReq = null;
      }

    }

  }

  var blockExec_ = function(block, queryBlock) {
    if (!queryBlock) {
      queryBlock = block.getInputTargetBlock('QUERY');
    }
    var queryStr = SparqlBlocks.Sparql.sparqlQuery(queryBlock);
    blockExecQuery_(block, queryStr);
  }

  SparqlBlocks.Blocks.block(
      'sparql_execution',
      execBlock());
  SparqlBlocks.Blocks.block(
      'sparql_execution_query',
      execBlock({baseQuery: true}));
  SparqlBlocks.Blocks.block(
      'sparql_execution_endpoint',
      execBlock({endpointField: true}));
  SparqlBlocks.Blocks.block(
      'sparql_execution_endpoint_query',
      execBlock({endpointField: true, baseQuery: true}));
  SparqlBlocks.Blocks.block(
      'sparql_execution_endpoint_fake',
      execBlock({endpointField: true, dontExecute: true}));

  SparqlBlocks.Blocks.block('sparql_execution_placeholder', {
      init: function() {
        this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
        this.setColour(330);
        this.appendDummyInput()
            .appendField(" < results will appear here > ");
        this.setPreviousStatement(true, "Table");
        this.setTooltip(SparqlBlocks.Msg.EXECUTION_PLACEHOLDER_TOOLTIP);
        this.setDeletable(false);
        this.setMovable(false);
        this.setEditable(false);
      }
  });

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
          .appendField(" * Error executing query! * ");
      // this.appendDummyInput()
      //     .appendField("Error Name")
      //     .appendField(new Blockly.FieldTextInput("ERROR TYPE"), "ERRORTYPE");
      this.appendDummyInput()
          // .appendField("Description")
          .appendField(new Blockly.FieldTextInput("ERROR"), "ERRORDESCR");
      this.setPreviousStatement(true, "Table");
      this.setTooltip('');
      this.setDeletable(false);
      this.setMovable(false);
      this.setEditable(false);
    }
  });

}) ();
