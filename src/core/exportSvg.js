var Blockly = require('blockly'),
    fs = require('fs'),
    FileSaver = require('browser-filesaver');

require('blob-polyfill');

// var svgDir = __dirname + '../../resources/svg';

// var svgPreamble = fs.readFileSync(svgDir + '/_preamble.svg', 'utf8');
// var svgEpilogue = fs.readFileSync(svgDir + '/_epilogue.svg', 'utf8');

var svgPreamble = fs.readFileSync(__dirname + '/../../resources/svg/_preamble.svg', 'utf8');
var svgAfterDefs = fs.readFileSync(__dirname + '/../../resources/svg/_afterDefs.svg', 'utf8');
var svgAfterStyleForStatement =
  fs.readFileSync(__dirname + '/../../resources/svg/_afterStyleForStatement.svg', 'utf8');
var svgAfterStyleForValue =
  fs.readFileSync(__dirname + '/../../resources/svg/_afterStyleForValue.svg', 'utf8');
var svgEpilogue = fs.readFileSync(__dirname + '/../../resources/svg/_epilogue.svg', 'utf8');

module.exports = function(block) {
  
  blockSvg = block.getSvgRoot().innerHTML.replace(/&nbsp;/g, '&#xa0;');

  var defDisabledId = block.workspace.options.disabledPatternId;
  var defDisabled = defDisabledId ? document.getElementById(defDisabledId) : null;
  var defDisabledSvg = defDisabled ? defDisabled.outerHTML : '';

  var style = Blockly.Css.styleSheet_.ownerNode.outerHTML;
  var svgAfterStyle = block.outputConnection ?
    svgAfterStyleForValue :
    svgAfterStyleForStatement;

  var outputBlob = new Blob(
    [svgPreamble, defDisabledSvg, svgAfterDefs, style, svgAfterStyle, blockSvg, svgEpilogue],
    {type : 'image/svg+xml'});
  FileSaver.saveAs(outputBlob, "block.svg" );

};
