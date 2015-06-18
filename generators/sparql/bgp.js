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
 * @fileoverview Generating Sparql for bgps.
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Sparql.bgp');

goog.require('SparqlBlocks.Sparql');


SparqlBlocks.Sparql['sparql_verb_object'] = function(block) {
  var value_verb = SparqlBlocks.Sparql.valueToCode(block, 'VERB', SparqlBlocks.Sparql.ORDER_ATOMIC);
  var value_object = SparqlBlocks.Sparql.valueToCode(block, 'OBJECT', SparqlBlocks.Sparql.ORDER_ATOMIC);
  var code =
      value_verb ?
        ( value_verb + ' ' +
          (value_object ? value_object : '[]') +
          SparqlBlocks.Sparql.STMNT_BRK ) :
        '';
  return code;
};


SparqlBlocks.Sparql['sparql_typedsubject_propertylist'] = function(block) {
  var value_subject =
      SparqlBlocks.Sparql.valueToCode(
          block,
          'SUBJECT',
          SparqlBlocks.Sparql.ORDER_ATOMIC);// || '[]';
  var value_type =
      SparqlBlocks.Sparql.valueToCode(
          block,
          'TYPE',
          SparqlBlocks.Sparql.ORDER_ATOMIC);
  var statements_property_list =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'PROPERTY_LIST'),
          ';\n');
  var code =
      (value_type || statements_property_list != '') ?
          ( (value_subject ? value_subject : '[]') +
            (value_type ?
                ' a ' + value_type + (statements_property_list != '' ? ';' : '') :
                '' ) +
            (statements_property_list != '' ?
                '\n' + statements_property_list :
                '' ) +
            SparqlBlocks.Sparql.STMNT_BRK) :
          '';
  return code;
};

var generateAnonSubject = function(value_type, statements_property_list) {
  var code =
      (value_type || statements_property_list != '') ?
          '[\n' +
          (value_type ?
                ' a ' + value_type + (statements_property_list != '' ? ';\n' : '') :
                '' ) +
          (statements_property_list != '' ?
                statements_property_list :
                '' ) +
          '\n]' :
          '[]';
  return [code, SparqlBlocks.Sparql.ORDER_ATOMIC];
}

SparqlBlocks.Sparql['sparql_anontypedsubject_propertylist'] = function(block) {
  var value_type =
      SparqlBlocks.Sparql.valueToCode(
          block,
          'TYPE',
          SparqlBlocks.Sparql.ORDER_ATOMIC);
  var statements_property_list =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'PROPERTY_LIST'),
          ';\n');
  return generateAnonSubject(value_type, statements_property_list);
};

SparqlBlocks.Sparql['sparql_anonsubject_propertylist'] = function(block) {
  var statements_property_list =
      SparqlBlocks.Sparql.stmJoin(
          SparqlBlocks.Sparql.statementToCode(block, 'PROPERTY_LIST'),
          ';\n');
  return generateAnonSubject(null, statements_property_list);
};
