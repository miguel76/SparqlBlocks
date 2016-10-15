<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:template name="dialogs-for-guide">
    <div id="dialogs" class="dialogHiddenContent">
      <div id="dialogWelcome" class="dialogHiddenContent">
          <div class="dialogTitle">Welcome to SparqlBlocks</div>
          <div class="dialogContent">
            <p>
              The aim of SparqlBlocks is to let you visually build queries against <span class="dialog-def">Linked Data</span> sources.
            </p>
            <p>
              <!-- The name SparqlBlocks comes from <a href="https://www.w3.org/TR/sparql11-query/" target="_blank">SPARQL</a>, the stantard (textual) query language -->
              Although SparqlBlocks is based on
              <a href="https://www.w3.org/TR/sparql11-query/" target="_blank">SPARQL</a>
              (the standard query language for Linked Data)
              <!-- SparqlBlocks is based on SPARQL, but  -->
              you do not need to know SPARQL syntax
              to use SparqlBlocks.
            </p>
            <p>
              This tutorial will help you get started.
              Each step explains a new concept and lets you experience it in action.
            </p>
          </div>
            <!-- Follow the directions to proceed through the tutorial.</p> -->
          <div class="farSide" style="padding: 1ex 3ex 0">
            <button class="blocklydialogs-ok"></button>
          </div>
        <!-- </td></tr></table> -->
      </div>
      <div id="dialogAddQuery" style="width: 400px" class="dialogHiddenContent">
          <div class="dialogTitle">Workspace and Blocks</div>
          <div class="dialogContent">
            <p>
              The main area of the app is the <span class="dialog-def">workspace</span>.
              Here you can drag and connect together the blocks that will form queries.
            </p>
            <p>
              On the left there is the <span class="dialog-def">toolbox</span>, where you can pick the blocks to use.
              They are grouped in <span class="dialog-def">categories</span> (<span class="dialog-command">&#xf106;&#160;Query</span>, <span class="dialog-command">&#xf104;&#160;Patterns</span>,...).
            </p>
          </div>
          <div class="dialogToDo">
            <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 82px; width: 188px; float:right; display:block; margin: 3px;">
              <block x="0" y="0" type="sparql_execution_endpoint_query_fake">
                <field name="ENDPOINT">http://live.dbpedia.org/sparql</field>
                <field name="LIMIT">5</field>
                <value name="WHERE">
                  <shadow type="sparql_subject_propertylist">
                    <value name="SUBJECT">
                      <shadow type="variables_get">
                        <field name="VAR">subj</field>
                      </shadow>
                    </value>
                    <statement name="PROPERTY_LIST">
                      <shadow type="sparql_verb_object">
                        <value name="VERB">
                          <shadow type="variables_get">
                            <field name="VAR">pred</field>
                          </shadow>
                        </value>
                        <value name="OBJECT">
                          <shadow type="variables_get">
                            <field name="VAR">obj</field>
                          </shadow>
                        </value>
                      </shadow>
                    </statement>
                  </shadow>
                </value>
              </block>
            </div>
            click on the <span class="dialog-command">&#xf106;&#160;Query</span> category and drag the query block
            to the Workspace.
            <!-- To bring it to the workspace, you can either just click on it
            or drag it already to a specific position in the workspace. -->
          </div>
      </div>
      <div id="dialogGraphPattern" style="width: 400px" class="dialogHiddenContent">
          <div class="dialogTitle">Queries and Patterns</div>
          <div class="dialogContent">
            <p>
              A <span class="dialog-def">query</span> block executes queries against a
              <a href="https://www.w3.org/TR/sparql11-protocol/" target="_blank">Linked Data source</a>
              (the default source is <a href="http://dbpedia.org/" target="_blank">DBpedia</a>).
            </p>
            <p>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 33px; width: 157px; float:right; display:block; margin: 3px;">
                <block type="sparql_subject_propertylist">
                  <value name="SUBJECT">
                    <block type="variables_get">
                      <field name="VAR">subj</field>
                    </block>
                  </value>
                  <statement name="PROPERTY_LIST">
                    <block type="sparql_verb_object">
                      <value name="VERB">
                        <block type="variables_get">
                          <field name="VAR">pred</field>
                        </block>
                      </value>
                      <value name="OBJECT">
                        <block type="variables_get">
                          <field name="VAR">obj</field>
                        </block>
                      </value>
                    </block>
                  </statement>
                </block>
              </div>
              Linked Data sources are graphs (networks) of concepts.
              A query is built with <span class="dialog-def">patterns</span> to be matched against the input graphs.
              <!-- Those patterns are graphs in which some nodes (concepts) are unknown. -->
              <!-- that is replaced by a Variable. -->
            </p>
            <p>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 113px; float:right; display:block; margin: 3px;">
                <block type="sparql_verb_object">
                  <value name="VERB">
                    <block type="variables_get">
                      <field name="VAR">pred</field>
                    </block>
                  </value>
                  <value name="OBJECT">
                    <block type="variables_get">
                      <field name="VAR">obj</field>
                    </block>
                  </value>
                </block>
              </div>
              The pattern itself contains an inner part that we call <span class="dialog-def">branch</span>.
              A pattern is rooted on a node of the graph (in this case
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">subj</field></block>
              </span>)
              and may hold any number of branches.
            </p>
            <p>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 33px; width: 157px; float:right; display:block; margin: 3px;">
                <shadow type="sparql_subject_propertylist">
                  <value name="SUBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">subj</field>
                    </shadow>
                  </value>
                  <statement name="PROPERTY_LIST">
                    <shadow type="sparql_verb_object">
                      <value name="VERB">
                        <shadow type="variables_get">
                          <field name="VAR">pred</field>
                        </shadow>
                      </value>
                      <value name="OBJECT">
                        <shadow type="variables_get">
                          <field name="VAR">obj</field>
                        </shadow>
                      </value>
                    </shadow>
                  </statement>
                </shadow>
              </div>
              The pattern inside the query has actually a lighter shade of color,
              to indicate that these blocks are there by default.
              They can be replaced by other blocks or changed, becoming then regular blocks.
            </p>
          </div>
          <div class="farSide" style="padding: 1ex 3ex 0">
            <button class="blocklydialogs-ok"></button>
          </div>
      </div>
      <div id="dialogResults" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Results</div>
        <div class="dialogContent">
          <p>
            The query is remotely executed and the <span class="dialog-def">table of results</span> is shown below.
          <!-- </p>
          <p> -->
            There is a result row for each way the pattern is matched against the input graph
            (although only the first 5 rows are shown).
          </p>
          <p>
            This is the most generic pattern, that match every connection (triple) in the input graph.
          </p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>
        </div>
      </div>
      <div id="dialogVariables" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Variables</div>
        <div class="dialogContent">
          <p>
            The blocks
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
              <block x="8" y="0" type="variables_get"><field name="VAR">subj</field></block>
            </span>,
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 58px; vertical-align: middle;">
              <block x="8" y="0" type="variables_get"><field name="VAR">pred</field></block>
            </span>, and
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 50px; vertical-align: middle;">
              <block x="8" y="0" type="variables_get"><field name="VAR">obj</field></block>
            </span>
            are <span class="dialog-def">variables</span>.
            For each matching of the pattern, each variable is <span class="dialog-def">bound</span> to the corresponding value in the input graph.
            In the table of results, the rows are the matchings and the columns are the variables.
          </p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>
        </div>
      </div>
      <div id="dialogNavigate" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Navigate and Zoom the Workplace</div>
        <div class="dialogContent">
          <p>
            To organize the workspace you can:
            <ol>
              <li>move blocks around by dragging them</li>
              <li>navigate the workspace
                <ul><li>by clicking on the background and dragging it or </li><li>by using the scrollbars</li></ul></li>
              <li>zoom in/out workspace
                by using <span class="icon_zoomIn"/> and <span class="icon_zoomOut"/></li>
              <li>reset workspace view
                by using <span class="icon_zoomReset"/></li>
            </ol>
          </p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>
        </div>
      </div>
      <div id="dialogKeyboard" class="dialogHiddenContent">
        <div class="dialogTitle">Keyboard Commands</div>
        <div class="dialogContent">
          <p></p>
          You can use the following common keyboard commands:
          <ul>
            <li>
              <kbd>Del</kbd> or <kbd>←</kbd>
              to <span class="dialog-def">delete</span> the selected block;
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>C</kbd>
              to <span class="dialog-def">copy</span> the selected block;
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>X</kbd>
              to <span class="dialog-def">cut</span> the selected block;
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>V</kbd>
              to <span class="dialog-def">paste</span> the block that have been copied/cut;
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>Z</kbd>
              to <span class="dialog-def">undo</span> last operation;
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
              to <span class="dialog-def">redo</span> an operation that was undone.
            </li>
          </ul>
          <p>
            <kbd>Alt</kbd> or <kbd>⌘</kbd> can be used in place of <kbd>Ctrl</kbd>.</p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>

        </div>
      </div>
      <div id="dialogDelete" class="dialogHiddenContent">
        <div class="dialogTitle">Delete Blocks</div>
        <div class="dialogContent">
          <p></p>
          There are in total four ways to delete blocks:
          <ol>
            <li>
              select the block and type <kbd>Del</kbd> or <kbd>←</kbd>;
            </li>
            <li>
              right-click on the variable block and choose <span class="dialog-command">Delete Block</span>;
            </li>
            <li>
              drag the block to the trash bin <span class="icon_trash"></span>;
            </li>
            <li>
              drag the block to the left, over the toolbox.
            </li>
          </ol>
          <!-- <p>
            Please beware that blocks and group of blocks are deleted without prompt
            if the user accidentally drops them on the areas described (2. and 3.).</p>
          <p>
            In a not-too-far-in-the-future release we will provide an undo mechanism.</p> -->
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>
        </div>
      </div>
      <div id="dialogAddResource" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">From Variables to Fixed Values, Resources</div>
        <div class="dialogContent">
          <!-- <p>
            As the variable
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
              <block x="8" y="0" type="variables_get"><field name="VAR">type</field></block>
            </span>
            is not used anymore,
            the corresponding column
            disappeared from the result set.
          </p> -->
          <p>
            <!-- In the pattern -->
            <!-- You may replace variables with -->
            Variables in the pattern may be replaced by
            <!-- To set parts of a pattern -->
            <!-- values -->
            <span class="dialog-def">resources</span> (concepts)
            <!-- —like -->
            <!-- (<span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 116px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">dbpedia</field>
                <field name="LOCAL_NAME">Rome</field>
              </block>
            </span>) -->
            <!-- <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 96px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">foaf</field>
                <field name="LOCAL_NAME">knows</field>
              </block>
            </span>) -->
            <!-- — -->
            and <span class="dialog-def">literals</span>
            <!-- —like -->
            (strings, numbers,...),
            <!-- (<span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 77px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_text">
                <field name="TEXT">fish</field>
              </block>
            </span>,
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 37px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_math_number">
                <field name="NUM">42</field>
              </block>
            </span>), -->
            <!-- in place of variables, -->
            <!-- may replace variables in the pattern, -->
            to represent fixed parts of the pattern.
          </p>
        </div>
        <div class="dialogToDo">
          from the <span class="dialog-command">&#xf100;&#160;Vocab&#160;>&#160;FOAF</span> category,
          drag the <code>foaf:knows</code> branch
          to the query pattern,
          <!-- as the predicate ( -->
          replacing the existing branch
          -&#160;<code>pred</code>&#160;->&#160;<code>obj</code>.
          <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 145px; float:right; display:block; margin: 3px;">
            <block x="0" y="0" type="sparql_verb_object">
              <value name="VERB">
                <block type="sparql_prefixed_iri">
                  <field name="PREFIX">foaf</field>
                  <field name="LOCAL_NAME">knows</field>
                </block>
              </value>
              <value name="OBJECT">
                <shadow type="variables_get">
                  <field name="VAR">friend</field>
                </shadow>
              </value>
            </block>
          </div>
        </div>
      </div>
      <!-- <div id="dialogChangeVarName" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Properties and Variable Names</div>
        <div class="dialogContent">
          <p>
            Variables are just placeholders,
            changing their names does not change the pattern.
          </p>
        </div>
        <div class="dialogToDo">
          click on
          <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 50px; vertical-align: middle;">
            <block x="8" y="0" type="variables_get"><field name="VAR">obj</field></block>
          </span>
          and <span class="dialog-command">Rename variable...</span> as
          <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 64px; vertical-align: middle;">
            <block x="8" y="0" type="variables_get"><field name="VAR">friend</field></block>
          </span>.
        </div>
      </div> -->
      <div id="dialogAddBranch" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Grow your Pattern</div>
        <div class="dialogContent">
          <p>
            Now the query looks for pairs of resources linked by
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 96px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">foaf</field>
                <field name="LOCAL_NAME">knows</field>
              </block>
            </span>
            —that is, two persons that know each other.
            Resources used to identify the type of a link, like
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 96px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">foaf</field>
                <field name="LOCAL_NAME">knows</field>
              </block>
            </span>,
            are called <span class="dialog-def">properties</span>.
          </p>
          <p>
            Things get interesting when patterns are composed of multiple links.
            Add a new branch to your pattern to look for the name of
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
              <block x="8" y="0" type="variables_get"><field name="VAR">subj</field></block>
            </span>.
          </p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 143px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_verb_object">
                  <value name="VERB">
                    <block type="sparql_prefixed_iri">
                      <field name="PREFIX">foaf</field>
                      <field name="LOCAL_NAME">name</field>
                    </block>
                  </value>
                  <value name="OBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">name</field>
                    </shadow>
                  </value>
                </block>
              </div>
              from the <span class="dialog-command">&#xf100;&#160;Vocab&#160;>&#160;FOAF</span> category,
              drag the <code>foaf:name</code> branch
              in the existing query pattern.
            </li>
            </ol>
        </div>
        <!-- <td>
          <img src="../img/help/help.png">
        </td> -->
      </div>
      <div id="dialogFixFromResults" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Results are Blocks too!</div>
        <div class="dialogContent">
          <p>
            The values in the table of results are also blocks,
            resources
            <!-- —like -->
            <!-- (<span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 154px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">dbpedia</field>
                <field name="LOCAL_NAME">Kevin_Bacon</field>
              </block>
            </span>,
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 96px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_prefixed_iri">
                <field name="PREFIX">foaf</field>
                <field name="LOCAL_NAME">knows</field>
              </block>
            </span>) -->
            <!-- — -->
            and literals.
            <!-- —like -->
            <!-- (<span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 175px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_text">
                <field name="TEXT">Kevin Norwood Bacon</field>
              </block>
            </span>,
            <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 37px; vertical-align: middle;">
              <block x="8" y="0" type="sparql_math_number">
                <field name="NUM">42</field>
              </block>
            </span>). -->
            <!-- — -->
            They can be used to change the current query or create new queries.
            <!-- Also the column headers are blocks, Variables. -->
          </p>
        </div>
        <div class="dialogToDo">
          from the table of results, under the header
          <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
            <block x="8" y="0" type="variables_get"><field name="VAR">subj</field></block>
          </span>,
          <!-- of the table of results, -->
          drag one of the results to the pattern above,
          to replace the variable
          <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 56px; vertical-align: middle;">
            <shadow x="8" y="0" type="variables_get"><field name="VAR">subj</field></shadow>
          </span>.
          <!-- <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 50px; vertical-align: middle;">
            <block x="8" y="0" type="variables_get"><field name="VAR">subj</field></block>
          </span>. -->
        </div>
        <!-- <td>
          <img src="../img/help/help.png">
        </td> -->
      </div>
      <div id="dialogAddPattern" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Grow the Pattern Again 1/2</div>
        <div class="dialogContent">
          <p>
            The query
            <!-- in a simple query like this -->
            <!-- is called a <span class="dialog-def">Basic Graph Pattern</span> and -->
            may contain multiple patterns.
            <!-- each one centered on a common subject, that can be a Resource or a Variable. -->
            <!-- By using common Variables they can be used to represent any pattern in the graph. -->
            Add another pattern to get data about the people that are friends of this person.
          </p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 33px; width: 211px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_subject_propertylist">
                  <value name="SUBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">person</field>
                    </shadow>
                  </value>
                  <statement name="PROPERTY_LIST">
                    <block type="sparql_verb_object">
                      <value name="VERB">
                        <block type="sparql_prefixed_iri">
                          <field name="PREFIX">rdf</field>
                          <field name="LOCAL_NAME">type</field>
                        </block>
                      </value>
                      <value name="OBJECT">
                        <block type="sparql_prefixed_iri">
                          <field name="PREFIX">foaf</field>
                          <field name="LOCAL_NAME">Person</field>
                        </block>
                      </value>
                    </block>
                  </statement>
                </block>
              </div>
              from the <span class="dialog-command">&#xf100;&#160;Vocab&#160;>&#160;FOAF</span> category,
              drag the <code>foaf:Person</code> pattern,
              <!-- and drag it -->
              after the existing pattern;
              <!-- inside the existing query (before or after the existing pattern); -->
            </li>
            <li>
              click on the variable
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 70px; vertical-align: middle;">
                <shadow x="8" y="0" type="variables_get"><field name="VAR">person</field></shadow>
              </span>
              and change it to use
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 64px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">friend</field></block>
              </span> instead.</li>
          </ol>
        </div>
      </div>
      <div id="dialogAddPattern2" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Grow the Pattern Again 2/2</div>
        <div class="dialogContent">
          <p>
            <!-- Use the new star-like pattern to get the names of the friends. -->
            Get the name of the friends too.
          </p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 143px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_verb_object">
                  <value name="VERB">
                    <block type="sparql_prefixed_iri">
                      <field name="PREFIX">foaf</field>
                      <field name="LOCAL_NAME">name</field>
                    </block>
                  </value>
                  <value name="OBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">name</field>
                    </shadow>
                  </value>
                </block>
              </div>
              from the <span class="dialog-command">&#xf100;&#160;Vocab&#160;>&#160;FOAF</span> category,
              drag again the <code>foaf:name</code> branch,
              inside the new pattern;
              <!-- as the predicate ( -->
              <!-- replacing the -&#160;<code>pred</code>&#160;->&#160;<code>obj</code> part; -->
            </li>
            <li>
              click on
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 70px; vertical-align: middle;">
                <shadow x="8" y="0" type="variables_get"><field name="VAR">name1</field></shadow>
              </span>
              and <span class="dialog-command">Rename variable...</span> as
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 95px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">friendName</field></block>
              </span>.</li>
          </ol>
        </div>
      </div>
      <div id="dialogAddOrderBy" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Order Results</div>
        <div class="dialogContent">
          <p>
            Results by default are not given in any particular order.
            You can order them based on the content of one or more variables,
            in ascending or descending order.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              drag
              <!-- of the query block -->
               a copy of the variable
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 95px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">friendName</field></block>
              </span>
              <!-- (either -->
              from the <span class="dialog-command">&#xf10b;&#160;Variables</span> category
              <!-- from the column header in the results,
              or as duplicate of the block in the pattern) -->
              to the
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 26px; width: 117px; vertical-align: middle;">
                <block x="0" y="-52" type="sparql_execution_endpoint_query"></block>
              </span>
              field;
            </li>
            <li>
              change the order direction from ▲ (asc.) to ▼ (desc.);
              </li>
          </ol>
        </div>
      </div>
      <div id="dialogChangeLimit" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Limit Results</div>
        <div class="dialogContent">
          <p>
            <!-- You see the first 5 rows of the results. -->
            You can increase or reduce the maximum number of rows you see by changing the value of
            the <span class="dialog-def">limit</span> field.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              set the value of the field
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 19px; width: 115px; vertical-align: middle;">
                <block x="-144" y="-56" type="sparql_execution_endpoint_query"></block>
              </span>
              to 3.
              </li>
          </ol>
        </div>
      </div>
      <div id="dialogFilter" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Filter Results</div>
        <div class="dialogContent">
          <p>
            You can filter the results according to a logic expression of your choice.
            For example we may request to see just the friends containing the string “tim” in the name.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 63px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_filter">
                  <value name="CONDITION">
                    <shadow type="sparql_logic_boolean"></shadow>
                  </value>
                </block>
              </div>
              from the <span class="dialog-command">&#xf102;&#160;Logic</span> category,
              drag a filter block to the query (before, among, or after the existing patterns);
            </li>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 148px; float:right; display:block; margin: 3px;">
                <block x="8" y="0" type="sparql_text_contains">
                  <value name="FIND">
                    <shadow type="sparql_text">
                      <field name="TEXT">bc</field>
                    </shadow>
                  </value>
                  <value name="VALUE">
                    <shadow type="sparql_text">
                      <field name="TEXT">abcd</field>
                    </shadow>
                  </value>
                </block>
              </div>
              from the <span class="dialog-command">&#xf109;&#160;Text</span> category,
              drag a <em>contains</em> block inside the filter;
            </li>
            <li>
              drag the variable
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 95px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">friendName</field></block>
              </span> in place of
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 95px; vertical-align: middle;">
                <block x="8" y="0" type="sparql_text"><field name="TEXT">abcd</field></block>
              </span>;
            </li>
            <li>
              change the text “bc”
              to “tim”.
            </li>
          </ol>
        </div>
      </div>
      <div id="dialogFindClass" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Look for Classes of Resources</div>
        <div class="dialogContent">
          <p>
            Resources have types, that are other resources.
            This resources
            used as types are called <span class="dialog-def">classes</span>.</p>
          <p>
            There is a pre-built query to look for them.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              you may delete the whole query block now;
            </li>
            <li>
              from the <span class="dialog-command">&#xf10a;&#160;Search</span> category,
              drag the <em>search Classes</em> block in the workspace;
            </li>
            <li>
              change the text “abc” to “lake”;
            </li>
            <li>
              pick from the results the class found for lakes
              (under column
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 61px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">class</field></block>
              </span>)
              and drag it to any place in the workspace;</li>
              <li>
                drag also the corresponding pattern
                (under column
                <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 71px; vertical-align: middle;">
                  <block x="8" y="0" type="variables_get"><field name="VAR">pattern</field></block>
                </span>)
                to any place in the workspace.</li>
          </ol>
        </div>
      </div>
      <div id="dialogFindThing" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Look for Resources</div>
        <div class="dialogContent">
          <p>
            There is also a pre-built query to look for any kind of resource.
            Optionally you can indicate the type of the resource.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              you can delete the <em>search Classes</em> block;
            </li>
            <li>
              from the <span class="dialog-command">&#xf10a;&#160;Search</span> category,
              drag the <em>search Resources</em> block in the workspace;
            </li>
            <li>
              replace
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 90px; vertical-align: middle;">
                <shadow x="8" y="0" type="sparql_prefixed_iri">
                  <field name="PREFIX">owl</field>
                  <field name="LOCAL_NAME">Thing</field>
                </shadow>
              </span>
              with
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 88px; vertical-align: middle;">
                <block x="8" y="0" type="sparql_prefixed_iri">
                  <field name="PREFIX">dbo</field>
                  <field name="LOCAL_NAME">Lake</field>
                </block>
              </span>;
            </li>
            <li>
              change the text “abc” to “titicaca”;
            </li>
            <li>
              pick from the results the resource found for Lake Titicaca
              (under column
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 80px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">resource</field></block>
              </span>)
              and drag it to any place in the workspace.
            </li>
          </ol>
        </div>
      </div>
      <div id="dialogFindProperty" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Look for Properties</div>
        <div class="dialogContent">
          <p>
            There is
            also a pre-built query to look for <span class="dialog-def">properties</span>.
            Properties identify a "type of link" between resources.
            For each property, the class of resources from which the links come from
            is called <span class="dialog-def">domain</span>, while
            the class towards which the links go is called
            the <span class="dialog-def">range</span>.</p>
          <p>
            You can indicate none, one or both of the specific classes between which you want to use the property.
            The actual domain and range of the property may be classes that are more generic.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              you can delete the <em>search Resources</em> block
            </li>
            <li>
              from the <span class="dialog-command">&#xf10a;&#160;Search</span> category,
              drag the <em>search Properties</em> block in the workspace;
            </li>
            <li>
              <!-- in the domain branch, -->
              connect
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 88px; vertical-align: middle;">
                <block x="8" y="0" type="sparql_prefixed_iri">
                  <field name="PREFIX">dbo</field>
                  <field name="LOCAL_NAME">Lake</field>
                </block>
              </span>
              to the <em>from class</em> input;
              if you lost this resource or any used resource, you can find them back in the
              <span class="dialog-command">&#xf107;&#160;Resources</span> category;
            </li>
            <li>
              change the text “abc” to “located”;
            </li>
            <li>
              pick from the results the branch found
              (under column
              <span class="blockly-readOnly" blockly-zoom="0.8" style="height: 21px; width: 70px; vertical-align: middle;">
                <block x="8" y="0" type="variables_get"><field name="VAR">branch</field></block>
              </span>)and drag it to any place in the workspace.
              <!-- to the workspace. -->
            </li>
          </ol>
        </div>
      </div>
      <div id="dialogQueryFromPatterns" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Build a Query from Patterns and Branches found with Search</div>
        <div class="dialogContent">
          <p>
            You can directly use the patterns and branches obtained from
            <em>search Classes</em> and <em>search Properties</em> to build queries.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              you can delete the <em>search Properties</em> block
            </li>
            <li>
              drag a new query block in the workspace;</li>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 33px; width: 194px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_subject_propertylist">
                  <value name="SUBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">lake</field>
                    </shadow>
                  </value>
                  <statement name="PROPERTY_LIST">
                    <block type="sparql_verb_object">
                      <value name="VERB">
                        <block type="sparql_prefixed_iri">
                          <field name="PREFIX">rdf</field>
                          <field name="LOCAL_NAME">type</field>
                        </block>
                      </value>
                      <value name="OBJECT">
                        <block type="sparql_prefixed_iri">
                          <field name="PREFIX">dbo</field>
                          <field name="LOCAL_NAME">Lake</field>
                        </block>
                      </value>
                    </block>
                  </statement>
                </block>
              </div>
              replace the query pattern with the one obtained from <em>search Classes</em> pattern;</li>
            <li>
              <div class="blockly-readOnly" blockly-zoom="0.5" style="height: 21px; width: 199px; float:right; display:block; margin: 3px;">
                <block x="0" y="0" type="sparql_verb_object">
                  <value name="VERB">
                    <block type="sparql_prefixed_iri">
                      <field name="PREFIX">dbo</field>
                      <field name="LOCAL_NAME">locatedInArea</field>
                    </block>
                  </value>
                  <value name="OBJECT">
                    <shadow type="variables_get">
                      <field name="VAR">located in area</field>
                    </shadow>
                  </value>
                </block>
              </div>
              add the branch obtained from <em>search Properties</em>.</li>
          </ol>
        </div>
      </div>
      <div id="dialogSave" style="width: 400px" class="dialogHiddenContent">
        <div class="dialogTitle">Save and Share</div>
        <div class="dialogContent">
          <p>
            You can save the current state of the Workspace anytime.
            It is associated to a link (URL) that you can share and/or keep yourself for future reference.</p>
          <p>
            Technically, the workspace content —along with the history since last save/load—
            is saved on <a href="https://github.com/" target="_blank">GitHub</a>
            as a secret anonymous <a href="https://help.github.com/articles/about-gists/" target="_blank">Gist</a>.
            That means access is resctricted to people having the link.</p>
        </div>
        <div class="dialogToDo">
          <ol>
            <li>
              press the
              <span class="main-button-container clearfix" style="display: inline-block; margin: 4px 0px;">
                <span class="main-button btn btn-block" style="display: inline; padding: 4px 10px;">
                  <span class="octicon octicon-cloud-upload"></span>
                  Save as Gist
                </span>
              </span>
              button;
            </li>
            <li>
              copy the link from the address bar of the browser
              or pressing the
              <span class="main-button-container clearfix" style="display: inline-block; margin: 4px 0px;">
                <span class="main-button btn btn-block" style="display: inline; padding: 4px 10px;">
                  <span class="octicon octicon-clippy"></span>
                  Copy Link
                </span>
              </span>
              button;
            </li>
            <li>
              <!-- you can save and/or share the link by pasting everywhere you want; -->
              paste the link somewhere to save and/or share it;
            </li>
            <li>
              when anyone opens that link, she/he will
              get the state of the workspace at the moment you saved it.
            </li>
            <!-- <li>
              drag a new query block;
            </li> -->
          </ol>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>

        </div>
      </div>
      <div id="dialogFinish" class="dialogHiddenContent">
        <div class="dialogTitle">Congratulations! You learned the basics of SparqlBlocks!</div>
        <div class="dialogContent">
          <!-- <p>Good! You learned all the basics of SparqlBlocks!</p> -->
          <!-- <p> -->
            <!-- As it was not possible to cover every feature, -->
            <p></p>
            Some pointers to other useful stuff:
            <ul>
              <li>
                the <span class="dialog-command">&#xf104;&#160;Patterns</span> category contains
                more blocks to build patterns;
              </li>
              <li>
                the <span class="dialog-command">&#xf101;&#160;Compose</span> category
                contains blocks to compose patterns into complex
                queries;
              </li>
              <li>
                the categories
                <span class="dialog-command">&#xf102;&#160;Logic</span>,
                <span class="dialog-command">&#xf103;&#160;Math</span>, and
                <span class="dialog-command">&#xf109;&#160;Text</span>
                allow you to
                build filters
                <!-- deal  -->
                with different kinds of literals;
                <!-- and to build filters; -->
              </li>
              <li>
                the context menu (right-click) of each block has other options, like
                <ul>
                  <li><span class="dialog-command">Add Comment</span> —to add a note to it,</li>
                  <li><span class="dialog-command">Collapse/Expand Block</span> —to temporary reduce its extent,</li>
                  <li><span class="dialog-command">Disable Block</span> —to temporary consider it as not existent;</li>
                </ul>
              </li>
              <li>
                the context menu of a query block has the specific options
                <ul>
                  <li>
                    <span class="dialog-command">Save Query as SPARQL</span>
                    —to save the query as SPARQL in the local filesytem,
                  </li>
                  <li>
                    <span class="dialog-command">Open Query in YASGUI</span>
                    —to open the query in <a href="http://yasgui.org/" target="_blank">YASGUI</a>
                    (an online SPARQL editor),
                  </li>
                  <li>
                    <span class="dialog-command">Save Results as JSON</span>
                    —to save the results as
                    <a href="https://www.w3.org/TR/sparql11-results-json/" target="_blank">JSON</a>
                    in the local filesytem.
                  </li>
                </ul>
              </li>
            </ul>
          <!-- </p> -->
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>

        </div>
      </div>
      <div id="dialogTest" class="dialogHiddenContent">
        <div class="dialogTitle">Evaluation of SparqlBlocks</div>
        <div class="dialogContent">
          <p>
            <div class="blockly-readOnly" blockly-zoom="0.8" style="height: 29px; width: 168px; float:right; display:block; margin: 3px;">
              <block type="sparql_test" x="0" y="0">
                <field name="INDEX">X)</field>
                <field name="QUESTION">The longest river is</field>
                <data>{
                  "id": "0",
                  "answerMD5": "b3aa0a5b32a2cf84b377a389b6250e31"
                }</data>
              </block>
            </div>
            In the category <span class="dialog-command">&#xf108;&#160;Test</span> there is a set of blocks that are statements
            with a missing part. Try to solve them through Linked Data queries!
          </p>
            The suggested method
            is to
            <ol>
              <li>
                retrieve
                —through appropriate queries—
                the needed
                resources (classes, properties, entities)
              </li>
              <li>with the resources found in the previous step, design the query that solves the problem.</li>
            </ol>
          <p>
            <div class="blockly-readOnly" blockly-zoom="0.8" style="height: 35px; width: 352px; float:right; display:block; margin: 3px;">
              <block type="sparql_test" x="0" y="0">
                <field name="INDEX">X)</field>
                <field name="QUESTION">The longest river is</field>
                <data>{
                  "id": "0",
                  "answerMD5": "b3aa0a5b32a2cf84b377a389b6250e31"
                }</data>
                <value name="ANSWER">
                  <block type="sparql_prefixed_iri">
                    <field name="PREFIX">dbpedia</field>
                    <field name="LOCAL_NAME">Amazon_River</field>
                  </block>
                </value>
              </block>
            </div>
            When you have found the block that is the solution, drag it inside the
            corresponding test block.
            After solving as much tests as possible, save the workspace, copy the link,
            and past it back on the evaluation form.</p>
          <p>
            As the aim is to evaluate this system, please avoid using your personal
            background knowledge or external systems to solve these tests.</p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>

        </div>
      </div>
      <div id="dialogDataNotice" class="dialogHiddenContent">
        <div class="dialogTitle">Notice on User Privacy</div>
        <div class="dialogContent">
          <p>
            By using this tool you acknowledge the collection
            of usage data for improving the tool and research purposes.
          </p>
          <p>
            For any questions or special requests you can contact
            <a href="mailto:privacy@sparqlblocks.org">privacy@sparqlblocks.org</a>.
          </p>
        </div>
        <div class="farSide" style="padding: 1ex 3ex 0">
          <button class="blocklydialogs-ok"></button>
        </div>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>
