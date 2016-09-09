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
 * @fileoverview Type definitions for SPARQL blocks
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var typeDict = {};

var setType = function(typeStr, typeObj) {
  typeDict[typeStr] = typeObj;
  typeObj.children = [];
  if (typeObj.parents) {
    var parentStrArray = typeObj.parents;
    for (var i = 0; i < parentStrArray.length; i++) {
      var parentStr = parentStrArray[i];
      if (typeDict[parentStr]) {
        typeDict[parentStr].children.push(typeStr);
      }
    }
  }
};

var getExtension = function(typeStr) {
  var typeObj = typeDict[typeStr];
  if (!typeObj.extension) {
    var extension = [typeStr];
    if (typeObj.aliases) {
      extension = extension.concat(typeObj.aliases);
    }
    var children = typeObj.children;
    for (var i = 0; i < children.length; i++) {
      extension = extension.concat(getExtension(children[i]));
    }
    typeObj.extension = extension;
    // console.log("Type extension for " + typeStr + " : " + extension);
  }
  return typeObj.extension;
};

//setType("Anything",[]);
setType("GraphPattern", {});
setType("TriplesBlock", { parents: ["GraphPattern"] });
// Inheritance commented waiting to solve ui problems
setType("SelectQuery", { /* parents: ["GraphPattern"] */ });
setType("Bind", { parents: ["GraphPattern"] });
setType("PropertyList", {});
setType("Table", { parents: ["GraphPattern"] });

setType("Expr", {});
setType("StringExprOrLiteral", { parents: ["Expr"] });
setType("Object", {});
setType("GraphTermOrVar", { parents: ["Object", "Expr"] });
setType("Verb", {});
setType("ObjectNotLiteral", { parents: ["Object"] });
setType("RootedPropertyList", { parents: ["ObjectNotLiteral"] });
setType("ResourceOrVar", { parents: ["ObjectNotLiteral", "GraphTermOrVar"] });
setType("StringExpr", { parents: ["StringExprOrLiteral"], aliases: ["String"] });
setType("NumberExpr", { parents: ["Expr"], aliases: ["Number"] });
setType("BooleanExpr", { parents: ["Expr"], aliases: ["Boolean"] });
setType("BnodeExpr", { parents: ["Expr"] });
setType("IriExpr", { parents: ["Expr"] });
setType("AnyExpr", { parents: ["StringExpr", "NumberExpr", "BooleanExpr", "BnodeExpr", "IriExpr" ] });
setType("IriOrVar", { parents: ["ResourceOrVar", "Verb" ] });
setType("OrderByValue", {});
setType("Var", { parents: ["GraphTermOrVar", "ResourceOrVar", "IriOrVar", "AnyExpr", "OrderByValue" ] });
setType("GraphTerm", { parents: ["GraphTermOrVar" ] });
setType("Resource", { parents: ["GraphTerm", "ResourceOrVar" ] });
setType("Bnode", { parents: ["Resource", "BnodeExpr" ] });
setType("Iri", { parents: ["Resource", "IriExpr", "IriOrVar" ] });
setType("Literal", { parents: ["GraphTerm", "StringExprOrLiteral" ] });
setType("LiteralString", { parents: ["Literal", "StringExpr" ] });
setType("LiteralNumber", { parents: ["Literal", "NumberExpr" ] });
setType("LiteralBoolean", { parents: ["Literal", "BooleanExpr" ] });

module.exports = {
  setType: setType,
  getExtension: getExtension
};
