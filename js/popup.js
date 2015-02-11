var bgWindow = null;
var currentTab = null;

document.addEventListener('DOMContentLoaded', function () {
	
	bgWindow = chrome.extension.getBackgroundPage();
	var bgDoc = bgWindow.document;
	var bgContent = bgDoc.getElementById("content");

	if(!bgWindow.STATUS)
	{
		console.log("set to stop from start");
		$("#btnStart").attr("class","btn btn-primary");
		$("#btnStart").html("Start");		
	}
	else
	{
		console.log("set to start from stop");
		$("#btnStart").attr("class","btn btn-danger");
		$("#btnStart").html("Stop");

	}
	$("#btnGraph")
		.click(function(){
		console.log(bgWindow.nodes.length);
		if(bgWindow.nodes.length > 0)
			bgWindow.showGraph();
		else
			$("#aler-message").replaceWith("<span id=\"aler-message\" style=\"color:red;\">Sorry but no nodes are found. To start the Press start before!</span>");
	});
	$("#btnStart").click(function(){

			if(!bgWindow.STATUS)
			{
				console.log("set to start from stop");
				$("#btnStart").attr("class","btn btn-danger");
				$("#btnStart").html("Stop");
				bgWindow.startHTTPsurfing();
				$("#aler-message").replaceWith("<span id=\"aler-message\" style=\"color:red;\">Started building new network!</span>");

			}
			else
			{
				console.log("set to stop from start");
				$("#btnStart").attr("class","btn btn-primary");
				$("#btnStart").html("Start");
			
				bgWindow.stopHTTPsurfing();
				$("#aler-message").replaceWith("<span id=\"aler-message\" style=\"color:red;\">Building the nwtwork stopped!</span>");

			}

		
	});
});