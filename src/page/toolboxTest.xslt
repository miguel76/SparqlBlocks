<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:import href="toolboxCommon.xslt"/>
  <xsl:template name="toolbox-test">
    <xml id="toolboxTest" style="display: none">
      <category name="&#xf106; Query" colour="290">
        <block type="sparql_execution_endpoint_query">
          <field name="ENDPOINT">http://dbpedia.org/sparql</field>
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
      <sep></sep>
      <category name="&#xf108; Test" colour="330">
        <block type="sparql_test_class">
          <field name="INDEX">a.1)</field>
          <field name="QUESTION">mountains:</field>
          <data>{
            "id": "1",
            "answerMD5": "2bd86839cd03700675d6bcf3f34a8684"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test_property">
          <field name="INDEX">a.2)</field>
          <field name="QUESTION">elevation of mountains:</field>
          <data>{
            "id": "2",
            "answerMD5": "2f9c48a704a5537b6c31fded840b8900"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test">
          <field name="INDEX">A)</field>
          <field name="QUESTION">3rd highest mountain:</field>
          <data>{
            "id": "3",
            "answerMD5": "0ec28cc250117935cf9a2cdb8ccc31ba"
          }</data>
        </block>
        <sep gap="32"></sep>
        <block type="sparql_test">
          <field name="INDEX">B)</field>
          <field name="QUESTION">Lowest mountain above 8,000 m:</field>
          <data>{
            "id": "4",
            "answerMD5": "28b96c850d9186e0781fecb5e854ea2b"
          }</data>
        </block>
        <sep gap="32"></sep>
        <block type="sparql_test_class">
          <field name="INDEX">c.1)</field>
          <field name="QUESTION">countries:</field>
          <data>{
            "id": "5",
            "answerMD5": "9f5ea8213289919f8fa8bedd19f3eb96"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test_property">
          <field name="INDEX">c.2)</field>
          <field name="QUESTION">'located in' (mountain->country):</field>
          <data>{
            "id": "6",
            "answerMD5": "c0b2865f7555c5d0963e39fdc149458a"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test_resource">
          <field name="INDEX">c.3)</field>
          <field name="QUESTION">China:</field>
          <data>{
            "id": "7",
            "answerMD5": "9be7bcb10ccd7c92e55a9c09b91bf30d"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test_resource">
          <field name="INDEX">c.4)</field>
          <field name="QUESTION">Nepal:</field>
          <data>{
            "id": "8",
            "answerMD5": "bd2b07bfff06dbad927da2e2dd1a5a33"
          }</data>
        </block>
        <sep gap="8"></sep>
        <block type="sparql_test">
          <field name="INDEX">C)</field>
          <field name="QUESTION">3rd highest mountain between China and Nepal:</field>
          <data>{
            "id": "9",
            "answerMD5": "b2e13235a2e1ee782e78e78589828c03"
          }</data>
        </block>
      </category>
    </xml>
  </xsl:template>
</xsl:stylesheet>
