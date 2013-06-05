try { (function(){
  var ADPConfig = {
    items: [                                                                            // Insert your OBA information.
      {
        title:    'zanox',                                                // You can add one or more information items.
        text:     "As Europe's leading performance advertising network, zanox offers publishers access to more than 4,000 advertisers. Benefit from our affiliate marketing know-how to monetize your traffic and make money online. ",                                                // This example handles two information items.
        url:      'http://www.zanox.com',
        linkText: 'More Information'
      }
    ],

    obaId: undefined,                                                                   // Pass in the obaId as string value if it is submitted from the predecessor in the chain.
    domId: 'adp_container_'+(0|9999*Math.random()),                                     // Set the id of AdPlayer container if you want to generate it by yourself.
    createPlayer: true,                                                                 // Must be true, if you deliver the physical ad (last in chain). Otherwise false.

    jspath: 'http://www.HalloSymptoms.com/adplayer/js/adplayer.min.js',                     // Insert the path to your AdPlayer javascript resource.
    csspath: 'http://HalloSymptoms.com/adplayer/css/adplayer.css',                  // Insert the path to your AdPlayer CSS Resource.
    translationpath: 'http://HalloSymptoms/adplayer/js/adplayer-translation.min.js' // Insert the path to your AdPlayer translation resource.
  };

  document.write('<div id="'+ADPConfig.domId+'"></div>');                               // Remove this line if you want to generate the AdPlayer container by yourself.

  // DO NOT MODIFY ANYTHING BELOW THIS LINE!
  (function lazyLoad(){
    if (window.$ADP) {
      if(ADPConfig.translationpath) $ADP.Registry.setTranslation({href: ADPConfig.translationpath});
      var obaId = ADPConfig.obaId ? ADPConfig.obaId : $ADP.Registry.generateId();
      if(ADPConfig.items) {
        for(k in ADPConfig.items) { $ADP.Registry.register(obaId, ADPConfig.items[k]); }
      }
      if (ADPConfig.createPlayer) $ADP.Registry.createPlayer(obaId, {domId: ADPConfig.domId});
    } else {
      if (!document.getElementById('adpscript')) {
        var adp = document.createElement('script'); adp.type = 'text/javascript';
        adp.async = true; adp.src = ADPConfig.jspath; adp.id = 'adpscript';
        document.getElementsByTagName('head')[0].appendChild(adp);
      }
      if (!document.getElementById('adpstyle')) {
        var adp = document.createElement('link'); adp.type = 'text/css';
        adp.href = ADPConfig.csspath; adp.rel = 'stylesheet'; adp.id = 'adpstyle';
        document.getElementsByTagName('head')[0].appendChild(adp);
      }
      window.setTimeout(lazyLoad, 50);
    }
  })();
})();
} catch (e) {}
