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
 * @fileoverview Executing SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Exec');

goog.require('SparqlBlocks.Output');
goog.require('SparqlBlocks.Sparql');

SparqlBlocks.Exec = ( function() {

  var defaultEndpointUrl_ = 'http://live.dbpedia.org/sparql';

  var sparqlExec_ = function(endpointUrl, query, callback) {
    if (!endpointUrl) {
      endpointUrl = defaultEndpointUrl_;
    }
    var queryUrl =
        endpointUrl +
        "?query=" + encodeURIComponent(query);
    return $.ajax({
      headers: {Accept: "application/sparql-results+json"},
      dataType: "json",
      method: "GET",
      url: queryUrl,
      success: function(data) {
        callback(null,data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      }
    });
  }

  var sparqlExecAndAlert_ = function(endpointUrl, query) {
    return sparqlExec_(endpointUrl, query, function(err, data) {
      if (err) {
        alert("Error: " + err);
      } else {
        alert("Results:\n" + JSON.stringify(data));
      }
    })
  }

  var sparqlExecAndBlock_ = function(endpointUrl, query, workspace, callback) {
  }

  var connect_ = function(connection, block) {
    var targetBlock = connection.targetBlock();
    if (targetBlock) {
      targetBlock.dispose();
    }
    connection.connect(block.previousConnection);
    block.render();
  }

  var unconnect_ = function(connection) {
    var targetBlock = connection.targetBlock();
    if (targetBlock) {
      targetBlock.dispose();
    }
  }

  var DESCR_LENGTH = 40;

  var sparqlExecAndPublish_ = function(endpointUrl, query, workspace, connection, callback) {

    var progressBlock = Blockly.Block.obtain(workspace, 'sparql_execution_in_progress');
    progressBlock.initSvg();
    connect_(connection, progressBlock);

    return sparqlExec_(endpointUrl, query, function(err, data) {
      var resultBlock = null;
      if (err) {
        resultBlock = Blockly.Block.obtain(workspace, 'sparql_execution_error');
        resultBlock.initSvg();
        var errorType = (err.textStatus) ? err.textStatus : "unknown problem";
        if (err.jqXHR.status) {
          errorType += " " + err.jqXHR.status;
        }
        if (err.jqXHR.statusText) {
          errorType += ": " + err.jqXHR.statusText;
        }
        resultBlock.setFieldValue(errorType, 'ERRORTYPE');
        var errorDescr = err.jqXHR.responseText;
        if (errorDescr) {
          var errorDescrShort = null;
          if (errorDescr.length > DESCR_LENGTH) {
            errorDescrShort = errorDescr.substr(0, DESCR_LENGTH - 3) + '...';
          } else {
            errorDescrShort = errorDescr;
          }
          resultBlock.setFieldValue(errorDescrShort, 'ERRORDESCR');
          resultBlock.setTooltip(errorDescr);
        }
      } else {
        resultBlock = SparqlBlocks.Output.blocksFromSelectResults(workspace, data);
      }
      connect_(connection, resultBlock);
      callback(data);
    });
  }

  var blockExec_ = function(block) {
    var resultsHolder = block.getInput('RESULTS');
    if (!resultsHolder) return;
    var resultsConnection = resultsHolder.connection;
    if (!resultsConnection) return;
    var endpointUri_txt = block.getFieldValue('ENDPOINT');
    var endpointUri = endpointUri_txt ? encodeURI(endpointUri_txt) : null;
    var queryStr = SparqlBlocks.Sparql.valueToCode(
      block,
      'QUERY',
      SparqlBlocks.Sparql.ORDER_NONE);
    if (endpointUri != block.endpointUri || queryStr != block.sparqlQueryStr) {
      block.endpointUri = endpointUri;
      block.sparqlQueryStr = queryStr;
      if (block.queryReq) {
        block.queryReq.abort();
      }
      if (queryStr) {
        console.log('Ready to execute query: ' + queryStr);
        block.resultsData = null;
        block.queryReq = SparqlBlocks.Exec.sparqlExecAndPublish(
            endpointUri, queryStr,
            block.workspace, resultsConnection,
            function(data) {
              block.queryReq = null;
              block.resultsData = data;
            } );
      } else {
        console.log('Empty query');
        block.resultsData = null;
        unconnect_(resultsConnection);
        block.queryReq = null;
      }

    }

  }

  return {
    sparqlExecAndPublish: sparqlExecAndPublish_,
    sparqlExecAndAlert: sparqlExecAndAlert_,
    blockExec: blockExec_
  };

}) ();
