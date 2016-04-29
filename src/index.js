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
// 'use strict';

require('./shims/');

var Storage = require('./core/storage.js');
var Guide = require('./core/guide.js');
var Track = require('./core/track.js');
var BlocklyDialogs = require('./core/lib-dialogs');
var WorkspaceActions = require('./core/workspaceActions.js');

// require('./generators/sparql/');

require('./blocks/logic.js');
require('./generators/sparql/logic.js');
require('./blocks/math.js');
require('./generators/sparql/math.js');
require('./blocks/text.js');
require('./generators/sparql/text.js');
require('./blocks/resources.js');
require('./generators/sparql/resources.js');
require('./blocks/variables.js');
require('./generators/sparql/variables.js');

require('./blocks/bgp.js');
require('./generators/sparql/bgp.js');
require('./blocks/control.js');
require('./generators/sparql/control.js');

require('./blocks/query.js');
require('./generators/sparql/query.js');
require('./blocks/exec.js');
require('./blocks/table.js');
require('./blocks/test.js');

module.exports = {
  Storage: Storage,
  Guide: Guide,
  Track: Track,
  WorkspaceActions: WorkspaceActions,
  BlocklyDialogs: BlocklyDialogs
};

// SparqlBlocks.Storage = Storage;
// SparqlBlocks.Guide = Guide;
// SparqlBlocks.Track = Track;
// SparqlBlocks.WorkspaceActions = WorkspaceActions;
// SparqlBlocks.BlocklyDialogs = BlocklyDialogs;
