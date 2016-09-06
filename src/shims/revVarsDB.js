/**
 * @fileoverview Shim on Blockly to permit going back to user defined var names
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');

/**
 * Convert a Blockly entity name to a legal exportable entity name.
 * @param {string} name The Blockly entity name (no constraints).
 * @param {string} type The type of entity in Blockly
 *     ('VARIABLE', 'PROCEDURE', 'BUILTIN', etc...).
 * @return {string} An entity name legal for the exported language.
 */
Blockly.Names.prototype.getName = function(name, type) {
  var normalized = name.toLowerCase() + '_' + type;
  var prefix = (type == Blockly.Variables.NAME_TYPE) ?
      this.variablePrefix_ : '';
  if (normalized in this.db_) {
    return prefix + this.db_[normalized];
  }
  var safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName.substr(prefix.length);
  this.dbReverse_[safeName.substr(prefix.length)] = name;
  return safeName;
};

Blockly.Names.prototype.getUserProvidedName = function(generatedName) {
  var providedName = this.dbReverse_[generatedName];
  return providedName ? providedName : generatedName;
};
