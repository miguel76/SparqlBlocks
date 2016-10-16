<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:import href="toolboxDemo.xslt"/>
  <xsl:import href="toolboxTest.xslt"/>
  <xsl:import href="toolboxGuide.xslt"/>
  <xsl:import href="dialogsForGuide.xslt"/>

  <xsl:param name="bundledLibs" select="false"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>SparqlBlocks Demo</title>

        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>

        <xsl:if test="not($bundledLibs)">
          <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
        </xsl:if>

        <script src="js/sparqlblocks.min.js"></script>
      </head>
      <body>
        <div id="blocklyDiv"></div>

        <xsl:call-template name="toolbox-demo"/>
        <xsl:call-template name="toolbox-test"/>
        <xsl:call-template name="toolbox-guide"/>

        <div id="dialogShadow" class="dialogAnimate"></div>
        <div id="dialogBorder"></div>
        <div id="dialog"></div>

        <div id="flash-messages" class="flash-messages"></div>

        <xsl:call-template name="dialogs-for-guide"/>

      </body>
    </html>
  </xsl:template>

  <xsl:output method="html" encoding="utf-8" indent="yes"/>

</xsl:stylesheet>
