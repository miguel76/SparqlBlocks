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

( function() {

  goog.provide('SparqlBlocks.Core.exec');

  goog.require('SparqlBlocks.Core.output');

  var defaultEndpointUrl_ = 'http://live.dbpedia.org/sparql';
  // var defaultEndpointUrl_ = 'http://ldf.fi/ww1lod/sparql';

  var sparqlExec_ = function(endpointUrl, query, callback) {
    if (!endpointUrl) {
      endpointUrl = defaultEndpointUrl_;
    }
    var queryUrl = endpointUrl + "?query=" + encodeURIComponent(query);
    // console.log('queryUrl: ' + queryUrl);
    $.ajax({
      dataType: "json",
      // accepts: "application/sparql-results+json",
      url: queryUrl,
      success: function(data) {
        callback(null,data);
      },
      error: function(errorMsg) {
        callback(errorMsg);
      }
    });
  }

  var sparqlExecAndAlert_ = function(endpointUrl, query) {
    sparqlExec_(endpointUrl, query, function(err, data) {
      if (err) {
        alert("Error: " + err);
      } else {
        alert("Results:\n" + JSON.stringify(data));
      }
    })
  }
  SparqlBlocks.Core.exec.sparqlExecAndAlert = sparqlExecAndAlert_;

  var sparqlExecAndBlock_ = function(endpointUrl, query, workspace, callback) {
  }

  var connect_ = function(connection, block) {
    var targetBlock = connection.targetBlock();
    if (targetBlock) {
      targetBlock.dispose();
    }
    connection.connect(block.outputConnection);
    block.render();
  }

  var sparqlExecAndPublish_ = function(endpointUrl, query, workspace, connection) {

    var progressBlock = Blockly.Block.obtain(workspace, 'sparql_execution_in_progress');
    progressBlock.initSvg();
    connect_(connection, progressBlock);

    sparqlExec_(endpointUrl, query, function(err, data) {
      var resultBlock = null;
      if (err) {
        resultBlock = Blockly.Block.obtain(workspace, 'sparql_execution_error');
      } else {
        resultBlock = SparqlBlocks.Core.output.blocksFromSelectResults(workspace, data);
      }
      resultBlock.initSvg();
      connect_(connection, resultBlock);
    });
  }
  SparqlBlocks.Core.exec.sparqlExecAndPublish = sparqlExecAndPublish_;

}) ();
