/**
 * @fileoverview SparqlBlocks - maintaining a db of used resources
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');
var SparqlGen = require('../generators/sparql.js');
var Prefixes = require('./prefixes.js');

var NAME_TYPE = 'RESOURCE';

var saveResource = function(block) {
  if (block.isInFlyout) return;
  var resourceList = block.workspace.resourceList;
  var resourceMap = block.workspace.resourceMap;
  if (!resourceList || !resourceMap) {
    resourceList = [];
    resourceMap = {};
    block.workspace.resourceList = resourceList;
    block.workspace.resourceMap = resourceMap;
  }
  var blockId = block.id;
  var resource = resourceMap[blockId];
  if (!resource) {
    resource = {};
    resourceMap[blockId] = resource;
    resourceList.unshift(resource);
  }
  var prefix = block.getFieldValue('PREFIX');
  if (prefix) {
    resource.prefix = prefix;
    resource.localName = block.getFieldValue('LOCAL_NAME');
  } else {
    var iri = block.getFieldValue('IRI');
    if (iri) {
      resource.iri = iri;
    } else {
      resourceList.splice(resourceList.indexOf(resource), 1);
      delete resourceMap[blockId];
    }
  }
}

/**
 * Construct the blocks required by the flyout for the resource category.
 * @param {!Blockly.Workspace} workspace The workspace containing resources.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
var flyoutCategory = function(workspace) {
  var resourceList = workspace.resourceList || [];
  var xmlList = [];

  var iriEmptyBlock = document.createElement('block');
  iriEmptyBlock.setAttribute('type', 'sparql_iri');
  iriEmptyBlock.setAttribute('gap', 8);
  xmlList.push(iriEmptyBlock);

  var prefixedEmptyBlock = document.createElement('block');
  prefixedEmptyBlock.setAttribute('type', 'sparql_prefixed_iri');
  prefixedEmptyBlock.setAttribute('gap', 32);
  xmlList.push(prefixedEmptyBlock);

  var iriShown = {};
  var prefixedShown = {};

  for (var i = 0; i < resourceList.length; i++) {
    var block = null;
    var resource = resourceList[i];
    if (resource.prefix) {
      if (!prefixedShown[resource.prefix] || !prefixedShown[resource.prefix][resource.localName]) {
        block = document.createElement('block');
        block.setAttribute('type', 'sparql_prefixed_iri');

        var prefixField = document.createElement('field');
        prefixField.setAttribute('name', 'PREFIX');
        prefixField.appendChild(document.createTextNode(resource.prefix));
        block.appendChild(prefixField);

        var localNameField = document.createElement('field');
        localNameField.setAttribute('name', 'LOCAL_NAME');
        localNameField.appendChild(document.createTextNode(resource.localName));
        block.appendChild(localNameField);

        var localNameShown = prefixedShown[resource.prefix];
        if (!localNameShown) {
          localNameShown = {};
          prefixedShown[resource.prefix] = localNameShown;
        }
        localNameShown[resource.localName] = true;
      }
    } else {
      if (!iriShown[resource.iri]) {
        block = document.createElement('block');
        block.setAttribute('type', 'sparql_iri');

        var iriField = document.createElement('field');
        iriField.setAttribute('name', 'IRI');
        iriField.appendChild(document.createTextNode(resource.iri));
        block.appendChild(iriField);

        iriShown[resource.iri] = true;
      }
    }
    if (block) {
      block.setAttribute('gap', 8);
      xmlList.push(block);
    }
  }
  return xmlList;
};

var blocklyFlyoutShow = Blockly.Flyout.prototype.show;

/**
 * Show and populate the flyout.
 * @param {!Array|string} xmlList List of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
Blockly.Flyout.prototype.show = function(xmlList) {
  if (xmlList == NAME_TYPE) {
    // Special category for resources.
    xmlList = flyoutCategory(this.workspace_.targetWorkspace);
  }
  blocklyFlyoutShow.call(this, xmlList);
}

module.exports = {
  NAME_TYPE: NAME_TYPE,
  saveResource: saveResource
};
