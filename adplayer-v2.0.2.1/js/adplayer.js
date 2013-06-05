/*
   -------------------------------------------------------------------------------------------
   AdPlayer v2.0.2.FINAL (FINAL.101512)
   Authors: christopher.sancho@adtech.com
            felix.ritter@adtech.com
            ingrid.graefen@sevenonemedia.de
            marius.naumann@bauermedia.com
            anton.parsons@adition.com
            andreas.berenz@adition.com
            o.wagner@raumobil.de
            
   -------------------------------------------------------------------------------------------
  
   This file is part of AdPlayer v2.0.2.FINAL (FINAL.101512).
   AdPlayer is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
 
   AdPlayer is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with AdPlayer.  If not, see <http://www.gnu.org/licenses/>.
  
  --------------------------------------------------------------------------------------------
*/
/**
 * @name $ADP
 * @namespace
 */
if (!window.$ADP) $ADP = {};

/**
 * @name $ADP.Registry
 * @class
 * @description The <code>$ADP.Registry</code> class.
 *
 * @example
 * TODO
 *
 *  // structure of OBA.Registry.data
 *  // plain data, no reference to other OBA objects
 *  {
 *    123: {
 *        timeoutId: 7,
 *        domId: oba123,
 *        header: 'Header',
 *        footer: 'Footer',
 *        items: [
 *            {
 *              title:    'title1',
 *              text:     'text1',
 *              url:      'url1',
 *              linkText: 'linkText1',
 *              usePopupForPrivacyinfo: true
 *            },
 *            {
 *              title:    'title2',
 *              text:     'text2',
 *              url:      'url2',
 *              linkText: 'linkText2'
 *            }
 *          ]
 *      }
 *  }
 *
 */
