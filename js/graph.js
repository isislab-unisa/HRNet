var bgWindow;
var cy = null;
var layout=0;
var lastChart = null;
var optionschart = 
		{
		    ///Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,

		    //String - Colour of the grid lines
		    scaleGridLineColor : "rgba(0,0,0,.05)",

		    //Number - Width of the grid lines
		    scaleGridLineWidth : 1,

		    //Boolean - Whether the line is curved between points
		    bezierCurve : true,

		    //Number - Tension of the bezier curve between points
		    bezierCurveTension : 0.4,

		    //Boolean - Whether to show a dot for each point
		    pointDot : true,

		    //Number - Radius of each point dot in pixels
		    pointDotRadius : 4,

		    //Number - Pixel width of point dot stroke
		    pointDotStrokeWidth : 1,

		    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		    pointHitDetectionRadius : 20,

		    //Boolean - Whether to show a stroke for datasets
		    datasetStroke : true,

		    //Number - Pixel width of dataset stroke
		    datasetStrokeWidth : 2,

		    //Boolean - Whether to fill the dataset with a colour
		    datasetFill : true,

		    //String - A legend template
		    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		};

document.addEventListener('DOMContentLoaded', function () {
	
	Chart.defaults.global = {
		    // Boolean - Whether to animate the chart
		    animation: true,

		    // Number - Number of animation steps
		    animationSteps: 60,

		    // String - Animation easing effect
		    animationEasing: "easeOutQuart",

		    // Boolean - If we should show the scale at all
		    showScale: true,

		    // Boolean - If we want to override with a hard coded scale
		    scaleOverride: false,

		    // ** Required if scaleOverride is true **
		    // Number - The number of steps in a hard coded scale
		    scaleSteps: null,
		    // Number - The value jump in the hard coded scale
		    scaleStepWidth: null,
		    // Number - The scale starting value
		    scaleStartValue: null,

		    // String - Colour of the scale line
		    scaleLineColor: "rgba(0,0,0,.1)",

		    // Number - Pixel width of the scale line
		    scaleLineWidth: 1,

		    // Boolean - Whether to show labels on the scale
		    scaleShowLabels: true,

		    // Interpolated JS string - can access value
		    scaleLabel: "<%=value%>",

		    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		    scaleIntegersOnly: true,

		    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		    scaleBeginAtZero: false,

		    // String - Scale label font declaration for the scale label
		    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		    // Number - Scale label font size in pixels
		    scaleFontSize: 12,

		    // String - Scale label font weight style
		    scaleFontStyle: "normal",

		    // String - Scale label font colour
		    scaleFontColor: "#666",

		    // Boolean - whether or not the chart should be responsive and resize when the browser does.
		    responsive: false,

		    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
		    maintainAspectRatio: true,

		    // Boolean - Determines whether to draw tooltips on the canvas or not
		    showTooltips: true,

		    // Array - Array of string names to attach tooltip events
		    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

		    // String - Tooltip background colour
		    tooltipFillColor: "rgba(0,0,0,0.8)",

		    // String - Tooltip label font declaration for the scale label
		    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		    // Number - Tooltip label font size in pixels
		    tooltipFontSize: 14,

		    // String - Tooltip font weight style
		    tooltipFontStyle: "normal",

		    // String - Tooltip label font colour
		    tooltipFontColor: "#fff",

		    // String - Tooltip title font declaration for the scale label
		    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

		    // Number - Tooltip title font size in pixels
		    tooltipTitleFontSize: 14,

		    // String - Tooltip title font weight style
		    tooltipTitleFontStyle: "bold",

		    // String - Tooltip title font colour
		    tooltipTitleFontColor: "#fff",

		    // Number - pixel width of padding around tooltip text
		    tooltipYPadding: 6,

		    // Number - pixel width of padding around tooltip text
		    tooltipXPadding: 6,

		    // Number - Size of the caret on the tooltip
		    tooltipCaretSize: 8,

		    // Number - Pixel radius of the tooltip border
		    tooltipCornerRadius: 6,

		    // Number - Pixel offset from point x to tooltip edge
		    tooltipXOffset: 10,

		    // String - Template string for single tooltips
		    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

		    // String - Template string for single tooltips
		    multiTooltipTemplate: "<%= value %>",

		    // Function - Will fire on animation progression.
		    onAnimationProgress: function(){},

		    // Function - Will fire on animation completion.
		    onAnimationComplete: function(){}
		}
	bgWindow = chrome.extension.getBackgroundPage();

	cy = cytoscape({
	  	minZoom: 1e-50,
  	 	maxZoom: 1e50,
  		zoomingEnabled: true,
  		userZoomingEnabled: true,
  		panningEnabled: true,
  		userPanningEnabled: true,
  		boxSelectionEnabled: false,
  		touchTapThreshold: 8,
  		desktopTapThreshold: 4,
  		autolock: false,
  		autoungrabify: false,
  	  	autounselectify: false,
	  	container: document.getElementById("content"),
	  
	 	style: cytoscape.stylesheet()
	    .selector('node')
	      .css({
	      	'content':'data(name)',
	        'width': 'data(weight)',
	        'height': 'data(weight)',
	        'font-size':'10px',
	        'text-valign': 'top',
	        'color': 'black'
	      })
	    .selector(':selected')
	      .css({
	        'background-color': 'black',
	        'line-color': 'black',
	        'target-arrow-color': 'black',
	        'source-arrow-color': 'black',
	        'text-outline-color': 'black'
	      })
	      .selector('edge')
	      .css({
	        'color': 'black',
	        'background-color': 'black',
	        'width': 'data(weight)',
	      })
	      .selector('node[user]')
     		 .css({
        		'background-color': '#16A085'
     			 })
  			.selector('node[^user]')
     		 .css({
        		'background-color': '#34495E'
     			 })
	      ,
	  
	  	elements: {
	    	nodes: [ ],
	    	edges: [ ]
	  	},
	  	ready: function() {
			bgWindow.graphReady(window);
	  }

	});
	setLayout();
	cy.on('tap', 'node', function(){
	  try { // your browser may block popups
	    window.open( this.data('href') );
	  } catch(e){ // fall back on url change
	    window.location.href = this.data('href'); 
	  } 
	});
	$("#searchnode").click(function(){
		alert($("#searchtext").val());
    	
	});
	//$("#onode").change(function(){
	//	alert($(this).is(':checked'));
	//});
	$("#othernode").click(function(){
		alert("signora lena");
    	var $checkbox = $(this);
    	if ($checkbox.prop('checked')) {
        	alert($elements);
        }else {
        	alert($elements);
    	}
	});
	
	$("#usernode").change(function(){
		alert($(this).is(':checked'));
	});

	$("#layout").change(function(){
		//alert($(this).val());
		layout=$(this).val();
		updateLayout();
	});

	$("#PNGexport").click(function(){
		//alert($(this).val());
		if(cy.elements().length > 0)
		{
			var png64 = cy.png({bg:'white'});
			//console.log(png64);
			var png = window.atob(png64.split(',')[1]);
			var arraybuffer = new ArrayBuffer(png.length);
	    	var view = new Uint8Array(arraybuffer);
	    	for (var i=0; i<png.length; i++) {
	        	view[i] = png.charCodeAt(i) & 0xff;
	    	}
			var blob = new Blob([arraybuffer], {type: 'image/png', encoding: 'utf-8'});
			
			saveAs(blob, "graph.png");
		}
		else alert("No elements in the graph!");
	});

	$("#JSONexport").click(function(){
		//alert($(this).val());
		if(cy.elements().length > 0)
		{
			var json = cy.json();
			//console.log(json);
			var blob = new Blob([JSON.stringify(json)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "graph.txt");
		}else alert("No elements in the graph!");
		
	});
	
	$("#nodedegree").click(function(){
		
		var nodes_degree = {};
		cy.nodes().forEach(function (ele){
				var node= cy.getElementById(ele.id());
  				nodes_degree[ele.id()] = node.degree();
			});
		
		values=computeKeysValues(nodes_degree);
		var data = {
    		labels: values.keys,
    		datasets: [
      		  {
		            label: "Graph nodes degree",
		            fillColor: "#16A085",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "#34495E",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: values.vals
		        }
		    ]
		};

		
		$("#myChart").attr("width",$(window).width() * .75);
		$("#myChart").attr("height",$(window).height() * .45);
		var ctx = document.getElementById("myChart").getContext("2d");
		ctx.clearRect ( 0 , 0 , document.getElementById("myChart").width,
		 document.getElementById("myChart").height );
		if(lastChart != null) lastChart.destroy();
		lastChart = new Chart(ctx).Line(data, optionschart);
	
		//$("#chartContainer").attr("title","Nodes Degree");
		$("#chartContainer").dialog({
			width: $(window).width() * .8,
			height:  $(window).height() * .5,
			title:"Nodes Degree",
			close: function(event, ui) 
        	{ 
            	$('#myChart').html("");
        	} 
		});
	});

	$("#pagerank").click(function(){
		
		var pr_nodes = cy.elements().pageRank({iterations:10000});
		
		var nodes_rank = {};
		cy.nodes().forEach(function (ele){
				var node= cy.getElementById(ele.id());
  				nodes_rank[ele.id()] = pr_nodes.rank(node);
			});
		
		valuesnodes = computeKeysValues(nodes_rank);
		
		var data = {
    		labels: valuesnodes.keys,
    		datasets: [
      		  {
		            label: "Graph Page Rank",
		            fillColor: "#16A085",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "#34495E",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: valuesnodes.vals
		        }
		    ]
		};
		$("#myChart").attr("width",$(window).width() * .75);
		$("#myChart").attr("height",$(window).height() * .45);
		var ctx = document.getElementById("myChart").getContext("2d");
		ctx.clearRect ( 0 , 0 , document.getElementById("myChart").width,
		 document.getElementById("myChart").height );
		if(lastChart != null) lastChart.destroy();
		lastChart = new Chart(ctx).Line(data, optionschart);
		//$("#chartContainer").attr("title","Nodes Page Rank");
		$("#chartContainer").dialog({
			width: $(window).width() * .8,
			height:  $(window).height() * .5,
			title:"Page Rank",
			close: function(event, ui) 
        	{ 
            	$('#myChart').html("");
        	} 
		});
		
	});
	$("#duration").click(function(){
		
		
		var durations = {};
		cy.edges().forEach(function (ele){
				var edge= cy.getElementById(ele.id());
				if(bgWindow.edgestime[ele.id()] && !isNaN(bgWindow.edgestime[ele.id()]))
  					durations[ele.id()] = bgWindow.edgestime[ele.id()] ;
			});
		
		valuesedges = computeKeysValues(durations);
		
		var data = {
    		labels: valuesedges.keys,
    		datasets: [
      		  {
		            label: "Request duration time",
		            fillColor: "#16A085",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "#34495E",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: valuesedges.vals
		        }
		    ]
		};
		$("#myChart").attr("width",$(window).width() * .75);
		$("#myChart").attr("height",$(window).height() * .45);
		var ctx = document.getElementById("myChart").getContext("2d");
		ctx.clearRect ( 0 , 0 , document.getElementById("myChart").width,
		 document.getElementById("myChart").height );
		if(lastChart != null) lastChart.destroy();
		lastChart = new Chart(ctx).Line(data, optionschart);
		$("#chartContainer").attr("title","Request duration");
		$("#chartContainer").dialog({
			width: $(window).width() * .8,
			height:  $(window).height() * .5,
			title:"Request duration",
			close: function(event, ui) 
        	{ 
            	$('#myChart').html("");
        	} 
		});
		
	});
	$("#sankey").click(function(){
		
		var data = new google.visualization.DataTable();
	    data.addColumn('string', 'From');
	    data.addColumn('string', 'To');
	    data.addColumn('number', 'Weight');

	    var datrows = [];
		var durations = {};
		cy.edges().forEach(function (ele){
				var edge= cy.getElementById(ele.id());
				if(bgWindow.edgestime[ele.id()] && !isNaN(bgWindow.edgestime[ele.id()]))
  					{
  						durations[ele.id()] = bgWindow.edgestime[ele.id()] ;
  						datrows.push([edge.source,edge.target,bgWindow.edgestime[ele.id()]]);
  					}

			});
		data.addRows(datrows);
		var options = {
	      width: $(window).width() * .5,
	      height:  $(window).height() * .5
	    };

		var chart = new google.visualization.Sankey(document.getElementById('sankeydiv'));
		chart.draw(data, options);
		

		
		
	});

	$("#about").click(function(){
			$("#aboutdiv").attr("title","About Surf Graph");
			$("#aboutdiv").dialog({
				width: $(window).width() * .5,
				height:  $(window).height() * .5,
			});
		});
	

});//	document.addEventListener('DOMContentLoaded', function () {
function computeKeysValues(x)
	{
		var vals = [];
    		var keys = [];
		    for( var key in x ) {
		    	keys.push(key);
		        if ( x.hasOwnProperty(key) ) {
		            vals.push(x[key]);
		        }
		    }
		    return { vals: vals, keys : keys };
	}
function setLayout()
{
	cy.elements().layout(graphLayouts[layout]);
}
function updateLayout()
{
	//console.log("update layout " + layout);
	cy.elements().layout(graphLayouts[layout]);
}
function updateGraph(nodes, edges) {
	/*
	console.log({
		nodes: nodes,
		edges: edges,
	});
	*/
	for (var i = 0; i < nodes.length; i++) {
	cy.add(nodes[i]);
 	
	};
	for (var i = 0; i < edges.length; i++) {
		cy.add(edges[i]);
	};
	updateLayout();
}
function loadGraph(nodes, edges) {
	//console.log({nodes: nodes,edges: edges,});
	cy.remove(cy.nodes());
	cy.remove(cy.edges());	
	for (var i = 0; i < nodes.length; i++) {
		cy.add(nodes[i]);
	};
	for (var i = 0; i < edges.length; i++) {
		cy.add(edges[i]);
	};
	updateLayout();
}