'use strict';

var _ = require('underscore');

var Blockly = require('../../lib/blockly_compressed');

Blockly.Msg = _.extend(require('../../lib/i18n/en'), Blockly.Msg);
Blockly.Msg = Blockly.Msg();

module.exports = Blockly;
