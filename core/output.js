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

// (function() {

  goog.provide('SparqlBlocks.Output');
  goog.require('SparqlBlocks.Prefixes');
  goog.require('SparqlBlocks.SelfDuplication');

  var xsd_map_ = {};
  var xsd_ = function(localName) {
    var extended = xsd_map_[localName];
    if (!extended) {
      extended = "http://www.w3.org/2001/XMLSchema#" + localName;
      xsd_map_[localName] = extended;
    }
    return extended;
  }

  var blockFromTypedLiteral_ = function(value, type, workspace) {
    var typedBlock = null;
    // console.log("block for type " + type + " and value " + value);
    switch(type) {
      case xsd_("integer"):
      case xsd_("decimal"):
      case xsd_("float"):
      case xsd_("double"):
      case xsd_("byte"): // -128…+127 (8 bit)
      case xsd_("short"): // -32768…+32767 (16 bit)
      case xsd_("int"): // -2147483648…+2147483647 (32 bit)
      case xsd_("long"): // -9223372036854775808…+9223372036854775807 (64 bit)
      case xsd_("unsignedByte"): // 0…255 (8 bit)
      case xsd_("unsignedShort"): // 0…65535 (16 bit)
      case xsd_("unsignedInt"): // 0…4294967295 (32 bit)
      case xsd_("unsignedLong"): // 0…18446744073709551615 (64 bit)
      case xsd_("positiveInteger"): // Integer numbers >0
      case xsd_("nonNegativeInteger"): // Integer numbers ≥0
      case xsd_("negativeInteger"): // Integer numbers <0
      case xsd_("nonPositiveInteger"): // Integer numbers >0
        typedBlock = Blockly.Block.obtain(workspace, 'sparql_math_number');
        typedBlock.initSvg();
        typedBlock.setFieldValue(value, 'NUM');
        break;
      case xsd_("boolean"):
        typedBlock = Blockly.Block.obtain(workspace, 'sparql_logic_boolean');
        typedBlock.initSvg();
        typedBlock.setFieldValue(value, 'BOOL');
        break;
      default:
        var luRes = SparqlBlocks.Prefixes.lookForIri(type);
        if (luRes) {
          typedBlock = Blockly.Block.obtain(workspace, 'sparql_text_with_type_pref');
          typedBlock.initSvg();
          typedBlock.setFieldValue(value, 'TEXT');
          typedBlock.setFieldValue(luRes.prefix, 'DT_PREFIX');
          typedBlock.setFieldValue(luRes.localPart, 'DT_LOCAL_NAME');
        } else {
          typedBlock = Blockly.Block.obtain(workspace, 'sparql_text_with_type_iri');
          typedBlock.initSvg();
          typedBlock.setFieldValue(value, 'TEXT');
          typedBlock.setFieldValue(type, 'DT_IRI');
        }
    }
    return typedBlock;
  }

  var blockFromStringLiteral_ = function(value, workspace) {
    var strBlock = null;
    var lang = value["xml:lang"];
    var datatype = value["datatype"];
    if (lang) {
      strBlock = Blockly.Block.obtain(workspace, 'sparql_text_with_lang');
      strBlock.initSvg();
      strBlock.setFieldValue(lang, 'LANG');
    } else {
      strBlock = Blockly.Block.obtain(workspace, 'sparql_text');
      strBlock.initSvg();
    }
    strBlock.setFieldValue(value.value, 'TEXT');
    return strBlock;
  }


  var blockFromLiteral_ = function(value, workspace) {
    var datatype = value.datatype;
    if (datatype && datatype != xsd_("string") && datatype != xsd_("langString")) {
      return blockFromTypedLiteral_(value.value, datatype, workspace);
    } else {
      return blockFromStringLiteral_(value, workspace);
    }
  }

  var blockFromUri_ = function(value, workspace) {
    var iri = value.value;
    var luRes = SparqlBlocks.Prefixes.lookForIri(iri);
    if (luRes != null) {
      var prefBlock = Blockly.Block.obtain(workspace, 'sparql_prefixed_iri');
      prefBlock.initSvg();
      prefBlock.setFieldValue(luRes.prefix, 'PREFIX');
      prefBlock.setFieldValue(luRes.localPart, 'LOCAL_NAME');
      return prefBlock;
    } else {
      var uriBlock = Blockly.Block.obtain(workspace, 'sparql_iri');
      uriBlock.initSvg();
      uriBlock.setFieldValue(iri, 'IRI');
      return uriBlock;
    }
  }

  var blockFromBnode_ = function(value, workspace) {
    var bnodeLabel = value.value;
    var prefBlock = Blockly.Block.obtain(workspace, 'sparql_prefixed_iri');
    prefBlock.initSvg();
    prefBlock.setFieldValue('_', 'PREFIX');
    prefBlock.setFieldValue(bnodeLabel, 'LOCAL_NAME');
    return prefBlock;
  }

  var blockFromValue_ = function(value, workspace, connection) {
    var valueBlock = null;
    if (value) {
      switch(value.type) {
        case "literal":
        case "typed-literal":
          valueBlock = blockFromLiteral_(value, workspace);
          break;
        case "uri":
          valueBlock = blockFromUri_(value, workspace);
          break;
        case "bnode":
          valueBlock = blockFromBnode_(value, workspace);
      }
      // containerBlock.getInput('VALUE').connection;
    }
    if (valueBlock) {
      valueBlock.setDeletable(false);
      valueBlock.setMovable(false);
      valueBlock.setEditable(false);
      SparqlBlocks.SelfDuplication.bindMouseEvents(valueBlock);
      connection.connect(valueBlock.outputConnection);
      valueBlock.render();
    }
  };

  var blocksFromHeaderVar_ = function(varName, workspace, connection) {
    var colBlock = Blockly.Block.obtain(workspace, 'sparql_column');
    colBlock.initSvg();
    connection.connect(colBlock.outputConnection);
    colBlock.render();
    return colBlock;
  }

  var containerBlockFromValue_ = function(value, workspace, connection) {
    var containerBlock = Blockly.Block.obtain(workspace, 'sparql_value_container');
    containerBlock.initSvg();
    connection.connect(containerBlock.previousConnection);
    containerBlock.render();
    var innerConnection = containerBlock.getInput('VALUE').connection;
    blockFromValue_(value, workspace, innerConnection);
    return containerBlock;
  }

  var colBlockFromVar_ = function(varName, values, workspace, connection) {
    var colBlock = Blockly.Block.obtain(workspace, 'sparql_column');
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
    var tableBlock = Blockly.Block.obtain(workspace, 'sparql_table');
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


    // <block type="sparql_table">
    //   <mutation colcount="2"></mutation>
    //   <value name="COL1">
    //     <block type="sparql_column">
    //       <field name="COLNAME">type</field>
    //       <statement name="VALUES">
    //         <block type="sparql_value_container">
    //           <value name="VALUE">
    //             <block type="sparql_prefixed_iri">
    //               <field name="PREFIX">prefix</field>
    //               <field name="LOCAL_NAME">localName</field>
    //             </block>
    //           </value>
    //           <next>

// containerBlock.initSvg();
// var connection = containerBlock.getInput('STACK').connection;
// for (var i = 1; i <= this.elseifCount_; i++) {
//   var elseifBlock = Blockly.Block.obtain(workspace, 'controls_if_elseif');
//   elseifBlock.initSvg();
//   connection.connect(elseifBlock.previousConnection);
//   connection = elseifBlock.nextConnection;
// }
// if (this.elseCount_) {
//   var elseBlock = Blockly.Block.obtain(workspace, 'controls_if_else');
//   elseBlock.initSvg();
//   connection.connect(elseBlock.previousConnection);
// }
// return containerBlock;
    return tableBlock;
  }
  SparqlBlocks.Output.blocksFromSelectResults = blocksFromSelectResults_;

  var fillTableFromSelectResults_ = function(table, data) {

    // get the sparql variables from the 'head' of the data.
    var headerVars = data.head.vars;

    // using the vars, make some table headers and add them to the table;
    var trHeaders = getTableHeaders(headerVars);
    table.append(trHeaders);

    // grab the actual results from the data.
    var bindings = data.results.bindings;

    // for each result, make a table row and add it to the table.
    for(rowIdx in bindings){
      table.append(getTableRow(headerVars, bindings[rowIdx]));
    }

  }


// })();
