<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:import href="toolboxCommon.xslt"/>
  <xsl:template name="toolbox-guide">
    <xml id="toolboxGuide" style="display: none">
      <category name="&#xf106; Query" colour="290">
        <block type="sparql_execution_endpoint_query">
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
      </category>
      <xsl:call-template name="toolbox-common"/>
    </xml>
  </xsl:template>
</xsl:stylesheet>
