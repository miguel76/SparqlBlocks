/**
 * @fileoverview Build pattern and branches from resources representing classes and properties.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var JsonToBlocks = require('./jsonToBlocks.js');

var isUpperCase = function(str) {
  return str.toLowerCase() !== str;
};

var startWithLowerCase = function(str) {
  return str ?
      (isUpperCase(str.substr(0, 1)) && !isUpperCase(str.substr(1, 1)) ?
        str.substr(0, 1).toLowerCase() + str.substr(1) :
        str) :
      null;
}

var patternFromClass = function(resource, workspace, label) {
  if (!resource) {
    return null;
  }
  var resourceBlock = JsonToBlocks.blockFromValue(resource, workspace);
  resourceBlock.setEditable(true);
  if (!label) {
    label = startWithLowerCase(resourceBlock.getFieldValue('LOCAL_NAME')) || 'instance';
  }
  var typePropBlock = workspace.newBlock('sparql_prefixed_iri');
  typePropBlock.setFieldValue('rdf', 'PREFIX');
  typePropBlock.setFieldValue('type', 'LOCAL_NAME');
  var instanceVarBlock = workspace.newBlock('variables_get');
  instanceVarBlock.setFieldValue(label, 'VAR');
  instanceVarBlock.setShadow(true);
  var typeBlock = workspace.newBlock('sparql_verb_object');
  typeBlock.getInput('VERB').connection.connect(typePropBlock.outputConnection);
  typeBlock.getInput('OBJECT').connection.connect(resourceBlock.outputConnection);
  var patternBlock = workspace.newBlock('sparql_subject_propertylist');
  patternBlock.getInput('SUBJECT').connection.connect(instanceVarBlock.outputConnection);
  patternBlock.getInput('PROPERTY_LIST').connection.connect(typeBlock.previousConnection);
  patternBlock.setCollapsed(true);
  patternBlock.initSvg();
  return patternBlock;
};

var branchFromProperty = function(resource, workspace, label) {
  if (!resource) {
    return null;
  }
  var resourceBlock = JsonToBlocks.blockFromValue(resource, workspace);
  resourceBlock.setEditable(true);
  if (!label) {
    label = startWithLowerCase(resourceBlock.getFieldValue('LOCAL_NAME')) || 'instance';
  }
  var objectVarBlock = workspace.newBlock('variables_get');
  objectVarBlock.setFieldValue(label, 'VAR');
  objectVarBlock.setShadow(true);
  var branchBlock = workspace.newBlock('sparql_verb_object');
  branchBlock.getInput('VERB').connection.connect(resourceBlock.outputConnection);
  branchBlock.getInput('OBJECT').connection.connect(objectVarBlock.outputConnection);
  branchBlock.setCollapsed(true);
  branchBlock.initSvg();
  return branchBlock;
};

module.exports = {
  patternFromClass: patternFromClass,
  branchFromProperty: branchFromProperty
};
