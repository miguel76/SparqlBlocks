'use strict';

var SparqlBlocks = require('./index.js'),
    _ = require('underscore'),
    $ = require('jquery'),
    Blockly = require('blockly'),
    io = require('socket.io-client');

function start() {

  var socket = io();
  socket.on('error', function(errorData) {
    console.warn('Error connecting to server socket:' + errorData);
  });

  var BlocklyDialogs = SparqlBlocks.BlocklyDialogs;

  var sURLVariables = decodeURIComponent(window.location.search.substring(1)).split('&');
  var sParameters = {};

  for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterParts = sURLVariables[i].split('=');
      sParameters[sParameterParts[0]] =
          sParameterParts[1] === undefined ? true : sParameterParts[1];
  }

  function rebuildSearch() {
    window.location.search =
        _.reduce(
            _.mapObject(sParameters,
                        function(value, key) { return "" + key + "=" + value; }),
            function(search, param) { return search + "&" + param; } );
  }

  function setMode(newMode) {
    sParameters.mode = newMode;
    rebuildSearch();
  }

  // Depending on the URL argument, render as LTR or RTL.
  var rtl = sParameters.rtl;

  var mode = _.isString(sParameters.mode) ? sParameters.mode : "demo";
  var isReadOnly = (mode === "view");

  var workspace;
  if (isReadOnly) {

    workspace = Blockly.inject('blocklyDiv', {
        rtl: rtl,
        media: 'media/',
        comments: true,
        disable: true,
        collapse: true,
        readOnly: true,
        realtime: false,
        scrollbars: false,
       });

    SparqlBlocks.Storage.startup(workspace, function() {
      // workspace.zoomToFit();
    });

  } else {
    var toolbox =
          mode === "test" ?
              document.getElementById('toolboxTest') :
        ( mode === "eval" ?
              document.getElementById('toolboxGuide') :
              document.getElementById('toolboxDemo') );

    workspace = Blockly.inject('blocklyDiv', {
        comments: true,
        disable: true,
        collapse: true,
        grid:
          {spacing: 25,
           length: 3,
           colour: '#ccc',
           snap: true},
        maxBlocks: Infinity,
        media: 'media/',
        readOnly: false,
        rtl: rtl,
        scrollbars: true,
        toolbox: toolbox,
        zoom:
          {controls: true,
           wheel: false,
           startScale: 0.9,
           maxScale: 4,
           minScale: 0.25,
           scaleSpeed: 1.1
          },
        // Enable shadow blocks morphing to regular ones on change
        shadowMorph: true,
       });

    $('.blocklyToolboxDiv').prepend(
      '<div class="main-button-container clearfix">'+
        '<div class="main-button-container clearfix">'+
        '<button class="main-button btn btn-block" disabled title="Save as Gist on GitHub" type="button" id="save-button">'+
          '<span class="octicon octicon-cloud-upload"></span>'+
          ' Save as Gist'+
        '</button>'+
        '</div>'+
        '<div class="main-button-container clearfix">'+
        '<button class="main-button btn btn-block" disabled title="Copy Link to Clipboard" id="copy-button" type="button">'+
          '<span class="octicon octicon-clippy"></span>'+
          ' Copy Link'+
        '</button>'+
        '</div>'+
      '</div>');

    $('#save-button').on('click', function() { SparqlBlocks.Storage.linkGist(); });
    SparqlBlocks.Storage.setCopyOnThisButton('#copy-button');
    SparqlBlocks.Storage.startup(workspace);
    SparqlBlocks.Track.track(workspace, {webSocket: socket});

    if (mode === "eval") {

      var check = function(data) {
        var block = SparqlBlocks.Guide.check(workspace, data.check);
        if (block) {
          if (block.getSvgRoot) {
            data.focus = block.getSvgRoot();
          } else if (block[0] && block[0].getSvgRoot) {
            data.focus = block[0].getSvgRoot();
          }
          return true;
        } else {
          return false;
        }
      };

      var guideStateList = [
        {
          dialog: "dialogWelcome", //"Welcome to ...",
          modal: true
        },
        {
          dialog: "dialogAddQuery", //"Add a query ...",
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check = {
              type: "sparql_execution_endpoint_query",
              ENDPOINT: "http://live.dbpedia.org/sparql",
              WHERE: [{
                type: "sparql_subject_propertylist",
                SUBJECT: {
                  type: "variables_get"
                  // VAR: "subj"
                },
                PROPERTY_LIST: [{
                  type: "sparql_verb_object",
                  VERB: {
                    type: "variables_get"
                    // VAR: "pred"
                  },
                  OBJECT: {
                    type: "variables_get"
                    // VAR: "obj"
                  }
                }]
              }]
            };
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogGraphPattern",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          }
        },
        {
          dialog: "dialogResults",
          style: {
            "top": "10px", "right": "25px"
          },
          useFocus: true
        },
        {
          dialog: "dialogVariables",
          style: {
            "top": "10px", "right": "25px"
          },
          useFocus: true
        },
        {
          dialog: "dialogNavigate",
          style: {
            "bottom": "25px", "left": "15px"
          },
          useFocus: true
        },
        {
          dialog: "dialogKeyboard",
          modal: true
        },
        {
          dialog: "dialogDelete",
          modal: true
        },
        // {
        //   dialog: "dialogDeleteVar",
        //   style: {
        //     "bottom": "25px", "left": "15px"
        //   },
        //   useFocus: true,
        //   do: function(data) {
        //     data.check.WHERE[0].TYPE = null;
        //   },
        //   stepWhen: function(event, data) {
        //     return (event.type == Blockly.Events.DELETE && check(data));
        //   }
        // },
        {
          dialog: "dialogAddResource",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE[0].PROPERTY_LIST[0].VERB = {
              type: "sparql_prefixed_iri",
              PREFIX: "foaf",
              LOCAL_NAME: "knows"
            };
            data.check.WHERE[0].PROPERTY_LIST[0].OBJECT.VAR = "friend";
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        // {
        //   dialog: "dialogChangeVarName",
        //   useFocus: true,
        //   style: {
        //     "top": "10px", "right": "25px"
        //   },
        //   do: function(data) {
        //     data.check.WHERE[0].PROPERTY_LIST[0].OBJECT.VAR = "friend";
        //   },
        //   stepWhen: function(event, data) {
        //     return check(data);
        //   }
        // },
        {
          dialog: "dialogAddBranch",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE[0].PROPERTY_LIST.push({
              type: "sparql_verb_object",
              VERB: {
                type: "sparql_prefixed_iri",
                PREFIX: "foaf",
                LOCAL_NAME: "name"
              },
              OBJECT: {
                type: "variables_get"
                // VAR: "name"
              }
            });
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogFixFromResults",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE[0].SUBJECT = {
              type: ["sparql_prefixed_iri", "sparql_iri"]
            };
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogAddPattern",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE.push({
              type: "sparql_subject_propertylist",
              SUBJECT: { type: "variables_get", VAR: "friend" },
              PROPERTY_LIST: [{
                type: "sparql_verb_object",
                VERB: {
                  type: "sparql_prefixed_iri",
                  PREFIX: "rdf",
                  LOCAL_NAME: "type"
                },
                OBJECT: {
                  type: "sparql_prefixed_iri",
                  PREFIX: "foaf",
                  LOCAL_NAME: "Person"
                }
              }]
            });
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogAddPattern2",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE[1].PROPERTY_LIST.push({
              type: "sparql_verb_object",
              VERB: {
                type: "sparql_prefixed_iri",
                PREFIX: "foaf",
                LOCAL_NAME: "name"
              },
              OBJECT: { type: "variables_get", VAR: "friendName" }
            });
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogAddOrderBy",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.ORDER_FIELD1 = {
              type: "variables_get",
              VAR: "friendName"
            };
            data.check.ORDER_DIRECTION1 = "DESC";
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogChangeLimit",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.LIMIT = "3";
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogFilter",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check.WHERE.push({
              type: "sparql_filter",
              CONDITION: {
                type: "sparql_text_contains",
                VALUE: { type: "variables_get", VAR: "friendName" },
                FIND: { type: "sparql_text", TEXT: "tim" }
              }
            });
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogFindClass",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            var classBlock = {type: "sparql_prefixed_iri", PREFIX: "dbo", LOCAL_NAME: "Lake"};
            data.check = [
              classBlock,
              {
                type: "sparql_subject_propertylist",
                SUBJECT: {type: "variables_get"},
                PROPERTY_LIST: [{
                  type: "sparql_verb_object",
                  VERB: {type: "sparql_prefixed_iri", PREFIX: "rdf", LOCAL_NAME: "type"},
                  OBJECT: classBlock
                }]
              }
            ];
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogFindThing",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          stepWhen: function(event, data) {
            if (event.type == Blockly.Events.CREATE &&
                event.block.type == "sparql_prefixed_iri" &&
                  event.block.getFieldValue("PREFIX") == "dbpedia" &&
                  event.block.getFieldValue("LOCAL_NAME") == "Lake_Titicaca") {
                    // data.focus = event.block.getSvgRoot();
                    return true;
            }
          }
        },
        {
          dialog: "dialogFindProperty",
          useFocus: false,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check = {
              type: "sparql_verb_object",
              VERB: {type: "sparql_prefixed_iri", PREFIX: "dbo", LOCAL_NAME: "locatedInArea"}
            };
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogQueryFromPatterns",
          useFocus: true,
          style: {
            "top": "10px", "right": "25px"
          },
          do: function(data) {
            data.check = {
              type: "sparql_execution_endpoint_query",
              ENDPOINT: "http://live.dbpedia.org/sparql",
              WHERE: [{
                type: "sparql_subject_propertylist",
                SUBJECT: {
                  type: "variables_get"
                  // VAR: "subj"
                },
                PROPERTY_LIST: [{
                  type: "sparql_verb_object",
                  VERB: {type: "sparql_prefixed_iri", PREFIX: "rdf", LOCAL_NAME: "type"},
                  OBJECT: {type: "sparql_prefixed_iri", PREFIX: "dbo", LOCAL_NAME: "Lake"}
                },{
                  type: "sparql_verb_object",
                  VERB: {type: "sparql_prefixed_iri", PREFIX: "dbo", LOCAL_NAME: "locatedInArea"},
                  OBJECT: {type: "variables_get"}
                }]
              }]
            };
          },
          stepWhen: function(event, data) {
            return check(data);
          }
        },
        {
          dialog: "dialogSave",
          style: {
            "top": "10px", "right": "25px"
          }
        },
        {
          do: function(data) {
            workspace.updateToolbox(document.getElementById('toolboxTest'));
            workspace.clear();
          },
          dialog: "dialogFinish", //"Thank you ...",
          modal: true
        },
        {
          do: function() {
            setMode("test");
          }
        }
      ];

      workspace.trackingGuide = SparqlBlocks.Guide.track(
        workspace,
        _.extend({ stateList: guideStateList },
          $.isNumeric(sParameters.startGuideFrom) ?
              { startStateId: Math.round(0 + sParameters.startGuideFrom) } : {}
        )
      );

    } else if (mode === "test") {
      var testAlertDiv = document.getElementById("dialogTest");
      if (!testAlertDiv)
        return;
      $(".flash-messages").css("display", "none");
      SparqlBlocks.Guide.replaceInLineBlockly(testAlertDiv);
      SparqlBlocks.Guide.setOkButtons(testAlertDiv);
      BlocklyDialogs.showDialog(
        testAlertDiv, false, false, true,
        { width: '75%',
          bottom: "inherit",
          left: '15%',
          top: '5%'
        }, function() {
          $(".flash-messages").css("display", "");
        });
    }

  }

  var selCat = sParameters.selCat;
  if (_.isString(selCat) &&
      workspace && workspace.toolbox_ && workspace.toolbox_.tree_) {
    var nodeNum = parseInt(selCat, 10);
    if (!_.isNaN(nodeNum)) {
      var node = workspace.toolbox_.tree_.getChildAt(nodeNum);
      if (node) {
        workspace.toolbox_.tree_.setSelectedItem(node);
      }
    }
  }

}

window.onload = start;
