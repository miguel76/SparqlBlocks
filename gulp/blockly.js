'use strict';

var gulp = require('gulp'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert');

var blocklyDir = "./blockly";
var mediaDistDir = "./dist/media";

gulp.task('blockly', function() {
  return gulp.src(blocklyDir + "/blockly_compressed.js")
      .pipe(replace(/goog\.global\s*=\s*this;/, 'goog.global=that;'))
      // .pipe(replace(/goog\.Timer\.defaultTimerObject/, 'window'))
      // .pipe(insert.wrap('var DOMParser = require("xmldom").DOMParser; var XMLSerializer = require("xmldom").XMLSerializer; module.exports = (function(){  var that = {}; that.navigator=""; ', ' return Blockly;})()'))
      .pipe(insert.wrap(
        'module.exports = (function(){  var that = {}; that.navigator=""; ',
        ' goog.Timer.defaultTimerObject = window; ' +
        ' return Blockly;})()'))
      .pipe(gulp.dest('lib'));
});

gulp.task('blocklyMsgEn', function() {
  return gulp.src(blocklyDir + '/msg/js/en.js')
      .pipe(replace(/goog\.[^\n]+/g, ''))
      .pipe(insert.wrap('var Blockly = {}; Blockly.Msg={};  module.exports = function(){ ', 'return Blockly.Msg;}'))
      .pipe(gulp.dest('lib/i18n/'));
});

gulp.task('blocklyMedia', function() {
    return gulp.src(blocklyDir + '/media/**.*')
              .pipe(gulp.dest(mediaDistDir));
});

gulp.task('buildBlockly', ['blockly', 'blocklyMsgEn', 'blocklyMedia']);