$ADP.Registry = $ADP.Registry || {
  data: {},
  translationFile: false,
  wait: 2000,

  LAST: 'LAST',
  MAIN: 'MAIN',
  POPUP: 'POPUP',
  FRIENDLY_IFRAME: 'FRIENDLY_IFRAME',
  FOREIGN_IFRAME: 'FOREIGN_IFRAME',
  POSTMESSAGE_SEARCH: 'POSTMESSAGE_SEARCH',
  
  publisherInfo: undefined,

  /**
   * @name $ADP.Registry#register
   * @function
   * @description Registers the privacy item for an AdPlayer chain. 
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages 
   * @param {object}  args   The Arguments
   * @param {string}  args.header   The header text
   * @param {string}  args.footer   The footer text 
   * @param {string}  args.domId   The domId where the privacy button must be rendered
   * @param {string}  args.title  The name of the privacy party
   * @param {string}  args.text   The short description 
   * @param {string}  args.url    The opt out or more information url
   * @param {string}  args.linkText  The text that should be displayed instead of the link url
   * @param {boolean} args.usePopup  Boolean to display privacy info in a popup
   * @param {boolean} args.renderCloseButton  Boolean to display close-button in a popup 
   *  
   */
  register: function (id, args) {
    this._register(id, args, false);
  },
  
  /**
   * @name $ADP.Registry#_register
   * @function
   * @description Internal register function that registers the privacy item for an AdPlayer chain. 
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages 
   * @param {object}  args   The Arguments
   * @param {string}  args.header   The header text
   * @param {string}  args.footer   The footer text 
   * @param {string}  args.domId   The domId where the privacy button must be rendered
   * @param {string}  args.title  The name of the privacy party
   * @param {string}  args.text   The short description 
   * @param {string}  args.url    The opt out or more information url
   * @param {string}  args.linkText  The text that should be displayed instead of the link url
   * @param {boolean} args.usePopup  Boolean to display privacy info in a popup
   * @param {boolean} args.renderCloseButton  Boolean to display close-button in a popup 
   * @param {boolean} useUnshift   The unShift variable is set when the item needs to be inserted in
   *     front of the current items, This occurs when one is adding items from a parent Registry object
   * 
   */
  _register: function (id, args, useUnshift) {
    if (!args) args = {};
    if (!this.data[id]) {
      this.data[id] = {
        items: []
      };
    }
    var item = {};
    for (var k in args) {
      switch (k) {
        case 'domId':
          this.data[id][k] = args[k]; // last one wins
          break;
        case 'header':
        case 'footer':
        case 'title':
        case 'text':
        case 'url':
        case 'linkText':
        case 'usePopup':
        case 'renderCloseButton':
          item[k] = args[k];
          break;
        default:
          // invalid => ignore
          break;
      }
    }
    if (!useUnshift) {
      this.data[id].items.push(item);
    } else {
      this.data[id].items.unshift(item);
    }
    
    $ADP.Util.log('Registered item with title "' + args['title'] + '" for ID ' + id);
    
  },

  /**
   * @name $ADP.Registry#unregister
   * @function
   * @description Unregisters the privacy item for an AdPlayer chain.
   * 
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages.
   */
  unregister: function (id) {
    if (!this.data[id]) return;
    delete this.data[id];
  },
  
  /**
   * @name $ADP.Registry#getById
   * @function
   * @description Returns the current list of registry item by id.
   * 
   * @param {integer} id  The OBA id that is used to identify this player's unique privacy messages.
   * 
   * @return {array} The current list of registry items.
   */
  getById: function (id) {
    var items = [];
    if (this.data[id]) items = this.data[id].items || [];
    return items;
  },
  
  /**
   * @name $ADP.Registry#pullById
   * @function
   * @description Will return and unregister the privacy messages for the supplied OBA id.
   * 
   * @param {integer} id the OBA id that is used to identify this player's unique privacy messages.
   * 
   * @return {array} The current list of registry items.
   */
  pullById: function (id) {
    var items = this.getById(id);
    this.unregister(id);
    return items;
  },
  
  /**
   * @name $ADP.Registry#getDOMId
   * @function
   * @description Returns the player's OBA DOM id.
   * 
   * @param {integer} id  The OBA DOM id that is used to identify this player's unique privacy messages.
   * 
   * @return {integer} The player's OBA DOM id.
   */
  getDOMId: function (id) {
    if (this.data[id]) {
      return this.data[id].domId;
    }
  },
  
  /**
   * @name $ADP.Registry#hasId
   * @function
   * @description Returns a boolean that determines if an id has been set.
   * @param {integer} id The OBA id that is used to identify this player's unique privacy messages.
   * @return {boolean} <code>true</code> / <code>false</code>
   */
  hasId: function (id) {
    return this.data[id] ? true : false;
  },
  
  setPublisherInfo: function(info) {
    if(typeof this.publisherInfo === 'undefined') {
      this.publisherInfo = info;
    }
  },

  /**
   * @name  $ADP.Registry#checkParentAccess
   * @function
   * @description Check how we can access to given window
   *
   * @param window
   */
  checkParentAccess: function (window) {
	  var type;
      var adpAccess = function(win) { try { return Boolean(win.$ADP) } catch(e) { return false; } };
	  try {
		  if(window.parent.location.href == undefined) {
			  type = this.FOREIGN_IFRAME;
		  }
		  else
		  {
			  if (adpAccess(window.parent)) {
		        type = this.FRIENDLY_IFRAME;
		      } else {
		        type = this.POSTMESSAGE_SEARCH;
		      }
		  }
  	  } catch (e) {
		  type = this.FOREIGN_IFRAME;
  	  }
  	  return type;
  },

  /**
   * @name  $ADP.Registry#getWindowChain
   * @function
   * @description Collect Informations from all Parents in the Chain
   *
   * @param id
   */
  getWindowChain: function(id) {
	  if(!this.data[id].windowChain) {
		  var type = this.checkParentAccess(window.parent);
	      var chain = {1: {type: type, window: window, parent: window.parent}};
		  
	      if(window != window.parent) {
	    	  var doLoop = true;
	    	  var i = 2;
	    	  var nextWindow = window.parent;
	    	  var type;
	    	  while(doLoop) {
		    	  if(nextWindow == nextWindow.parent) {
		    		  type = this.checkParentAccess(nextWindow.parent);
		    		  chain[i] = {type:type, window: nextWindow};
		    		  doLoop = false;
		    	  }  
		    	  else
		    	  {
		    		  type = this.checkParentAccess(nextWindow.parent);
		    		  chain[i] = {type: type, window: nextWindow, parent:nextWindow.parent};
			          nextWindow = nextWindow.parent;
		    	  }
		    	  i++;
	    	  }
	    	  if(window.opener) {
	    		  type = this.checkParentAccess(window.opener);
	    		  chain[i] = {type: type, window: window, parent:window.opener};
	    	  }
	      }
	      else if(window.opener) {
    		  type = this.checkParentAccess(window.opener);
    		  chain[2] = {type: type, window: window, parent:window.opener};	    	  
	      }
	      this.data[id].windowChain = chain;
	  }
	  return this.data[id].windowChain;
  },
  
  /**
   * @name  $ADP.Registry#checkAndReducePostMessageCounter
   * @function
   * @description Reduce the postMessageCounter. Calls $ADP.Registry.submitPrivacy() if Counter == 0
   *
   * @param id
   */
  checkAndReducePostMessageCounter: function(id) {
	  this.data[id].postMessageCounter--;

	  if(this.data[id].postMessageCounter == 0) {
		  clearTimeout(this.data[id].postMessageTimeout);
	      this.submitPrivacy(id);
      }
  },
  
  /**
   * @private
   * @name  $ADP.Registry#registerParentItems
   * @function
   * @description Adds all the parent privacy items to the beginning of the current items list for
   *     the given id. This will also clear all invoked <code>tryNextParent</code> methods that are
   *     currently in progress fir this Adplayer chain id.
   *
   * @param id     The id of the Adplayer chain.
   * @param items  The array of privacy items.
   * 
   * @see $ADP.Registry#tryNextParent
   */
  registerParentItems: function (id, items) {
    if (!items) items = [];
    if (!this.data[id]) return;
    if (this.data[id].iframeSearch && this.data[id].iframeSearch.timeoutId) {
      clearTimeout(this.data[id].iframeSearch.timeoutId);
    }
    items.reverse();
    for (var k in items) {
      $ADP.Registry._register(id, items[k], true);
    }
  },
  
  /**
   * @name  $ADP.Registry#createPlayer
   * @function
   * @description This method is used to create the player for the given player id 
   * 
   * @param id     The id of the Adplayer chain
   * @param items  The array of privacy items
   */
  createPlayer: function (id, args) {
	$ADP.Util.log('$ADP.Registry.createPlayer called for ID ' + id);
    if (!args) args = {};
    var header = args.header || undefined; //TODO: Testen was rauskommt wenn nix �bergeben wird. Evt. kann man sich das undefined hier sparen
    var footer = args.footer || undefined;
    var publisherInfo = this.publisherInfo || '';
    var domId = args.domId;
    var position = args.position || 'top-right';
    var usePopup = args.usePopup || true;
    var renderCloseButton = args.renderCloseButton == false ? false : true;
    if (!this.data[id]) this.data[id]={domId: null, items:[]};
    
    if (domId) this.data[id].domId = domId; // last one wins
    domId = this.getDOMId(id);
    
	  var player = $ADP.Player(id, {
	    domId: domId,
	    position: position,
	    header: header,
	    footer: footer,
	    publisherInfo: publisherInfo,
	    usePopup: usePopup,
	    renderCloseButton: renderCloseButton
	  });
	  player.inject();
	  this.data[id].player = player;

	  $ADP.Util.log('AdPlayer created for ID ' + id);
	  return player;
  },

  /**
   * @name    $ADP.Registry#generateId
   * @function
   * @description Generates a new and unused id.<br/><br/>
   *        <b>Note:</b> This method does not register any data at $ADP.Registry.
   * 
   * @returns   {Integer} Returns the generated id.
   */
  generateId: function () {
    var id;
    do {
      id = parseInt(Math.random() * 100000000);
    }
    while (this.hasId(id)); 
    
    $ADP.Util.log('Adplayer generated ID ' + id);
    
    return id;
  },
  
  /**
   * @private
   * @name    $ADP.Registry#messageHandler
   * @function
   * @description Handles the pull and unregister requests made from other windows.
   * 
   * @param event The window post message event object.
   */
  messageHandler: function (event) {
    try {
      var msg = $ADP.Message.parse(event.data),
        src = event.source,
        result = "";
      if (src == window) {
        return null;
      }

      switch (msg.type) {
        case $ADP.Message.types.pullOBA:
          result = $ADP.Registry.getById(msg.data);
          $ADP.Message.send(src, $ADP.Message.types.pullOBA_ACK, {
            id: msg.data,
            items: result
          });
          break;
        case $ADP.Message.types.unRegOBA:
          result = $ADP.Registry.unregister(msg.data);
//          $ADP.Message.send(src, $ADP.Message.types.unRegOBA_ACK, {
//            id: msg.data,
//            result: result
//          });
          break;
        case $ADP.Message.types.pullOBA_ACK:
            if (msg.data.id && msg.data.items && msg.data.items.length) {
	          $ADP.Registry.registerParentItems(msg.data.id, msg.data.items);
	          $ADP.Message.send(src, $ADP.Message.types.unRegOBA, msg.data.id);
	          
	          $ADP.Registry.checkAndReducePostMessageCounter(msg.data.id);
	        }
          break;
//        case $ADP.Message.types.unRegOBA_ACK:     	
//            break;
      }
    } catch (e) {$ADP.Util.log("Received Message",event," Rejected ",e);}
  },
  
  /**
   * @name $ADP.Registry#getItems
   * @function
   * @description Convertes items in $ADP.PrivacyInfo() an return these
   * 
   * @param id
   * 
   */
  getItems: function(id) {
	  var rawItems = this.data[id].items;
	  var items = [];
      for (var i = 0; i < rawItems.length; i++) {
    	  
    	if(rawItems[i].usePopup == false) {
    	  this.data[id].player.usePopup = false;
    	}
    	if(rawItems[i].renderCloseButton == false) {
    	  this.data[id].player.renderCloseButton = false;
      	}
    	
        var privacyInfo = $ADP.PrivacyInfo(rawItems[i]);
        if (privacyInfo.isValid()) items.push(privacyInfo);
      }
      return items;
  },
  
  /**
   * @name $ADP.Registry#collectPrivacy
   * @function
   * @description Collect Privacy Information from parents
   * 
   * @param id
   * 
   */
  collectPrivacy: function (id) {
	  var usePopup = true;
	  if(this.data[id].items && this.data[id].items.length) {
		  for(var i in this.data[id].items) {
			  if(this.data[id].items[i].usePopup == false) {
				  usePopup = false;
			  }
		  }
	  }
	  
	  if(usePopup) {
		if(this.data[id].player.popup) { this.data[id].player.popup.close() }
		
		try{
		  var randomPopupName = 'adp_info_' + Math.floor(Math.random()*100001);
		  popwin = window.open('',randomPopupName,'width=400,height=500,scrollbars=yes,location=0,menubar=0,toolbar=0,status=0');
		} catch(e) {popwin = window.open('about:blank');}
		
		this.data[id].player.popup = popwin;
	  }
		
	  if(this.data[id].player.items && this.data[id].player.items.length) {
		this.submitPrivacy(id);
	  } else {
		var chain = this.getWindowChain(id);
		
		var windowsInitWithPostMessage = [];
		
		for(var k in chain) {
			var items;
			if(!chain[k].parent || chain[k].parent == window) {}
			else if(chain[k].type == this.FOREIGN_IFRAME || chain[k].type == this.POSTMESSAGE_SEARCH) {
				  windowsInitWithPostMessage.push(chain[k]);
			}
			else {
				if(chain[k].window && chain[k].window.name) {
					try {
						items = $ADP.Util.JSON.parse($ADP.Util.atob(chain[k].window.name.replace(/^[^-]+\-([A-Za-z0-9\+\/]+=?=?=?)$/,'$1')));
					} catch (e) {}
				}
				
				if(!items) {
					try {
						items = chain[k].parent.$ADP.Registry.getById(id);
					} catch (e) {}
				}
				
				if(items.length) {
					$ADP.Registry.registerParentItems(id, items);
				}
			}
		}
		
		if(windowsInitWithPostMessage && windowsInitWithPostMessage.length) {
			if(window.postMessage) {
			  this.initByPostMessage(id, windowsInitWithPostMessage);
			} else {
			  this.initByWindowName(id, windowsInitWithPostMessage);
			}
		}
		else {
			this.submitPrivacy(id);
		}
	}
  },
  
  /**
   * @name $ADP.Registry#initByPostMessage
   * @function
   * @description This function will attempt to load the privacy information from its parents. This is used for non-friendly IFrames
   * @param {integer} id  the oba id
   * @param {DOMElement} windows  The current window thats parent will be sent the post message request
   */
  initByPostMessage: function(id, windows) {
    for(k in windows) {
	  if(this.data[id].postMessageCounter) {
    	this.data[id].postMessageCounter++;
	  }
      else {
    	this.data[id].postMessageCounter = 1;
      }
      $ADP.Message.send(windows[k].parent, $ADP.Message.types.pullOBA, id);
	}
	
    this.data[id].postMessageTimeout = setTimeout(function () {
  	  $ADP.Registry.submitPrivacy(id);
    }, 1000);	
  },
  
  initByWindowName: function(id, windows) {
	for(k in windows) {
	  if(!windows[k].window.name) return;
	    try {
		  var items = $ADP.Util.JSON.parse($ADP.Util.atob(windows[k].window.name.replace(/^[^-]+\-([A-Za-z0-9\+\/]+=?=?=?)$/,'$1')));
		  if (items.length) {
		    this.registerParentItems(id,items);
		  }
	  } catch(e) {}
	}
	this.submitPrivacy(id);
  },
  
  /**
   * @name $ADP.Registry#submitPrivacy
   * @function
   * @description submit PrivacyInformations to the Player
   * 
   * @param id
   * 
   */
  submitPrivacy: function (id) {
    if(!this.data[id] && !this.data[id].player) return;
    

	if(!this.data[id].player.items || this.data[id].player.items.length) {
	  this.data[id].player.items = this.getItems(id);
	}
    this.data[id].player['showPrivacy'].apply(this.data[id].player,[]);
  },
  
  /**
   * @name $ADP.Registry#playerCmd
   * @function
   * @description This is used to execute a function call on the player created for obaid 
   * 
   * @param id The oba id
   * @param cmd The function to be executed
   * @param args The array of arguments to be passed to the function
   * 
   */
  playerCmd: function(id,cmd,args) {
    if(!cmd) return;
    if(!this.data[id] && !this.data[id].player) return;
    if(!args) args=[];
    
    this.data[id].player.items = this.getItems(id);
    
    if (typeof this.data[id].player[cmd] == 'function') {
      this.data[id].player[cmd].apply(this.data[id].player,args);
    }
  },
  
  setTranslation: function(src) {
	  if(!this.translationFile && src['href']) {
		  this.translationFile = src['href'];
	  }
  },

  /**
   * @private
   * @name   $ADP.Registry#init
   * @function
   * @description The <code>init</code> method is called once the <code>AdPlayer</code> library
   *     has been declared.  This allows events to be registered and functions to be properly
   *     executed once the library has completely loaded.
   */
  init: function () {
	if (window.addEventListener) {
	  window.addEventListener("message", $ADP.Registry.messageHandler, false);
	} else if (window.attachEvent) {
	  window.attachEvent('onmessage', $ADP.Registry.messageHandler);
	}
  }
};
if(!$ADP.Player) {

	/**
	 * @name $ADP.Player
	 * @class
	 * @description The <code>$ADP.Player</code> class.
	 * @param id See {@link $ADP.Registry#register}
	 * @param args See {@link $ADP.Registry#register}
	 * @example TODO
	 */
	$ADP.Player = function (id, args) {
		return this instanceof $ADP.Player ? this.init(id, args) : new $ADP.Player(id, args);
	}
	
	$ADP.Player.prototype = {
		/**
		 * @private
		 * @name $ADP.Player#attempts
		 * @field
		 * @description Used to keep track of current attempts being made.
		 * 
		 * @type integer
		 */
	    attempts: 0,
	
	    /**
		 * @name $ADP.Player#maxAttempts
		 * @field
		 * @description The maximum amount of attempts to wait for the
		 *              <code>Player</code>'s container to be available in the
		 *              DOM.
		 * 
		 * @default 50
		 * @type integer
		 */
	    maxAttempt: 50,

	    browserLanguage: undefined,
	    documentCharset: undefined,
	
	    /**
		 * @name $ADP.Player#adChoicesTranslation
		 * @description Array with the Translations from "Datenschutzinfo" in all
		 *              languages
		 */
	    
	    translation: {
	    	de: {
	    		adchoices: "Datenschutzinfo",
	    		header: '<strong class="adp-header-strong">Informationen zu nutzungsbasierter Online-Werbung</strong><br/>In der vorliegenden Anzeige werden Ihre Nutzungsdaten anonym erhoben bzw. verwendet, um Werbung f&uuml;r Sie zu optimieren. Wenn Sie keine nutzungsbasierte Werbung mehr von den hier gelisteten Anbietern erhalten wollen, k&ouml;nnen Sie die Datenerhebung beim jeweiligen Anbieter direkt deaktivieren. Eine Deaktivierung bedeutet nicht, dass Sie k&uuml;nftig keine Werbung mehr erhalten, sondern, dass die Auslieferung durch den jeweiligen Dienstleister nicht anhand anonym erhobener Nutzungsdaten erfolgt.',
	    		footer: 'Wenn Sie mehr &uuml;ber nutzungsbasierte Online-Werbung erfahren wollen, klicken Sie <a href="http://meine-cookies.org" target="_blank">hier</a>. Dort k&ouml;nnen Sie dar&uuml;ber hinaus auch bei weiteren Anbietern die Erhebung der Nutzungsinformationen deaktivieren bzw. aktivieren und den Status der Aktivierung bei unterschiedlichen Anbietern <a href="http://meine-cookies.org/cookies_verwalten/praeferenzmanager-beta.html" target="_blank">einsehen</a>.'
	    	},
	    	en: {
	    		adchoices: "AdChoices",
	    		header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'
	    	},
	    	fr: {
	    		adchoices: "Choisir sa pub",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'			
	    	},
	    	nl: {
	    		adchoices: "Info reclamekeuze",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'
	    	},
	    	bg:{
	    		adchoices: "&#1042;&#1072;&#1096;&#1080;&#1103;&#1090; &#1080;&#1079;&#1073;&#1086;&#1088;",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'
	    	},
	    	cs:{
	    		adchoices: "Volby reklamy"
	    	},
	    	da:{
	    		adchoices: "Annoncevalg"
	    	},
	    	fi:{
	    		adchoices: "Mainokseni"
	    	},
	    	el:{
	    		adchoices: "&#927;&#953; &#948;&#953;&#945;&#966;&#951;&#956;&#943;&#963;&#949;&#953;&#962; &#956;&#959;&#965;"
	    	},
	    	it:{
	    		adchoices: "Scegli tu!"
	    	},
	    	nl:{
	    		adchoices: "Info",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'
	    	},
	    	no:{
	    		adchoices: "Annonsevalg"
	    	},
	    	pl:{
	    		adchoices: "Informacja",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'

	    	},
	    	ro:{
	    		adchoices: "Optiuni"
	    	},
	    	sk:{
	    		adchoices: "Va&#353;a vo&#318;ba"
	    	},
	    	es:{
	    		adchoices: "Gesti&#243;n anuncios",
				header: '<strong class="adp-header-strong">Information about Online Behavioural Advertising</strong><br/>In the current ad your usage (behavioural) data are collected anonymously and used to optimize advertising for you. If you do not want to receive any more behavior-based advertising by the vendors listed here, you can &#8220;turn off&#8221;  the collection of data at the providers level directly. &#8220;Turn off&#8221; does not mean that you will not receive any advertisements in the future. It means that the current campaign is not delivered on the basis of behaviour data, collected on an anonymous way.',
	    		footer: 'If you wish to learn more about online behavioural advertising, click <a href="http://www.youronlinechoices.eu/" target="_blank">here</a>. There you can also &#8220;turn off&#8221;  or &#8220;turn on&#8221; the collection from other providers. Furthermore you can check the status of data collection from different <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank">providers</a>.'

	    	},
	    	sv:{
	    		adchoices: "Annonsval"
	    	}
	    },
	
	    /**
		 * @private
		 * @name $ADP.Player#init
		 * @function
		 * @description Class constructor.
		 */
	    init: function (id, args) {
	      this.id = id;
	      this.domId = args.domId;
	      this.translationFile = args.translation;
	      this.header = args.header;
	      this.footer = args.footer;
	      this.publisherInfo = args.publisherInfo;
	      this.position = args.position || 'top-right';
	      this.usePopup = !!args.usePopup;
	      this.renderCloseButton = !!args.renderCloseButton;
	      this.popup = !!args.popup;
	      this.browserLanguage = $ADP.Util.getBrowserLanguage();
	      this.documentCharset = $ADP.Util.getDocumentCharset();
	    },
	
	    /**
		 * @name $ADP.Player#getId
		 * @function
		 * @description Returns the OBA id that is used to identify this player's
		 *              unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA id.
		 */
	    getId: function () {
	      return this.id;
	    },
	
	    /**
		 * @name $ADP.Player#getDOMId
		 * @function
		 * @description Returns the OBA DOM id that is used to identify this
		 *              player's unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA DOM id.
		 */
	    getDOMId: function () {
	      return this.domId;
	    },
	
	    /**
		 * @name $ADP.Player#getDOMId
		 * @function
		 * @description Returns the OBA DOM id that is used to identify this
		 *              player's unique privacy messages.
		 * 
		 * @returns {integer} The player's OBA DOM id.
		 */
	    getTranslationFile: function () {
	      return $ADP.Registry.translationFile ? $ADP.Registry.translationFile : false;
	    },
	
	    /**
		 * @name $ADP.Player#getPosition
		 * @function
		 * @description Returns the position of the OBA button.
		 * 
		 * @returns {string} The OBA button position. <b>Default:</b> top-right
		 */
	    getPosition: function () {
	      return this.position || 'top-right';
	    },
	
	    /**
		 * @name $ADP.Player#getHeader
		 * @function
		 * @description Returns the player's header message displayed in the privacy
		 *              window.
		 * 
		 * @returns {string} The player's header message. <b>Default:</b>
		 *          Datenschutzbestimmungen
		 */
	    getHeader: function () {
	      return (this.header || this.getText({'type': 'header'}));
	    },
	
	    /**
		 * @name $ADP.Player#getFooter
		 * @function
		 * @description Returns the player's footer message displayed in the privacy
		 *              window.
		 * 
		 * @returns {string} The player's footer message. <b>Default:</b> <i>empty
		 *          string</i>
		 */
	    getFooter: function () {
	        return (this.footer || this.getText({'type': 'footer'}));
	    },
	    
	    /**
		 * @name $ADP.Player#getPublisherInfo
		 * @function
		 * @description Returns the player's publisher info message displayed in the
		 *              privacy window.
		 * 
		 * @returns {string} The player's publisher message. <b>Default:</b>
		 *          <i>empty string</i>
		 */
	    getPublisherInfo: function () {
	      return (this.publisherInfo || '');
	    },
	    
	    /**
		 * @name $ADP.Player#getPrivacyButtonText
		 * @function
		 * @description Returns the text displayed when hovering the privacy button.
		 * @todo: localization still has to be done, decission about dealing with
		 *        special html characters
		 * 
		 * @returns {string} The player's privacy button text. <b>Default:</b>
		 *          <i>Datenschutzinfo</i>
		 */
	    getPrivacyButtonText: function () {
	    	return this.getText({'type': 'adchoices'});
	    },
	    
	    /**
		 * @name $ADP.Player#usePopupForPrivacyInfo
		 * @function
		 * @description Returns whether the privacy info should be displayed in a
		 *              popup window.
		 * 
		 * @returns {boolean}
		 */
	    usePopupForPrivacyInfo: function () {
	      return this.usePopup == false ? false : true;
	    },
	    
	    /**
		 * @name $ADP.Player#renderCloseButtonForPrivacyInfo
		 * @function
		 * @description Returns whether the close button should be displayed (in a
		 *              popup window).
		 * 
		 * @returns {boolean}
		 */
	    renderCloseButtonForPrivacyInfo: function () {
	      return this.renderCloseButton ? true : false;
	    },
	
	    /**
		 * @name $ADP.Player#hasPrivacyInfo
		 * @function
		 * @description Returns boolean determining whether the player contains any
		 *              privacy information.
		 * 
		 * @returns {boolean} <code>true</code> / <code>false</code>
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    hasPrivacyInfo: function () {
	      return Boolean(this.items.length);
	    },
	
	    /**
		 * @name $ADP.Player#getPopup
		 * @function
		 * @description Returns this popup reference
		 * 
		 * @returns {object} The list containing privacy information.
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    getPopup: function () {
	      return this.popup;
	    },
	
	    /**
		 * @name $ADP.Player#getPrivacyInfos
		 * @function
		 * @description Returns a list containing the player's privacy information.
		 * 
		 * @returns {array} The list containing privacy information.
		 * 
		 * @see $ADP.PrivacyInfo
		 */
	    getPrivacyInfos: function () {
	      return this.items;
	    },
	
	    /**
		 * @private
		 * @name $ADP.Player#inject
		 * @function
		 * @description Assumes arguments have been predefined at instantiation and
		 *              initializes player setup when invoked.
		 * 
		 * @see $ADP.Registry#createPlayer
		 */
	    inject: function () {
	      var obaId = this.getId();
	      var domId = this.getDOMId();
	      var position = this.getPosition();
	      if (!obaId) {
	        // No obaId specified for $ADP.Play/er.inject into ' + domId
	        return;
	      }
	      if (!domId) {
	        if (window == window.top && document.body) return;
	        var iframeButton = document.createElement('DIV');
	        iframeButton.id = domId = 'iframe-button-' + Math.round(Math.random() * 9999);
	        document.body.insertBefore(iframeButton, document.body.firstChild);
	      }
	      var container = iframeButton || document.getElementById(domId);
	      if (container) {
	        container.innerHTML = '<div id="adp-wrapper-' + obaId + '" class="adp-wrapper adp-' + position + '" style="z-index:99999999;" onmouseover="this.className += \' adp-admarker-hover\';" onmouseout="this.className = this.className.replace(/adp-admarker-hover/, \'\');">' + '<div id="adp-admarker-' + obaId + '" class="adp-admarker" >' + '<div id="adp-admarker-icon-' + obaId + '" class="adp-admarker-icon adp-' + position + '" onClick="$ADP.Registry.collectPrivacy('+obaId+');"><\/div>' + '<div id="adp-admarker-text-' + obaId + '" class="adp-admarker-text adp-' + position + '"  onClick="$ADP.Registry.collectPrivacy('+obaId+');">' + this.getPrivacyButtonText() + '<\/div>' + '<\/div>';
	      } else {
	        if (this.attempts > this.maxAttempts) {
	          $ADP.Util.log('Too many attempts for ' + obaId + ', ' + domId);
	          return;
	        } else {
	          ++this.attempts;
	          var that = this;
	          setTimeout(function () {
	            that.inject();
	          }, 100);
	        }
	      }
	    },
	    /**
		 * @name $ADP.Player#getPanelHTML
		 * @function
		 * @description This compiles the html to be displayed in the privacy panel
		 * @return {string} The panel HTML string
		 */
	    getPanelHTML: function() {
	      var obaId = this.getId();
	      var position = this.getPosition();
	      var header = this.getHeader();
	      var footer = this.getFooter();
	      var publisherInfo = this.getPublisherInfo();
	      var items = this.getPrivacyInfos();
	      var usePopup = this.usePopupForPrivacyInfo();
	      var closeAction = !usePopup ?"$ADP.Registry.playerCmd("+obaId+",'hidePrivacy');":'window.close();';
	      var renderCloseButton = this.renderCloseButtonForPrivacyInfo();
	      var privacy_info = '';
	      for (var i = 0; i < items.length; i++) {
	        var item = items[i];
	        if(i != 0) { privacy_info += "<br /><br />\n" }
	        try {
	          privacy_info += item.render();
	        } catch (e) {}
	      }
	      
	      var panelContent = '';
	      panelContent = panelContent.concat('<div class="adp-panel-wrapper">');
	      if(header != '') panelContent = panelContent.concat('<div class="adp-panel-header">' + header + '<\/div>');
	      if(publisherInfo != '') panelContent = panelContent.concat('<div class="adp-panel-publisherinfo">' + publisherInfo + '<\/div>');
	      panelContent = panelContent.concat('<div class="adp-panel-info">' + privacy_info + '<\/div>');
	      if(footer != '') panelContent = panelContent.concat('<div class="adp-panel-footer">' + footer + '<\/div>');
	      panelContent = panelContent.concat('<\/div>');
	      var HTML = '';
	      if(!usePopup || (usePopup && renderCloseButton)) HTML += '<div id="adp-panel-close-' + obaId + '" class="adp-panel-close" onClick="'+closeAction+'">x<\/div>'
	      HTML += panelContent;
	      return HTML;
	    },
	    
	    /**
		 * @name $ADP.Player#showPrivacy
		 * @function
		 * @description Will show the privacy information
		 * @param {integer}
		 *            obaid
		 */
	    showPrivacy: function() {
	      var position = this.getPosition();
	      var obaId = this.getId();
	      var usePopup = this.usePopupForPrivacyInfo();
	      function renderInLayer() {
	        var panel = document.getElementById('adp-panel-' + obaId);
	        if (!panel) {
	          var wrapper = document.getElementById('adp-wrapper-'+obaId);
	          if(!wrapper) return;
	          var panel = document.createElement('DIV');
	          panel.id='adp-panel-' + obaId;
	          panel.className='adp-panel adp-' + position;
	          panel.display='block';
	          panel.innerHTML = this.getPanelHTML();
	          wrapper.appendChild(panel);
	        } else panel.style.display = 'block';
	      }
	      if (!usePopup) {
	    	var popup = this.getPopup();
	    	if (popup) { popup.close() }
	        renderInLayer.apply(this);
	      } else {
	        var title = this.getText({type: 'adchoices'});
	        var styles = document.styleSheets;
	        var popwin = this.getPopup();
	        if(!popwin) { renderInLayer.apply(this); }
	        else {
	          var popdoc = popwin.document;
	          window.popwin = popwin;
	          popdoc.write('<!doctype html><html><head><meta charset="utf-8" /><title>'+title+'</title>');
	          for (var k in styles)
	            if (styles[k].href) popdoc.write('<link rel="stylesheet" href="'+styles[k].href+'">');
	          popdoc.write('</head><body class="adp-popup"><div class="adp-wrapper"><div class="adp-panel">');
	          popdoc.write(this.getPanelHTML());
	          popdoc.write('</div></div></body></html>');
	          popdoc.close();
	          popwin.focus();
	        }
	      }
	    },
	
	    /**
		 * @name $ADP.Player#hidePrivacy
		 * @function
		 * @description hides the privacy information
		 * @param {integer}
		 *            obaid
		 */
	    hidePrivacy: function() {
	      var obaId = this.getId();
	      var panel = document.getElementById('adp-panel-' + obaId);
	      if (panel) panel.style.display = 'none';
	    },
	    
	    /**
	     * @name $ADP.Player#getText
	     * @function
	     * @descripton Returns the text in browser language. If the browser language is not german or english, the adplayer-translation.js will be tryed to load. If there a translation is missing, english will be used as fallback.
	     * @param {array} arg
	     * @return Text in browser language
	     */
	    
	    getText: function (args) {
		  	if(args['type']) {
		  		if(!(this.browserLanguage == 'de' || this.browserLanguage == 'en') && !document.getElementById('adptranslation') && this.getTranslationFile()) {
		  		   try {
		  	           var adpTranslationSrc = document.createElement('script');
		  	           adpTranslationSrc.type = 'text/javascript';
		  	           adpTranslationSrc.async = true;
		  	           adpTranslationSrc.id = 'adptranslation';
		  	           adpTranslationSrc.src = this.getTranslationFile();
		  	           adpTranslationSrc.charset = 'utf-8';
		  	           document.getElementsByTagName('head')[0].appendChild(adpTranslationSrc);
		  	           $ADP.Util.log('Try to load translation file: ' + this.getTranslationFile())
		  		   } catch (e) { $ADP.Util.log('Failed to load translation file: ' + e.message); }
				}
				
		  		var translatedText;
		  		
	  			if(this.translation[this.browserLanguage] && this.translation[this.browserLanguage][args['type']]) {
		  			translatedText = this.translation[this.browserLanguage][args['type']];
		  		}
		  		else if($ADP.Player.adpTranslation && $ADP.Player.adpTranslation[this.browserLanguage] && $ADP.Player.adpTranslation[this.browserLanguage][args['type']]) {
		  			translatedText = $ADP.Player.adpTranslation[this.browserLanguage][args['type']];
		  		}

	  			if(translatedText && (this.documentCharset == 'UTF-8' || /^[\u0000-\u0080]+$/.test(translatedText))) {
	  				return translatedText;
	  			}
		  		else {
		  			return this.translation['en'][args['type']];
		  		}
		  	}
	    }
	}
} // closing if(!$ADP.Player)
if(!$ADP.PrivacyInfo) {

/**
 * @name $ADP.PrivacyInfo
 * @class
 * @description The <code>$ADP.PrivacyInfo</code> class.
 *
 * @param {object}  args           The Arguments.
 * @param {string}  args.title     The title of the privacy information.
 * @param {string}  args.text      The detailed information of the privacy information.
 * @param {string}  args.url       The call-to-action URL for opting.
 * @param {array}   args.linkText  The URL's text representation.
 * @param {boolean} args.usePopup  default is layer and if set then popup should be used
 *
 * @example
 * TODO
 */
$ADP.PrivacyInfo = function (args) {
	return this instanceof $ADP.PrivacyInfo ? this.init(args) : new $ADP.PrivacyInfo(args);
}

$ADP.PrivacyInfo.prototype = {

    /**
     * @private
     * @name $ADP.PrivacyInfo#init
     * @function
     * @description Class constructor.
     */
    init: function (args) {
      this.valid = args.title && args.linkText && args.url ? true : false;
      this.title = args.title;
      this.text = args.text;
      this.url = args.url;
      this.linkText = args.linkText;
      this.usePopup = !!args.usePopup;
    },

    /**
     * @name $ADP.PrivacyInfo#getTitle
     * @function
     * @description Returns the title of the privacy information.
     * 
     * @return {string} The privacy information title. 
     */
    getTitle: function () {
      return this.title;
    },

    /**
     * @name $ADP.PrivacyInfo#getText
     * @function
     * @description Returns the privacy information's detailed information. 
     * 
     * @return {string} The privacy information's detailed information. 
     */
    getText: function () {
      return this.text;
    },

    /**
     * @name $ADP.PrivacyInfo#getURL
     * @function
     * @description Returns the privacy information's call-to-action URL.
     * 
     * @return {string} The privacy information's call-to-action URL. 
     */
    getURL: function () {
      return this.url;
    },

    /**
     * @name $ADP.PrivacyInfo#getLinkText
     * @function
     * @description Returns the URL's text representation.
     * 
     * @return {string} The URL's text representation. 
     */
    getLinkText: function () {
      return this.linkText;
    },

    /**
     * @name $ADP.PrivacyInfo#isValid
     * @function
     * @description Determines whether a title, text, or linkText has been defined.
     * @return {boolean} <code>true</code> / <code>false</code>
     */
    isValid: function () {
      return this.valid ? true : false;
    },
    
    /**
     * @name $ADP.PrivacyInfo#usePopup
     * @function
     * @description returns whether privacy items should be rendered in popup
     * @returns {boolean} 
     */ 
     usePopup: function () {
       return this.usePopup ? true : false;
     },
     
    /**
     * @name $ADP.PrivacyInfo#render
     * @function
     * @description Returns a HTML string representation of the privacy information.
     * 
     * @return {string} HTML wrapped string representation containing privacy information.
     * 
     * @example
     * // returns string
     * AdServer&lt;br/&gt;Opt-opt out of this ad server.&lt;br/&gt;&lt;a href=&quot;http://calltoaction.url&quot; target=&quot;_blank&quot;&gt;Opt Out&lt;/a&gt;
     */
    render: function () {
      var title = $ADP.Util.safeString(this.getTitle());
      var text = $ADP.Util.safeString(this.getText());
      var linkText = $ADP.Util.safeString(this.getLinkText());
      var url = $ADP.Util.safeString(this.getURL());
      var s = '';
      if (linkText) s += linkText;
      if (url) s = '<a href="' + url + '" target="_blank">' + s + '</a>';
      if (text) s = text + '<br />' + s;
      if (title) s = '<div class="adp-info-header">' + title + '</div>' + s;
      return s;
    }

};

} // closing if(!$ADP.PrivacyInfo)
/**
 * @name $ADP.Message
 * @class
 * @description The <code>$ADP.Message</code> class.
 *
 * @example
 * TODO
 */
