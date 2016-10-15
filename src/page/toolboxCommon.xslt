<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:template name="toolbox-common">
    <category name="&#xf104; Patterns" colour="120">
      <block type="sparql_subject_propertylist">
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
      </block>
      <sep gap="32"></sep>
      <block type="sparql_verb_object">
        <value name="VERB">
          <block type="sparql_prefixed_iri">
            <field name="PREFIX">rdf</field>
            <field name="LOCAL_NAME">type</field>
          </block>
        </value>
        <value name="OBJECT">
          <shadow type="variables_get">
            <field name="VAR">type</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_verb_object">
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
      </block>
      <sep gap="32"></sep>
      <block type="sparql_anonsubject_propertylist">
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
      </block>
    </category>
    <category name="&#xf101; Compose" colour="260">
      <block type="sparql_union">
        <value name="OP1">
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
        <value name="OP2">
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
      <block type="sparql_optional">
        <value name="OP">
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
      <block type="sparql_graph">
        <value name="GRAPHNAME">
          <shadow type="variables_get">
            <field name="VAR">graph</field>
          </shadow>
        </value>
        <value name="OP">
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
    </category>
    <sep></sep>
    <category name="&#xf102; Logic" colour="210">
      <block type="sparql_filter">
        <value name="CONDITION">
          <shadow type="sparql_logic_boolean"></shadow>
        </value>
      </block>
      <sep gap="32"></sep>
      <block type="sparql_logic_boolean"></block>
      <sep gap="32"></sep>
      <block type="sparql_logic_compare">
        <value name="A">
          <shadow type="sparql_math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="sparql_math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_logic_operation">
        <value name="A">
          <shadow type="sparql_logic_boolean"></shadow>
        </value>
        <value name="B">
          <shadow type="sparql_logic_boolean"></shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_logic_negate"></block>
      <!-- <block type="sparql_logic_null"></block> -->

      <sep gap="32"></sep>
      <block type="sparql_logic_ternary">
        <value name="IF">
          <shadow type="sparql_logic_boolean"></shadow>
        </value>
        <value name="THEN">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="ELSE">
          <shadow type="sparql_math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>

      <sep gap="32"></sep>
      <block type="sparql_exists">
        <value name="OP">
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
      <sep gap="8"></sep>
      <block type="sparql_not_exists">
        <value name="OP">
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
    </category>
    <category name="&#xf103; Math" colour="230">
      <block type="sparql_math_number"></block>
      <sep gap="32"></sep>
      <block type="sparql_math_arithmetic">
        <value name="A">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_math_single">
        <value name="NUM">
          <shadow type="sparql_math_number">
            <field name="NUM">-3</field>
          </shadow>
        </value>
      </block>
      <!-- <block type="sparql_math_constant"></block> -->
      <sep gap="8"></sep>
      <block type="sparql_math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="sparql_math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_math_round">
        <value name="NUM">
          <shadow type="sparql_math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_math_modulo">
        <value name="DIVIDEND">
          <shadow type="sparql_math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="sparql_math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_math_constrain">
        <value name="VALUE">
          <shadow type="sparql_math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="sparql_math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>

      <sep gap="32"></sep>
      <block type="sparql_math_random_int">
        <value name="FROM">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="sparql_math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_math_random_float"></block>
    </category>
    <category name="&#xf109; Text" colour="160">
      <block type="sparql_text"></block>
      <sep gap="8"></sep>
      <block type="sparql_text_with_lang">
        <field name="LANG">en</field>
      </block>

      <sep gap="32"></sep>
      <block type="sparql_text_join"></block>
      <sep gap="8"></sep>
      <block type="sparql_text_length">
        <value name="VALUE">
          <shadow type="sparql_text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_text_isEmpty">
        <value name="VALUE">
          <shadow type="sparql_text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_text_charAt">
        <value name="VALUE">
          <shadow type="sparql_text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
        <value name="AT">
          <shadow type="sparql_math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_text_getSubstring">
        <value name="STRING">
          <shadow type="sparql_text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
        <value name="AT1">
          <shadow type="sparql_math_number">
            <field name="NUM">2</field>
          </shadow>
        </value>
        <value name="AT2">
          <shadow type="sparql_math_number">
            <field name="NUM">3</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_text_changeCase">
        <value name="TEXT">
          <shadow type="sparql_text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <sep gap="8"></sep>
      <block type="sparql_text_contains">
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
      <!-- <block type="sparql_text_regex">
        <value name="FIND">
          <block type="sparql_text"></block>
        </value>
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">text</field>
          </block>
        </value>
      </block> -->
      <sep gap="32"></sep>
      <block type="sparql_text_lang">
        <value name="LANG">
          <shadow type="sparql_text">
            <field name="TEXT">en</field>
          </shadow>
        </value>
        <value name="VALUE">
          <shadow type="sparql_text_with_lang">
            <field name="TEXT">play</field>
            <field name="LANG">en</field>
          </shadow>
        </value>
      </block>
      <sep gap="32"></sep>
      <block type="sparql_hash">
        <value name="TEXT">
          <shadow type="sparql_text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="&#xf107; Resources" colour="20" custom="RESOURCE"></category>
    <sep></sep>
    <category name="&#xf10b; Variables" colour="330" custom="VARIABLE"></category>
    <sep></sep>
    <category name="&#xf100; Vocab" colour="20">
      <category name="• RDF(S)">
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">rdf</field>
              <field name="LOCAL_NAME">type</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">type</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">rdfs</field>
              <field name="LOCAL_NAME">seeAlso</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">relatedResource</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">rdfs</field>
              <field name="LOCAL_NAME">isDefinedBy</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">definition</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">rdf</field>
              <field name="LOCAL_NAME">value</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">value</field>
            </shadow>
          </value>
        </block>
      </category>
      <category name="• Dublin Core">
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">dcterms</field>
              <field name="LOCAL_NAME">title</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">title</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">dcterms</field>
              <field name="LOCAL_NAME">subject</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">subject</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">dcterms</field>
              <field name="LOCAL_NAME">creator</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">creator</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">dcterms</field>
              <field name="LOCAL_NAME">publisher</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">publisher</field>
            </shadow>
          </value>
        </block>
      </category>
      <category name="• FOAF">
        <block type="sparql_subject_propertylist">
          <value name="SUBJECT">
            <shadow type="variables_get">
              <field name="VAR">agent</field>
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
                  <field name="LOCAL_NAME">Agent</field>
                </block>
              </value>
            </block>
          </statement>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_subject_propertylist">
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
        <sep gap="32"></sep>
        <block type="sparql_verb_object">
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
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">foaf</field>
              <field name="LOCAL_NAME">depiction</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">picture</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
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
      </category>
      <category name="• Geo">
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">geo</field>
              <field name="LOCAL_NAME">lat</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">latitude</field>
            </shadow>
          </value>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_verb_object">
          <value name="VERB">
            <block type="sparql_prefixed_iri">
              <field name="PREFIX">geo</field>
              <field name="LOCAL_NAME">long</field>
            </block>
          </value>
          <value name="OBJECT">
            <shadow type="variables_get">
              <field name="VAR">longitude</field>
            </shadow>
          </value>
        </block>
      </category>
    </category>
    <category name="&#xf10a; Search" colour="290">
      <block type="sparql_builtin_resources">
        <field name="ENDPOINT">http://dbpedia.org/sparql</field>
        <value name="GRAPH">
          <block type="sparql_iri">
            <field name="IRI">http://dbpedia.org</field>
          </block>
        </value>
        <value name="TYPE">
          <shadow type="sparql_prefixed_iri">
            <field name="PREFIX">owl</field>
            <field name="LOCAL_NAME">Thing</field>
          </shadow>
        </value>
        <value name="FIND">
          <shadow type="sparql_text_with_lang">
            <field name="TEXT">abc</field>
            <field name="LANG">en</field>
          </shadow>
        </value>
        <field name="LIMIT">5</field>
      </block>
      <block type="sparql_builtin_classes">
        <field name="ENDPOINT">http://dbpedia.org/sparql</field>
        <value name="GRAPH">
          <block type="sparql_iri">
            <field name="IRI">http://dbpedia.org</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="sparql_text_with_lang">
            <field name="TEXT">abc</field>
            <field name="LANG">en</field>
          </shadow>
        </value>
        <field name="LIMIT">5</field>
      </block>
      <block type="sparql_builtin_properties">
        <field name="ENDPOINT">http://dbpedia.org/sparql</field>
        <value name="GRAPH">
          <block type="sparql_iri">
            <field name="IRI">http://dbpedia.org</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="sparql_text_with_lang">
            <field name="TEXT">abc</field>
            <field name="LANG">en</field>
          </shadow>
        </value>
        <field name="LIMIT">5</field>
      </block>
    </category>
  </xsl:template>
</xsl:stylesheet>
