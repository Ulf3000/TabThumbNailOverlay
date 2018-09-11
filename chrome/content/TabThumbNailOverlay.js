//const sessionStore 	= Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
Cu.import('resource://gre/modules/PageThumbUtils.jsm');
Cu.import("resource:///modules/sessionstore/SessionStore.jsm");
window.messageManager.loadFrameScript('chrome://TabThumbNailOverlay/content/framescript.js', true);
window.messageManager.addMessageListener("my-addon@me.org:my-e10s-extension-message", listener);
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
let alreadyRestored = false;
//------------- STARTUP OBSERVERS------------------------------------------
/* gggObserver = {
	observe: function (aSubject, aTopic, aData) {
		alreadyRestored = false; 
		windowRestoreSessionManager();
		console.log("sessionmanager:window-loaded")
		console.log(aSubject);
		console.log(aTopic);
		console.log(aData);
		
	}
}
Services.obs.addObserver(gggObserver, "sessionmanager:window-loaded", false);
 */
fffObserver = {
	observe: function (aSubject, aTopic, aData) {
		alreadyRestored = false;
		if (aSubject)
			windowRestoreSessionManager(aSubject);
		console.log("sessionmanager:restoring-window")
		console.log(aSubject);
		console.log(aData);
		console.log(aTopic);
		
	}
}
Services.obs.addObserver(fffObserver, "sessionmanager:restoring-window", false);

/* hhhObserver = {
	observe: function (aSubject, aTopic, aData) {
		alreadyRestored = false;
		windowRestoreSessionManager();
		console.log("sessionstore-state-finalized");
		console.log(aSubject);
		console.log(aData);
		console.log(aTopic);
	}
}
Services.obs.addObserver(hhhObserver, "sessionstore-state-finalized", false);
 *//* 
iiiObserver = {
	observe: function (aSubject, aTopic, aData) {
		windowRestore();
		console.log("sessionstore-single-window-restored");
		console.log(aSubject);
		console.log(aData);
		console.log(aTopic);
	}
}
Services.obs.addObserver(iiiObserver, "sessionstore-single-window-restored ", false);

jjjObserver = {
	observe: function (aSubject, aTopic, aData) {
		windowRestore();
		console.log("browser-delayed-startup-finished")
		console.log(aSubject);
		console.log(aData);
		console.log(aTopic);
	}
}
Services.obs.addObserver(jjjObserver, "browser-delayed-startup-finished", false);
 */



//window.messageManager.addMessageListener("SessionStore:restoreHistoryComplete", function(){console.log("SessionStore:restoreHistoryComplete")});
//window.messageManager.addMessageListener("SessionStore:restoreTabContentComplete", function(){console.log("SessionStore:restoreTabContentComplete")});



window.addEventListener("SSWindowRestored", function(a,b){console.log("SSWindowRestored  " + a + "  " +b)},false);

//----------------------------------------------------------------------------------

let g = window.gBrowser;
let activeTab = g.mCurrentTab;
let lastActiveTab = g.mCurrentTab;

window.addEventListener("SSWindowRestored", windowRestore,false);

//window.addEventListener("SSWindowStateReady", windowRestore,false);

/* window.addEventListener("TabOpen", function (e) {
	e.target.__tabThumbnailRR = document.getAnonymousElementByAttribute(e.target, 'anonid', 'tab-meta-image');
	console.log(e.target.__SS_extdata.ThumbNail_HT);
}, false);
 */
function setBack() {
	console.log("set back");
	alreadyRestored = false; 
};
function windowRestore() {
	console.log("RESTOOOOOORRRREEE");
	//if (alreadyRestored == true) return;
	//console.log("RESTOOOOOORRRREEE2222222");
	let i = 0;
	setTimeout(function () {
		
		for (let tab of document.getElementsByClassName("tabbrowser-tab")) {
			console.log(tab.__thumbAlreadyRR);
			if (tab.__thumbAlreadyRR == true) return;
			let img =  document.getAnonymousElementByAttribute(tab, 'anonid', 'tab-meta-image');
			let TN_URI = tab.__SS_extdata.ThumbNail_HT;
			console.log(TN_URI);
			img.src = TN_URI;
			
			tab.__thumbAlreadyRR = true;
		}
		//alreadyRestored = true; 
	}, 1000)
};
function windowRestoreSessionManager(aSubject) {
	console.log("RESTOOOOOORRRREEE SessionManager");
	let i = 0;
	setTimeout(function () {
		
		for (let tab of aSubject.document.getElementsByClassName("tabbrowser-tab")) {
			console.log(tab.__thumbAlreadyRR);
			//if (tab.__thumbAlreadyRR == true) return;
			let img =  document.getAnonymousElementByAttribute(tab, 'anonid', 'tab-meta-image');
			if (!img.src){
				let TN_URI = tab.__SS_extdata.ThumbNail_HT;
				console.log(TN_URI);
				
				img.src = TN_URI;
				
				tab.__thumbAlreadyRR = true;
			}
		}
		//alreadyRestored = true; 
	}, 1000)
};

