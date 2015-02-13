
/* Popup page */
var popDoc = null;
var popContent = null;

/* Graph page */
var graphWindow = null;

/* Our database */
var nodes = [];
var edges = [];
var graph = null;
var time = {};
var edgestime = {};

/* Setup background page */
var bgWindow = chrome.extension.getBackgroundPage();
var bgDoc = bgWindow.document;
var bgContent = bgDoc.createElement("div");

bgContent.setAttribute("id", "content");
bgDoc.getElementsByTagName("body")[0].appendChild(bgContent);

function loadUrls(urls)
{
	var res = urls;
	var xhr;
	for (var i = 0; i < res.length; i++) {
	//	chrome.tabs.create({ url: res[i] })

		console.log(res[i]);
		chrome.tabs.create({ url: res[i] });


	}
}
/* Adds an event to the log */
function pageAddLog(message) {
	// Add to background
	var el = bgDoc.createElement('li');
	el.appendChild( bgDoc.createTextNode(message) );
	bgContent.appendChild(el);

	// Also update popup, if visible
	if (popContent) {
		el = popDoc.createElement('li');
		el.appendChild( popDoc.createTextNode(message) );
		popContent.appendChild(el);
	}
}

var connectionListener = function(details) {

	var src_tab;
	if(details.tabId > 0)

		chrome.tabs.get(details.tabId, function(tab) {
			if (typeof tab == 'undefined') return;

			src_tab=tab.url;

			var tmpnodes = [];
			var tmpedges = [];
			var srcDomain = extractDomain(src_tab);
			var dstDomain = extractDomain(details.url);
			if(srcDomain.toUpperCase() == "NEWTAB" || dstDomain.toUpperCase() == "NEWTAB") return;
			if (srcDomain != dstDomain && srcDomain != "" && dstDomain != "" ) {
					var e = addUserNode(srcDomain);
					if (e) {
						nodes[nodes.length] = { group: "nodes", data: e };
						tmpnodes[tmpnodes.length] = { group: "nodes", data: e };
					}
					e = addNode(dstDomain);
					if (e) {
						nodes[nodes.length] = { group: "nodes", data: e };
						tmpnodes[tmpnodes.length] = { group: "nodes", data: e };
					}
					var total_time=details.timeStamp - time[details.requestId];
					time[details.requestId]=total_time;
					var edgeid=srcDomain+"-"+dstDomain;
					e = addEdge(srcDomain, dstDomain,total_time);
					if (e) {

						if(edgeid in edgestime)
							edgestime[edgeid]=edgestime[edgeid]+total_time;
						else
							edgestime[edgeid]=total_time;

						edges[edges.length] = { group: "edges", data: e };
						tmpedges[tmpedges.length] = { group: "edges", data: e };

						if(graphWindow != null)
							graphWindow.updateGraph(tmpnodes,tmpedges);

					}
				}

			});
		else{
	    	return;
	    }

} // connectionListener

var connectionTimeListener = function(details) {

	time[details.requestId]=details.timeStamp;

} // connectionListener

var STATUS = false;

function startHTTPsurfing()
{
	time = {};
	edgestime = {};
	nodes = [];
	edges = [];

	graph=cytoscape({
  		/* ... */
  	elements: {
   		 nodes:[],
    	 edges:[]
  		}
 		 /* ... */
		});
	chrome.webRequest.onCompleted.addListener(connectionListener, { urls: ["<all_urls>"] });
	chrome.webRequest.onBeforeRequest.addListener(connectionTimeListener, { urls: ["<all_urls>"] });

	 chrome.tabs.getCurrent(function(tab)
			{
				chrome.tabs.query({	active: true, currentWindow: true }, function(tabs) {
					currentTab = tabs[0];
					chrome.tabs.reload(currentTab.tabId);
				});

			});
	 STATUS = true;
}

function stopHTTPsurfing() {
	chrome.webRequest.onCompleted.removeListener(connectionListener);
	chrome.webRequest.onCompleted.removeListener(connectionTimeListener);
	STATUS=false;
/*	time = {};
	edgestime = {};
	nodes = [];
	edges = [];
	graph = null;
	STATUS = false;*/
}

function extractDomain(url) {
	var protocolStart = url.indexOf("://");
	if (protocolStart < 0) {
		return "";
	}
	var protocol = url.substring(0, protocolStart + 3);
	var withoutProtocol = url.substring(protocolStart + 3);
	//var portStart = url.indexOf(":");
	var urlStart = withoutProtocol.indexOf("/");
	if (urlStart < 0) {
		return withoutProtocol;
	}
	return withoutProtocol.substring(0, urlStart);
}
function addNode(id) {

	var nodes = graph.getElementById(id);
	if (nodes.length) {
		nodes.data('weight', .07 + nodes.data('weight'));
		if(graphWindow != null)
			graphWindow.updateLayout();

		return null;
	}
	var node = {
		id: id,
		name: id,
		href: "http://" + id,
		weight : 5
	};
	graph.add({
		group: "nodes",
		data: node,
		//position: { },
	});
	return node;
}
function addUserNode(id) {

	var nodes = graph.getElementById(id);
	if (nodes.length) {
		nodes.data('weight', .07 + nodes.data('weight'));
		if(graphWindow != null)
		{
			graphWindow.updateLayout();

		}
		return null;
	}
	var node = {
		id: id,
		name: id,
		href: "http://" + id,
		weight : 10,
		user: true
	};
	graph.add({
		group: "nodes",
		data: node,
		//position: { },
	});
	return node;
}

function addEdge(srcId, dstId) {
	var id = srcId + "-" + dstId ;

	var edges = graph.getElementById(id);
	if (edges.length) {
		edges.data('weight', .07 + edges.data('weight'));

		if(graphWindow != null)
		{
			graphWindow.updateLayout();

		}
		return null;
	}
	var edge = {
		id: id,
		source: srcId,
		target: dstId,
		weight: 1

	}
	graph.add({
		group: "edges",
		data: edge,
	});

	return edge;
}

function showGraph() {

	chrome.windows.create({ url: "graph.html", width: screen.width/2, height: screen.height});

}

function graphReady(window) {
	graphWindow = window;
	graphWindow.loadGraph(nodes, edges);

}