$ADP.Message = $ADP.Message || {
  /**
   * @name $ADP.Message#types
   * @field
   * @description Request types used to make requests across other browsers.<br/>
   *     <ul>
   *       <li><code>$ADP.Message.types.nomsg</code> - No message</li>
   *       <li><code>$ADP.Message.types.pullOBA</code> - Request to pull OBA information.</li>
   *       <li><code>$ADP.Message.types.pullOBA_ACK</code> - Return message for OBA information.</li>
   *       <li><code>$ADP.Message.types.unRegOBA</code> - Request to unregister OBA information.</li>
   *       <li><code>$ADP.Message.types.unRegOBA_ACK</code> - Return message for unregister request.</li>
   *     </ul>
   * @type object
   */
  types: {
    nomsg: 'NULL',
    pullOBA: 'ADP.Registry.pullOBA',
    pullOBA_ACK: 'ADP.Registry.pullOBA_ACK',
    unRegOBA: 'ADP.Registry.unRegOBA',
    unRegOBA_ACK: 'ADP.Registry.unRegOBA_ACK'
  },

  /**
   * @private
   * @name $ADP.Message#create
   * @function
   * @description Prepares data for transport by convert to string.
   * 
   * @param type {string}  The type of request to send.
   * @param data {object}  The data object to send.
   * 
   * @return String representation of object.
   * 
   * @see $ADP.Message#types
   */
  create: function (type, data) {
    var msg = {
      type: type,
      data: data
    };
    try {
      if ($ADP.Util.JSON && typeof $ADP.Util.JSON.stringify == 'function') {
        return $ADP.Util.JSON.stringify(msg);
      }
    } catch (e) {}
    return '{"type":"NULL"}';
  },

  /**
   * @private
   * @name $ADP.Message#parse
   * @function
   * @description Parses the data into a an object.
   *   
   * @param data {object}  The data to parse.
   * 
   * @return Object representation of the string message.
   */ 
  parse: function (data) {
    try {
      if ($ADP.Util.JSON && typeof $ADP.Util.JSON.parse == 'function') {
        return $ADP.Util.JSON.parse(data);
      }
    } catch (e) {}
    return $ADP.Message.create('NULL', {});
  },

  /**
   * @name $ADP.Message#send
   * @function
   * @description Sends a message to a target window using <code>postMessage</code>.
   *   
   * @param trgt {window}  The target DOM window to send the message to.
   * @param type {string}  The type of message to send.
   * @param data {object}  The data object to send.
   * 
   * @see $ADP.Message#types
   */
  send: function (trgt, type, data) {
	  try {
		if (trgt && trgt.postMessage) {
		  var msg = $ADP.Message.create(type, data);
		  trgt.postMessage(msg, '*');
		}
	  } catch (e) {}
	}
}

