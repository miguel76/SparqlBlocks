/**
 * @fileoverview Shim on Blockly to fix a bug when dynamically creating fields
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly'),
    _ = require('underscore');

/**
 * Add an item to the end of the input's field row.
 * @param {string|!Blockly.Field} field Something to add as a field.
 * @param {string=} opt_name Language-neutral identifier which may used to find
 *     this field again.  Should be unique to the host block.
 * @return {!Blockly.Input} The input being append to (to allow chaining).
 */
Blockly.Input.prototype.appendField = function(field, opt_name) {
  // Empty string, Null or undefined generates no field, unless field is named.
  if (!field && !opt_name) {
    return this;
  }
  // Generate a FieldLabel when given a plain text field.
  if (_.isString(field)) {
    field = new Blockly.FieldLabel(/** @type {string} */ (field));
  }
  field.setSourceBlock(this.sourceBlock_);
  if (this.sourceBlock_.rendered) {
    field.init(this.sourceBlock_);
  }
  field.name = opt_name;

  if (field.prefixField) {
    // Add any prefix.
    this.appendField(field.prefixField);
  }
  // Add the field to the field row.
  this.fieldRow.push(field);
  if (field.suffixField) {
    // Add any suffix.
    this.appendField(field.suffixField);
  }

  if (this.sourceBlock_.rendered) {
    this.sourceBlock_.render();
    // Adding a field will cause the block to change shape.
    this.sourceBlock_.bumpNeighbours_();
  }
  return this;
};
