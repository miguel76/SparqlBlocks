/**
 * @fileoverview Order by & limit blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');
var Types = require('../core/types');
var typeExt = Types.getExtension;

var defaultLimit = 5;
var maxLimit = 50;

var setOrderField = function(queryBlock, index, lastField) {
  var inputName = 'ORDER_FIELD' + index;
  var labelFieldName = 'ORDER_LABEL' + index;
  var dirFieldName = 'ORDER_DIRECTION' + index;
  var oldDirValue = queryBlock.getFieldValue(dirFieldName);
  var input = queryBlock.getInput(inputName);
  if (input) {
    input.removeField(dirFieldName);
    input.removeField(labelFieldName);
  } else {
    input = queryBlock.appendValueInput(inputName)
                      .setCheck(typeExt("Expr"));
    queryBlock.moveInputBefore(inputName, "AFTER_ORDER");
  }
  var dirField = new Blockly.FieldDropdown([["◢", "ASC"], ["◣", "DESC"]]);
  if (oldDirValue) dirField.setValue(oldDirValue);
  input.appendField(
      index > 1 ?
          (index > 2 ? ", " : "") + (lastField ? "and " : "") + "then by" :
          "order by",
      labelFieldName);
  input.appendField(dirField, dirFieldName);
};

module.exports = {
  init: function() {
      this.orderFieldCount_ = 1;

      this.appendDummyInput("AFTER_ORDER")
          .appendField("  limit to first")
          .appendField(new Blockly.FieldNumber(defaultLimit, 0, maxLimit), "LIMIT")
          .appendField("rows");

      setOrderField(this, this.orderFieldCount_, true);
  },
  onchange: function() {
    // Dynamically add or remove order fields as needed
    var lastOrderInput = this.getInput('ORDER_FIELD' + this.orderFieldCount_);
    var lastOrderConnection = lastOrderInput && lastOrderInput.connection.targetConnection;
    if (lastOrderConnection) { // last order item is connected
      if (this.orderFieldCount_ > 1) {
        setOrderField(this, this.orderFieldCount_, false);
      }
      this.orderFieldCount_++;
      setOrderField(this, this.orderFieldCount_, true);
    } else if (this.orderFieldCount_ > 1) {
      while ( this.orderFieldCount_ > 1 &&
              !(this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1))
                    .connection.targetConnection)) {
        this.removeInput('ORDER_FIELD' + this.orderFieldCount_);
        this.orderFieldCount_--;
      }
      setOrderField(this, this.orderFieldCount_, true);
    }
  },
  /**
   * Create XML to represent the number of order fields.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('order_field_count', this.orderFieldCount_);
    return container;
  },
  /**
   * Parse XML to restore the order fields.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.orderFieldCount_ = parseInt(xmlElement.getAttribute('order_field_count'), 10);
    for (var i = 2; i <= this.orderFieldCount_; i++) {
      var inputName = 'ORDER_FIELD' + i;
      var labelFieldName = 'ORDER_LABEL' + i;
      var dirFieldName = 'ORDER_DIRECTION' + i;
      var dirField = new Blockly.FieldDropdown([["◢", "ASC"], ["◣", "DESC"]]);
      this.appendValueInput(inputName)
          .setCheck(typeExt("Expr"))
          .appendField(
            (i > 2 ? ", " : "") + "and then by",
            labelFieldName)
          .appendField(dirField, dirFieldName);
      this.moveInputBefore(inputName, "AFTER_ORDER");
    }
  }
};
