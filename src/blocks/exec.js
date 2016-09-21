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

var _ = require('underscore'),
    Blockly = require('blockly'),
    Types = require('../core/types.js'),
    Blocks = require('../core/blocks.js'),
    Exec = require('../core/exec.js'),
    Msg = require('../core/msg.js'),
    ResourcesToPatterns = require('../core/resourcesToPatterns.js'),
    SparqlGen = require('../generators/sparql.js'),
    FileSaver = require('browser-filesaver'),
    JsonToBlocks = require('../core/jsonToBlocks.js');

require('blob-polyfill');

var typeExt = Types.getExtension;

var defaultLimit = 5;
var maxLimit = 50;

var execBlock = function(options) {
  options = _.extend({}, options);
  return {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
      var titleAndEndpointInput = null;
      if (options.title) {
        titleAndEndpointInput = this.appendDummyInput();
        titleAndEndpointInput.appendField(options.title);
      }
      if (options.endpointField) {
        // if (!titleAndEndpointInput) {
          titleAndEndpointInput = this.appendDummyInput();
        // }
        titleAndEndpointInput
            .appendField("from")
            .appendField(new Blockly.FieldTextInput(""), "ENDPOINT");
      }
      if (options.parameters && _.isArray(options.parameters)) {
        for (var i = 0; i < options.parameters.length; i++) {
          var parameter = options.parameters[i];
          if (parameter.name) {
            var input = this.appendValueInput(parameter.name);
            input.setAlign(Blockly.ALIGN_RIGHT); // or not?
            if (parameter.type) {
               input.setCheck(typeExt(parameter.type));
            }
            if (parameter.label) {
               input.appendField(parameter.label);
            }
          }
        }
      }
      this.setInputsInline(false);
      if (options.builtinQuery) {
        this.setColour(290);
        if (!options.selfLimiting) {
          this.appendDummyInput()
              .appendField("limit to first")
              .appendField(new Blockly.FieldNumber(defaultLimit, 0, maxLimit), "LIMIT")
              .appendField("rows");
        }
      } else {
        if (options.baseQuery) {
          this.setColour(290);
          // this.appendDummyInput();
          this.appendStatementInput("WHERE")
              .setCheck(typeExt("GraphPattern"))
              .appendField("where");
          Blocks.query.orderFields.init.call(this);
          this.setInputsInline(true);
        } else {
          this.setColour(330);
          this.appendStatementInput("QUERY")
              .setCheck(typeExt("SelectQuery"))
              .appendField(" ⚙");
        }
      }
      if (options.directResultsField) {
        this.appendDummyInput("RESULTS")
            .appendField("↪")
            .appendField("", "RESULTS_CONTAINER");
      } else {
        // this.appendDummyInput();
        this.appendStatementInput("RESULTS")
            .setCheck(typeExt("Table"))
            .appendField("↪");
      }

      this.setTooltip(Msg.EXECUTION_TOOLTIP);
    },
    onchange: function() {
      if (Blockly.dragMode_) {
        return;
      }
      if (!options.directResultsField && !this.resultsInput) {
        var resultsBlock = this.getInputTargetBlock("RESULTS");
        if (!resultsBlock) {
          resultsBlock = this.workspace.newBlock("sparql_execution_placeholder");
          this.getInput("RESULTS").connection.connect(resultsBlock.previousConnection);
          resultsBlock.initSvg();
          resultsBlock.render();
        }
        this.resultsInput = resultsBlock.getInput("RESULTS");
        if (!this.resultsInput) {
          return;
        }
      }
      if (options.baseQuery) {
        Blocks.query.orderFields.onchange.call(this);
      }
      if  ( !options.dontExecute &&
            !this.isInFlyout &&
            ( options.selfLimiting ||
              this.getFieldValue("LIMIT") !== null)) {
        if (options.directResultsField) {
          Exec.blockExec(this, options.extraColumns);
        } else {
          if (options.builtinQuery && _.isFunction(options.builtinQuery)) {
            var parametersDict = {};
            if (options.parameters && _.isArray(options.parameters)) {
              for (var i = 0; i < options.parameters.length; i++) {
                var parameter = options.parameters[i];
                parametersDict[parameter.name] =
                    parameter.name ?
                      SparqlGen.valueToCode(
                          this, parameter.name,
                          SparqlGen.ORDER_NONE) :
                      null;
              }
            }
            var limit = this.getFieldValue("LIMIT");
            if (limit || options.selfLimiting) {
              var limitStr = limit ? '\nLIMIT ' + limit : '';
              var sparql = options.builtinQuery(parametersDict) + limitStr;
                if (sparql) {
                  Exec.blockExecQuery(this, sparql, options.extraColumns, this.resultsInput);
                }
              }
          } else {
            Exec.blockExec(this, options.extraColumns, this, this.resultsInput);
          }
        }
      }
    },
    /**
     * Create XML to represent the number of order fields.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: Blocks.query.orderFields.mutationToDom,
    /**
     * Parse XML to restore the order fields.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: Blocks.query.orderFields.domToMutation,
    customContextMenu: function(options) {
      var thisBlock = this;
      if (this.sparqlQueryStr) {
        Blocks.insertOptionBeforeHelp(options, {
          text: "Save Query as SPARQL",
          enabled: true,
          callback: function() {
            var outputBlob = new Blob([thisBlock.sparqlQueryStr], {type : 'application/sparql-query'});
            FileSaver.saveAs(outputBlob, "query.rq" );
            if (Blockly.Events.isEnabled()) {
              var event = new Blockly.Events.Ui(null, 'download-query', null, {
                query: thisBlock.sparqlQueryStr
              });
              event.workspaceId = thisBlock.workspace.id;
              Blockly.Events.fire(event);
            }
          }
        });
        Blocks.insertOptionBeforeHelp(options, {
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
            if (Blockly.Events.isEnabled()) {
              var event = new Blockly.Events.Ui(null, 'query-on-yasgui', null, {
                query: thisBlock.sparqlQueryStr,
                endpoint: endpointUri_txt
              });
              event.workspaceId = thisBlock.workspace.id;
              Blockly.Events.fire(event);
            }
          }
        });
      }
      if (this.resultsData) {
        Blocks.insertOptionBeforeHelp(options, {
          text: "Save Results as JSON",
          enabled: true,
          callback: function() {
            var jsonString = JSON.stringify(thisBlock.resultsData);
            if (jsonString) {
              var outputBlob =
                  new Blob([jsonString], {type : 'application/sparql-results+json'});
              FileSaver.saveAs(outputBlob, "results.json" );
              if (Blockly.Events.isEnabled()) {
                var event = new Blockly.Events.Ui(null, 'download-results', null, {
                  query: thisBlock.sparqlQueryStr,
                  results: thisBlock.resultsData
                });
                event.workspaceId = thisBlock.workspace.id;
                Blockly.Events.fire(event);
              }
            }
          }
        });
      }
    }
  };
};

var DESCR_LENGTH = 40;

// var connect_ = function(connection, block) {
//   var oldBlock = connection.targetBlock();
//   if (oldBlock) {
//     oldBlock.dispose();
//   }
//   block.setDeletable(false);
//   block.setMovable(false);
//   connection.connect(block.previousConnection);
//   block.initSvg();
//   block.render();
// }
//
// var resId_ = function(block) {
//   return "" + block.id + "-result";
// }
//
// var newBlock_ = function(name, block) {
//   return block.workspace.newBlock(name, resId_(block));
// }

var setNewBlock_ = function(name, baseBlock, connection) {
  var oldBlockId = null;
  var oldBlock = connection.targetBlock();
  if (oldBlock) {
    oldBlockId = oldBlock.id;
    oldBlock.dispose();
  }
  var newBlock = baseBlock.workspace.newBlock(name, oldBlockId);
  newBlock.setDeletable(false);
  newBlock.setMovable(false);
  connection.connect(newBlock.previousConnection);
  newBlock.initSvg();
  newBlock.render();
  return newBlock;
};

var sparqlExecAndPublish_ = function(endpointUrl, query, block, connection, callback) {
  var progressBlock = setNewBlock_('sparql_execution_in_progress', block, connection);
  // progressBlock.initSvg();
  // connect_(connection, progressBlock);

  return Exec.sparqlExec(endpointUrl, query, function(err, data) {
    var resultBlock = null;
    if (err) {
      resultBlock = setNewBlock_('sparql_execution_error', block, connection);
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
      resultBlock = setNewBlock_('sparql_smallTable', block, connection);
      resultBlock.setData(data);
    }
    // connect_(connection, resultBlock);
    callback(data);
  });
};

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
      block.resultsData = null;
      block.queryReq = sparqlExecAndPublish_(
          endpointUri, queryStr,
          block,
          resConnection,
          function(data) {
            block.queryReq = null;
            block.resultsData = data;
          } );
    } else {
      block.resultsData = null;
      var phBlock = setNewBlock_('sparql_execution_placeholder', block, resConnection);
      // newBlock.initSvg();
      // connect_(resConnection, phBlock);
      block.queryReq = null;
    }

  }

};

var blockExec_ = function(block, queryBlock) {
  if (!queryBlock) {
    queryBlock = block.getInputTargetBlock('QUERY');
  }
  var queryStr = SparqlGen.sparqlQuery(queryBlock);
  blockExecQuery_(block, queryStr);
};

Blocks.block(
    'sparql_execution',
    execBlock());
Blocks.block(
    'sparql_execution_query',
    execBlock({baseQuery: true}));
Blocks.block(
    'sparql_execution_endpoint',
    execBlock({endpointField: true}));
Blocks.block(
    'sparql_execution_endpoint_query',
    execBlock({endpointField: true, baseQuery: true}));
Blocks.block(
    'sparql_execution_endpoint_fake',
    execBlock({endpointField: true, dontExecute: true}));
Blocks.block(
    'sparql_execution_endpoint_query_fake',
    execBlock({endpointField: true, baseQuery: true, dontExecute: true}));

Blocks.block(
    'sparql_builtin_classes',
    execBlock({
      endpointField: true,
      title: "search Classes",
      parameters: [
        { name: "GRAPH", type: "Resource", label: "in graph" },
        { name: "FIND", type: "StringExpr", label: "named" }],
      builtinQuery: function(params) {
        if (!params.FIND) { // if not FIND then empty query
          return "";
        }
        return  "SELECT DISTINCT * WHERE {\n" +
                (params.GRAPH ?
                "  GRAPH " + params.GRAPH + " {\n" : "") +
                "    ?class\n" +
                "      a <http://www.w3.org/2002/07/owl#Class>;\n" +
                "      <http://www.w3.org/2000/01/rdf-schema#label> ?label.\n" +
                "    FILTER(" +
                      "REGEX(?label, STR(" + params.FIND + "), 'i') " +
                      "&& (COALESCE(LANG(" + params.FIND + "),'') = ''" +
                          "|| LANGMATCHES(LANG(?label), LANG(" + params.FIND + ")))).\n" +
                (params.GRAPH ?
                "  }\n" : "") +
                "}\n" +
                "ORDER BY (STRLEN(?label)) STRLEN(COALESCE(LANG(?label),''))";
      },
      extraColumns: {
        varNames: ['pattern'],
        mappings: {
          pattern: function(binding, workspace) {
            var resource = binding['class'];
            var labelTerm = binding['label'];
            return ResourcesToPatterns.patternFromClass(
                resource, workspace, labelTerm && labelTerm.value);
          }
        }
      }
    }));

Blocks.block(
    'sparql_builtin_resources',
    execBlock({
      endpointField: true,
      title: "search Resources",
      parameters: [
        { name: "GRAPH", type: "Resource", label: "in graph" },
        { name: "TYPE", type: "Resource", label: "with type" },
        { name: "FIND", type: "StringExpr", label: "named" }],
      builtinQuery: function(params) {
        if (!params.FIND) { // if not FIND then empty query
          return "";
        }
        return  "SELECT DISTINCT * WHERE {\n" +
                (params.GRAPH ?
                "  GRAPH " + params.GRAPH + " {\n" : "") +
                "    ?resource\n" +
                (params.TYPE ?
                "      a " + params.TYPE + ";\n" : "")+
                "      <http://www.w3.org/2000/01/rdf-schema#label> ?label.\n" +
                "    FILTER(" +
                      "REGEX(?label, STR(" + params.FIND + "), 'i') " +
                      "&& (COALESCE(LANG(" + params.FIND + "),'') = ''" +
                          "|| LANGMATCHES(LANG(?label), LANG(" + params.FIND + ")))).\n" +
                (params.GRAPH ?
                "  }\n" : "") +
                "}\n" +
                "ORDER BY (STRLEN(?label)) STRLEN(COALESCE(LANG(?label),''))";
      }
    }));

Blocks.block(
  'sparql_builtin_properties',
  execBlock({
    endpointField: true,
    title: "search Properties",
    parameters: [
      { name: "GRAPH", type: "Resource", label: "in graph" },
      { name: "FROM", type: "Resource", label: "from class" },
      { name: "TO", type: "Resource", label: "to class" },
      { name: "FIND", type: "StringExpr", label: "named" }],
    builtinQuery: function(params) {
      if (!params.FIND) { // if not FIND then empty query
        return "";
      }
      return  "SELECT DISTINCT * WHERE {\n" +
              (params.GRAPH ?
              "  GRAPH " + params.GRAPH + " {\n" : "") +
              "    ?property\n" +
              "      <http://www.w3.org/2000/01/rdf-schema#label> ?label;\n" +
              "      <http://www.w3.org/2000/01/rdf-schema#domain> ?domain;\n" +
              "      <http://www.w3.org/2000/01/rdf-schema#range> ?range.\n" +
              (params.FROM ?
              "    " + params.FROM + " <http://www.w3.org/2000/01/rdf-schema#subClassOf>* ?domain.\n" : "")+
              (params.TO ?
              "    " + params.TO + " <http://www.w3.org/2000/01/rdf-schema#subClassOf>* ?range.\n" : "")+
              "    FILTER(" +
                    "REGEX(?label, STR(" + params.FIND + "), 'i') " +
                    "&& (COALESCE(LANG(" + params.FIND + "),'') = ''" +
                        "|| LANGMATCHES(LANG(?label), LANG(" + params.FIND + ")))).\n" +
              (params.GRAPH ?
              "  }\n" : "") +
              "}\n" +
              "ORDER BY (STRLEN(?label)) STRLEN(COALESCE(LANG(?label),''))";
    },
    extraColumns: {
      varNames: ['branch'],
      mappings: {
        branch: function(binding, workspace) {
          var resource = binding['property'];
          var labelTerm = binding['label'];
          return ResourcesToPatterns.branchFromProperty(
              resource, workspace, labelTerm && labelTerm.value);
        }
      }
    }
  }));

Blocks.block('sparql_execution_placeholder', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
      this.setColour(330);
      this.appendDummyInput("RESULTS")
          .appendField(Msg.EXECUTION_PLACEHOLDER, "RESULTS_CONTAINER");
      this.setPreviousStatement(true, "Table");
      this.setTooltip(Msg.EXECUTION_PLACEHOLDER_TOOLTIP);
      this.setDeletable(false);
      this.setMovable(false);
      this.setEditable(false);
    }
});

Blocks.block('sparql_execution_in_progress', {
  init: function() {
    this.setHelpUrl('http://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-operation');
    this.setColour(330);
    this.appendDummyInput()
        .appendField("execution in progress...");
    this.setPreviousStatement(true, "Table");
    this.setTooltip(Msg.EXECUTION_IN_PROGRESS_TOOLTIP);
    this.setDeletable(false);
    this.setMovable(false);
    this.setEditable(false);
  }
});

Blocks.block('sparql_execution_error', {
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