window.addEventListener("TabMove", function (e) {
	console.log("TabMove");
	let TN_URI = e.target.__SS_extdata.ThumbNail_HT;
	if (TN_URI) {
		let img = document.getAnonymousElementByAttribute(e.target, 'anonid', 'tab-meta-image');
		img.src = TN_URI;
	}
}, false);

window.addEventListener("TabPinned", hidePic, false);
window.addEventListener("TabUnpinned", showPic, false);
function hidePic(e) {
	console.log("TabPinned");
	let CNVS = document.getAnonymousElementByAttribute(e.target, 'anonid', 'tab-meta-image');
	CNVS.style.display = "none";
};
function showPic(e) {
	console.log("TabPinned");
	let CNVS = document.getAnonymousElementByAttribute(e.target, 'anonid', 'tab-meta-image');
	CNVS.style.display = "initial";
	e.target.linkedBrowser.messageManager.sendAsyncMessage("my-addon@me.org:message-from-chrome");
};

window.addEventListener("TabAttrModified", updatePageload, false);
function updatePageload(e) {
	//console.log(e.detail.changed[0]);
	if (e.detail.changed[0] == "busy") {
		console.log("BUSY!!!!!!!!!!!!!!!!!!");
		window.setTimeout(function () {
			e.target.linkedBrowser.messageManager.sendAsyncMessage("my-addon@me.org:message-from-chrome");
		}, 200);
	}
};

window.addEventListener("TabSelect", updateLast, true);
function updateLast(e) {
	console.log("TabSelect");
	lastActiveTab = activeTab;
	activeTab = e.target;
	let lastBrowser = lastActiveTab.linkedBrowser;
	if (lastBrowser.isRemoteBrowser) {
		lastBrowser.messageManager.sendAsyncMessage("my-addon@me.org:message-from-chrome");
	} else {
		console.log("NOREMOTE");
		let img = document.getAnonymousElementByAttribute(lastActiveTab, 'anonid', 'tab-meta-image');
		let TN_URI = noRemoteCapture(lastBrowser._contentWindow);
		img.src = TN_URI;
		SessionStore.setTabValue(lastActiveTab, "ThumbNail_HT", TN_URI);
	}
};

async function listener(message) {
	//console.log("listenerreturn%%%%%%%%%");
	let tab = g.getTabForBrowser(message.target);
	let img = await document.getAnonymousElementByAttribute(tab, 'anonid', 'tab-meta-image');
	//console.log(tab.__tabThumbnailRR);
	//img.src = "";
	img.src = message.data;
	//console.log(tab.__tabThumbnailRR);
	SessionStore.setTabValue(tab, "ThumbNail_HT", message.data);
}

function noRemoteCapture(win){
	//----------------CAPTURE WINDOW
		let doc = win.document;
		let a = 54;
		let b = 36;

		let snapshotCanvas = doc.createElementNS("http://www.w3.org/1999/xhtml",'canvas');
		let finalCanvas = doc.createElementNS("http://www.w3.org/1999/xhtml",'canvas');
		
		let scale = Math.min(Math.max(108 / win.innerWidth,
									  72 / win.innerHeight), 1);

		let snapshotCtx = snapshotCanvas.getContext("2d");
		snapshotCtx.save();
		snapshotCtx.scale(scale, scale);
		snapshotCtx.drawWindow(win, win.scrollX, win.scrollY, win.innerWidth, win.innerHeight,
							   "#fff",
							   snapshotCtx.DRAWWINDOW_DO_NOT_FLUSH);
		snapshotCtx.restore();
		
		//----- PART2 DOWNSCALE---------------
		
		finalCanvas.width = a;
		finalCanvas.height = b;
    
		let finalCtx = finalCanvas.getContext("2d");
		finalCtx.save();
		// if (!skipDownscale) {
		finalCtx.scale(0.5, 0.5);
		//}
		finalCtx.drawImage(snapshotCanvas, 0, 0);
		finalCtx.restore();
	
		return finalCanvas.toDataURL();
}


/* window.addEventListener('pageshow', function(event) {
    console.log('pageshow:');
    console.log(event);
}); */