/**
 * @name $ADP.Util
 * @class
 * @description The Required Util methods that could be used across the various classes 
 */
$ADP.Util = $ADP.Util || {
	
  browserLanguage: null,
  documentCharset: null,
  
  /**
   * @name $ADP.Util.JSON
   * @class
   * @description Fallback JSON class 
   */
  JSON: window.JSON || {
    /**
     * @name $ADP.Util.JSON#stringify
     * @function
     * @description returns a json string for a supplied object
     * @param a Object to be stringified
     * @param b function variable
     * @param c function variable
     * @returns {string}
     */
    stringify: function (obj,replacer){
      function m(a) {
  		  var o= new Array(a.length);
			  for (var i= 0, n=a.length; i<n; i++) o[i]= s(a[i]);
			  return o;
	    }
	   
     function s(a,b,c){
		    for(b in(c=a==''+{}&&[])&&a)
			    c.push(s(b)+':'+s(a[b]));
		    return ''+a===a?'"'+a.replace(/[\x00-\x19\\]/g,function(x){return'\\x'+x.charCodeAt().toString(16)})+'"':a&&a.length?'['+m(a)+']':c?'{'+c+'}':a
	    }
      return s(obj);
    },
    /**
     * @name $ADP.Util.JSON#parse
     * @function
     * @description returns the JSON object for the JSON string
     * @param jsonstr The JSON string to be evaluated
     * @returns {object}
     */
    parse: function (jsonstr){
      var JSON_object = null;
      try {
        JSON_object = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(jsonstr.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + jsonstr + ')');
      } catch(e) {}
      return JSON_object;
    }
  },
  
  /**
   * @name $ADP.Util#btoa
   * @function
   * @description Converts from base string to base64 encoded string
   * @param a The string the be encoded
   * @param b function variable
   * @param c function variable
   * @param d function variable
   * @param e function variable
   * @returns
   */
  btoa: function(a,b,c,d,e) {
    for(b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=e='';a.charAt(d|0)||(b='=',d%1);e+=b.charAt(63&c>>8-d%1*8))c=c<<8|a.charCodeAt(d-=-.75);
    return e
  },
  /**
   * @name $ADP.Util#atob
   * @function
   * @description Converts base64 encoded string into a string.
   * @param d base64 encoded string
   * @param b function variable
   * @param c function variable
   * @param u function variable
   * @param r function variable
   * @param q function variable
   * @param x function variable
   * @returns
   */
  atob: function(d,b,c,u,r,q,x) {
  	for(r=q=x='',b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";c=d.charAt(x++);~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0)c=b.indexOf(c);
  	return r
  },
  
  /**
   * @name $ADP.Util#log
   * @function
   * @description Logs a message through the console; if available.
   * @param {string} msg The message to log.
   * @example
   *  $ADP.Util.log('This is a log output');  
   */
  log: function() {
	try {
		if(window.location && window.location.search && window.location.search.match(/adpdebug/)) {
		    $ADP.Util.log.history = $ADP.Util.log.history || [];
		    $ADP.Util.log.history.push(arguments);
		    if(typeof console != 'undefined'){
		      console.log(Array.prototype.slice.call(arguments));
		    }
		}
	} catch (e) {}
  },
  
  /**
   * @name $ADP.Util#safeString
   * @function
   * @description Replaces all &lt; and &gt; signs with &amp;lt; and &amp;gt; to prevent
   *              interpretation by browser.
   * @param {string} s The string to make safe.
   */
  safeString: function(s) {
    var safeString = s;
    safeString = safeString.split('<').join('&lt;');
    safeString = safeString.split('>').join('&gt;');
    return safeString;
  },

  
  /**
   * @name $ADP.Util#createIframeName
   * @function
   * @description Creates an base64-String from the registry-items
   * @param id The obaId.
   */
  createIframeName: function (id) {
	  var iframeName = '';
	  if(!window.postMessage) {
	    iframeName = $ADP.Util.btoa( $ADP.Util.JSON.stringify( $ADP.Registry.pullById(id)));
	  }
	  return iframeName;
  },
  
  /**
   * @name $ADP.Util#getBrowserLanguage
   * @function
   * @description Returns the browser language
   */
  getBrowserLanguage: function () {
	  if(!this.browserLanguage) {
		  if(navigator.language) {
			  this.browserLanguage = navigator.language;
		  } else if (navigator.browserLanguage) {
			  this.browserLanguage = navigator.browserLanguage;
		  } else {
			  this.browserLanguage = 'en';
		  }
		  this.browserLanguage = /[a-z]+/i.exec(this.browserLanguage)[0];
		  
		  $ADP.Util.log('Detected Browser Language is: ' + this.browserLanguage);
	  }
	  return this.browserLanguage ? this.browserLanguage : 'en';
  },
  
  /**
   * @name $ADP.Util#getDocumentCharset
   * @function
   * @description Returns the document charset
   */
  getDocumentCharset: function () {
	  if(!this.documentCharset) {
		  if(document.characterSet) {
			  this.documentCharset = document.characterSet;
		  } else if (document.charset) {
			  this.documentCharset = document.charset;
		  } else if (document.defaultCharset) {
			  this.documentCharset = document.defaultCharset;
		  }
		  
		  $ADP.Util.log('Detected document charset is: ' + this.documentCharset);
	  }
	  return this.documentCharset;
  }
}
/**
 * @name $ADP#getVersion
 * @function
 * @description Returns a map indicating the current version of the AdPlayer.
 *              This method should also be used for internal backwards compatibility.
 *
 * @returns A map of version information.
 *
 * @example
 * var version = $ADP.getVersion();
 * console.log('Major: ' + version.major);
 * console.log('Minor: ' + version.minor);
 * console.log('Patch: ' + version.patch);
 * console.log('Stage: ' + version.stage);
 * 
 * // Major: 2
 * // Minor: 0
 * // Patch: 2
 * // Stage: FINAL
 */
$ADP.getVersion = $ADP.getVersion || function() {
  return {
    major: 2,
    minor: 0,
    patch: 2,
    stage: 'FINAL'
  };
};

/**
 * @name $ADP#init
 * @function
 * @description The initializer method for the ADP sub classes 
 */
if (!$ADP.init) {
  $ADP.init = function() {
    $ADP.Registry.init();
  };

  $ADP.init();
}
