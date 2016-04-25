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

module.exports = {
  init: function() {
      this.orderFieldCount_ = 1;

      this.appendValueInput("ORDER_FIELD1")
          .setCheck(typeExt("Expr"))
          .appendField("order by", "ORDER_LABEL1")
          .appendField(
            new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
            "ORDER_DIRECTION1");

      this.appendDummyInput("AFTER_ORDER")
          .appendField("& limit to first")
          .appendField(
            new Blockly.FieldTextInput(
              "" + defaultLimit,
              Blockly.FieldTextInput.nonnegativeIntegerValidator),
            "LIMIT")
          .appendField("rows");
  },
  onchange: function() {
    // Check and correct limit field if over max
    var limit = this.getFieldValue('LIMIT');
    if (limit > maxLimit) {
      this.setFieldValue('' + maxLimit, 'LIMIT');
    }

    // Dynamically add or remove order fields as needed
    var lastOrderInput = this.getInput('ORDER_FIELD' + this.orderFieldCount_);
    var lastOrderConnection = lastOrderInput && lastOrderInput.connection.targetConnection;
    if (lastOrderConnection) { // last order item is connected
      if (this.orderFieldCount_ > 1) {
        var inputName = 'ORDER_FIELD' + this.orderFieldCount_;
        var labelFieldName = 'ORDER_LABEL' + this.orderFieldCount_;
        var dirFieldName = 'ORDER_DIRECTION' + this.orderFieldCount_;
        var input = this.getInput(inputName);
        var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
        dirField.setValue(this.getFieldValue(dirFieldName));
        input.removeField(dirFieldName);
        input.removeField(labelFieldName);
        input.appendField(", then by", labelFieldName);
        input.appendField(dirField, dirFieldName);
      }
      this.orderFieldCount_++;
      var inputName = 'ORDER_FIELD' + this.orderFieldCount_;
      this.appendValueInput(inputName)
          .setCheck(typeExt("Expr"))
          .appendField((this.orderFieldCount_ > 2 ? ", " : "") + "and then by",
                       "ORDER_LABEL" + this.orderFieldCount_)
          .appendField(
            new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
            'ORDER_DIRECTION' + this.orderFieldCount_);
      this.moveInputBefore(inputName, "AFTER_ORDER");
    } else if (this.orderFieldCount_ > 1) {
      var lastButOneOrderInput =
          this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1));
      if (lastButOneOrderInput &&
          !lastButOneOrderInput.connection.targetConnection) {
        this.removeInput('ORDER_FIELD' + this.orderFieldCount_);
        this.orderFieldCount_--;
        while ( this.orderFieldCount_ > 1
                && !(this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1))
                         .connection.targetConnection)) {
          this.removeInput('ORDER_FIELD' + (this.orderFieldCount_ - 1));
          this.orderFieldCount_--;
        }
        lastButOneOrderInput.name = 'ORDER_FIELD' + this.orderFieldCount_;
        var labelFieldName = 'ORDER_LABEL' + this.orderFieldCount_;
        var dirFieldName = 'ORDER_DIRECTION' + this.orderFieldCount_;
        var prevLabelFieldName = lastButOneOrderInput.fieldRow[0].name;
        var prevDirFieldName = lastButOneOrderInput.fieldRow[1].name;
        var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
        dirField.setValue(this.getFieldValue(prevDirFieldName));
        lastButOneOrderInput.removeField(prevDirFieldName);
        lastButOneOrderInput.removeField(prevLabelFieldName);
        lastButOneOrderInput.appendField(
              this.orderFieldCount_ > 1 ?
                (this.orderFieldCount_ > 2 ? ", " : "") + "and then by" :
                "order by",
              labelFieldName);
        lastButOneOrderInput.appendField(dirField, dirFieldName);
      }
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
      var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
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
