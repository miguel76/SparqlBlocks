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
 * @fileoverview SparqlBlocks - transformation from json result formats to blocks
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');
var SparqlGen = require('../generators/sparql.js');
var Prefixes = require('./prefixes.js');

var xsd_map_ = {};
var xsd_ = function(localName) {
  var extended = xsd_map_[localName];
  if (!extended) {
    extended = "http://www.w3.org/2001/XMLSchema#" + localName;
    xsd_map_[localName] = extended;
  }
  return extended;
};

var blockFromTypedLiteral_ = function(value, type, workspace) {
  var typedBlock = null;
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
      typedBlock = workspace.newBlock('sparql_math_number');
      typedBlock.initSvg();
      typedBlock.setFieldValue(value, 'NUM');
      break;
    case xsd_("boolean"):
      typedBlock = workspace.newBlock('sparql_logic_boolean');
      typedBlock.initSvg();
      typedBlock.setFieldValue(value, 'BOOL');
      break;
    default:
      var luRes = Prefixes.lookForIri(type);
      if (luRes) {
        typedBlock = workspace.newBlock('sparql_text_with_type_pref');
        typedBlock.initSvg();
        typedBlock.setFieldValue(value, 'TEXT');
        typedBlock.setFieldValue(luRes.prefix, 'DT_PREFIX');
        typedBlock.setFieldValue(luRes.localPart, 'DT_LOCAL_NAME');
      } else {
        typedBlock = workspace.newBlock('sparql_text_with_type_iri');
        typedBlock.initSvg();
        typedBlock.setFieldValue(value, 'TEXT');
        typedBlock.setFieldValue(type, 'DT_IRI');
      }
  }
  return typedBlock;
};

var blockFromStringLiteral_ = function(value, workspace) {
  var strBlock = null;
  var lang = value["xml:lang"];
  var datatype = value.datatype;
  if (lang) {
    strBlock = workspace.newBlock('sparql_text_with_lang');
    strBlock.initSvg();
    strBlock.setFieldValue(lang, 'LANG');
  } else {
    strBlock = workspace.newBlock('sparql_text');
    strBlock.initSvg();
  }
  strBlock.setFieldValue(value.value, 'TEXT');
  return strBlock;
};


var blockFromLiteral_ = function(value, workspace) {
  var datatype = value.datatype;
  if (datatype && datatype != xsd_("string") && datatype != xsd_("langString")) {
    return blockFromTypedLiteral_(value.value, datatype, workspace);
  } else {
    return blockFromStringLiteral_(value, workspace);
  }
};

var blockFromUri_ = function(value, workspace) {
  var iri = value.value;
  var luRes = Prefixes.lookForIri(iri);
  if (luRes) {
    var prefBlock = workspace.newBlock('sparql_prefixed_iri');
    prefBlock.initSvg();
    prefBlock.setFieldValue(luRes.prefix, 'PREFIX');
    prefBlock.setFieldValue(luRes.localPart, 'LOCAL_NAME');
    return prefBlock;
  } else {
    var uriBlock = workspace.newBlock('sparql_iri');
    uriBlock.initSvg();
    uriBlock.setFieldValue(iri, 'IRI');
    return uriBlock;
  }
};

var blockFromBnode_ = function(value, workspace) {
  var bnodeLabel = value.value;
  var prefBlock = workspace.newBlock('sparql_prefixed_iri');
  prefBlock.initSvg();
  prefBlock.setFieldValue('_', 'PREFIX');
  prefBlock.setFieldValue(bnodeLabel, 'LOCAL_NAME');
  return prefBlock;
};

var blockFromValue_ = function(value, workspace) {
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
  valueBlock.setEditable(false);
  return valueBlock;
};

var blockFromVar_ = function(varName, workspace) {
  var varBlock = workspace.newBlock('variables_get');
  varBlock.initSvg();
  varBlock.setFieldValue(
      SparqlGen.variableDB_ ?
          SparqlGen.variableDB_.getUserProvidedName(varName) :
          varName, 'VAR');
  varBlock.setEditable(false);
  return varBlock;
};

var selfDuplicatingBlockFromValue_ = function(value, workspace) {
  var valueBlock = blockFromValue_(value, workspace);
  setAsSelfDuplicating_(valueBlock, workspace);
  return valueBlock;
};

var selfDuplicatingBlockFromVar_ = function(varName, workspace) {
  var varBlock = blockFromVar_(varName, workspace);
  setAsSelfDuplicating_(varBlock, workspace);
  return varBlock;
};

var setAsSelfDuplicating_ = function(valueBlock, workspace) {
  if (valueBlock) {
    valueBlock.setDeletable(false);
    valueBlock.setMovable(false);
    valueBlock.setEditable(false);
    var duplicateBlock = null;
    valueBlock.tooltip = "tooltip";
    valueBlock.tooltipHoverMs = 1;
    valueBlock.showTooltip = function() {
      var xmlBlock = Blockly.Xml.blockToDom_(valueBlock);
      xmlBlock.removeAttribute("editable");
      xmlBlock.removeAttribute("movable");
      xmlBlock.removeAttribute("deletable");
      duplicateBlock = Blockly.Xml.domToBlock(xmlBlock, workspace);
      duplicateBlock.isInFlyout = true;
      duplicateBlock.hideTooltip = function() {
        if (duplicateBlock) {
          duplicateBlock.dispose();
        }
      };
      Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_ = duplicateBlock;
      var mousedownEvent = Blockly.bindEvent_(
          duplicateBlock.getSvgRoot(),
          'mousedown', null,
          function(e) {
            if (Blockly.isRightButton(e)) {
              // Right-click.  Don't create a block, let the context menu show.
              return;
            }
            if (duplicateBlock.disabled) {
              // Beyond capacity.
              return;
            }
            duplicateBlock.isInFlyout = false;
            Blockly.unbindEvent_(mousedownEvent);
            duplicateBlock.hideTooltip = null;
            Blockly.Tooltip.hide();
            duplicateBlock.onMouseDown_(e);
            duplicateBlock = null;
          }
        );
      var xy = valueBlock.getRelativeToSurfaceXY();
      duplicateBlock.moveBy(xy.x, xy.y);
      duplicateBlock.select();
    };
    valueBlock.hideTooltip = function() {
      if (duplicateBlock) {
        duplicateBlock.dispose();
      }
    };
  }
};

module.exports = {
  blockFromValue: blockFromValue_,
  blockFromVar: blockFromVar_,
  selfDuplicatingBlockFromValue: selfDuplicatingBlockFromValue_,
  selfDuplicatingBlockFromVar: selfDuplicatingBlockFromVar_
};
