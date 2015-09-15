/**
 * @license
 *
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
 * @fileoverview Core JavaScript library for SparqlBlocks.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

// Top level object for SparqlBlocks.
goog.provide('SparqlBlocks');

// SparqlBlocks core dependencies.
// goog.require('Blockly');
goog.require('SparqlBlocks.Exec');
goog.require('SparqlBlocks.Output');
goog.require('SparqlBlocks.Prefixes');
goog.require('SparqlBlocks.Tooltip');
goog.require('SparqlBlocks.Types');
goog.require('SparqlBlocks.Storage');

goog.require('SparqlBlocks.Blocks');
goog.require('SparqlBlocks.Blocks.bgp');
goog.require('SparqlBlocks.Blocks.control');
goog.require('SparqlBlocks.Blocks.exec');
goog.require('SparqlBlocks.Blocks.logic');
goog.require('SparqlBlocks.Blocks.main');
goog.require('SparqlBlocks.Blocks.math');
goog.require('SparqlBlocks.Blocks.tabular');
goog.require('SparqlBlocks.Blocks.text');
goog.require('SparqlBlocks.Blocks.tuple');
goog.require('SparqlBlocks.Blocks.variables');

goog.require('SparqlBlocks.Sparql.bgp');
goog.require('SparqlBlocks.Sparql.control');
goog.require('SparqlBlocks.Sparql.logic');
goog.require('SparqlBlocks.Sparql.main');
goog.require('SparqlBlocks.Sparql.math');
goog.require('SparqlBlocks.Sparql.text');
