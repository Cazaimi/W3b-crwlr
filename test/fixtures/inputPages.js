/* eslint-disable */

module.exports = {
  simplePageWithTags () {
    return '<html><head>' + 
    '    <!-- Global site tag (gtag.js) - Google Analytics -->' + 
    '<script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"></script><script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-140073467-1"></script>' + 
    '<script>' + 
    '  window.dataLayer = window.dataLayer || [];' + 
    '  function gtag(){dataLayer.push(arguments);}' + 
    '  gtag("js", new Date());' + 
    '' + 
    '  gtag("config", "UA-140073467-1");' + 
    '</script>' + 
    '' + 
    '    <title>Cazaimi - Anmol Shukla</title>' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/index.css">' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/font.css">' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/darkTheme.css">' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/header.css">' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/footer.css">' + 
    '    <link rel="stylesheet" type="text/css" href="/assets/css/timer.css">' + 
    '    ' + 
    '    <link rel="shortcut icon" type="image/png" href="/assets/images/favicon.png">' + 
    '    <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet">' + 
    '  </head>' + 
    '  <body>' + 
    '    <div id="topLevelContainer">' + 
    '      <div id="belowHeaderContainer">' + 
    '        <div id="theme">' + 
    '  <a id="themeLink"><img src="/assets/images/logos/darth.svg" id="themeImage"></a>' + 
    '</div>' + 
    '' + 
    '        <div id="timer"><p id="timerText">10:03:07 PM</p></div>' + 
    '' + 
    '<script src="/assets/js/timer.js"></script>' + 
    '      </div>' + 
    '      <div id="headerContainer">' + 
    '  <div id="siteMapLinks">' + 
    '    <a id="siteMapLink" href="/index.html">' + 
    '      <h2>~/</h2>' + 
    '    </a> ' + 
    '    <a id="siteMapLink" href="/projects.html">' + 
    '      <h2>PROJECTS</h2>' + 
    '    </a>' + 
    '    <a id="siteMapLink" href="/posts.html">' + 
    '      <h2>POSTS</h2>' + 
    '    </a> ' + 
    '    <a id="siteMapLink" href="/about.html">' + 
    '      <h2>ABOUT</h2>' + 
    '    </a>' + 
    '    <a id="siteMapLink" href="/contact.html">' + 
    '      <h2>CONTACT</h2>' + 
    '    </a> ' + 
    '  </div>' + 
    '</div>' + 
    '      <div id="mainContentContainer">' + 
    '        <h1 id="anmol-shukla-aka-cazaimi">Anmol Shukla a.k.a. Cazaimi</h1>' + 
    '' + 
    '<h2 id="hi--">Hi ! 👋</h2>' + 
    '' + 
    '<h3 id="im-anmol-and-i-am-a-developer--postman-i-like-building-software-and-solving-puzzles">I’m Anmol and I am a developer @ <a href="https://www.getpostman.com" title="Postman">Postman</a>. I like building software and solving puzzles.</h3>' + 
    '<h3 id="--">. . .</h3>' + 
    '' + 
    '      </div>' + 
    '      <footer class="footer">' + 
    '  <div class="footerDiv" id="copyRight">' + 
    '    © 2019 Anmol Shukla' + 
    '  </div>' + 
    '  <div class="footerDiv">|</div>' + 
    '  <div class="footerDiv" id="licenseContainer">' + 
    '    <a id="CCBYNC" target="blank" rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>' + 
    '  </div>' + 
    '  <div class="footerDiv">|</div>' + 
    '  <div class="footerDiv">' + 
    '    Powered by <a target="blank" id="poweredBy" href="https://jekyllrb.com/">Jekyll</a>' + 
    '  </div>' + 
    '  <div class="footerDiv">|</div>' + 
    '  <div class="footerDiv">' + 
    '    Icons by <a target="blank" id="icon" href="https://icons8.com/">icons8</a>' + 
    '  </div>' + 
    '</footer>' + 
    '' + 
    '      <script src="/assets/js/themeToggle.js"></script>' + 
    '    </div>' + 
    '  ' + 
    '</body></html>'
  },

  pageWithOnlyALinkToItself (webpage) {
    return `<html> \
      <body> \
        <a href='${webpage}'>Something</a> \
      </body> \
    </html>`;
  },

  pageWithTwoLevelWebTree () {
    let level1 = '<html> \
      <body> \
        <a href="https://www.google.com">Google</a> \
        <a href="https://is.the.root/twitter">Twitter</a> \
        <a href="https://is.the.root/path">Path</a> \
      </body> \
    </html>',
    level2 = {
      path: '<html> \
          <body> \
            <a href="https://www.twitter.com">Twitter</a> \
          </body> \
        </html>',
      twitter: '<html>\
          <body>\
            <a href="https://www.cazaimi.tech">This is me!</a>\
          </body>\
        </html>'
      };

    return { level1, level2 };     
  }
};
