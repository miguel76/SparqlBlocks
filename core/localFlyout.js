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
 * @fileoverview Local, single block, flyout
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.LocalFlyout');

SparqlBlocks.LocalFlyout = (function() {

  var flyout_ = {};

  var init_ = function(workspace) {
    var workspaceOptions = {
      parentWorkspace: workspace,
      RTL: workspace.RTL,
      svg: workspace.options.svg
    };
    /**
     * @type {!Blockly.Flyout}
     * @private
     */
    flyout_[workspace] = new Blockly.Flyout(workspaceOptions);
    goog.dom.insertSiblingAfter(flyout_[workspace].createDom(), workspace.svgGroup_);
    flyout_[workspace].init(workspace);
  }

  var showAt_ = function(workspace, blockXml, posX, posY) {
    if (!flyout_[workspace]) {
      init_(workspace);
    }
    // flyout_[workspace].position();
    flyout_[workspace].workspace_.translate(posX, posY);
    flyout_[workspace].show([blockXml]);
  }

  return {
    showAt: showAt_
  };

// dispose

// this.flyout_.dispose();

})();
