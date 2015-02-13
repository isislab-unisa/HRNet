var bgWindow = null;
var currentTab = null;

document.addEventListener('DOMContentLoaded', function () {

	bgWindow = chrome.extension.getBackgroundPage();
	var bgDoc = bgWindow.document;
	var bgContent = bgDoc.getElementById("content");

	if(!bgWindow.STATUS)
	{

		$("#btnStart").attr("class","btn btn-primary");
		$("#btnStart").html("Start");
	}
	else
	{

		$("#btnStart").attr("class","btn btn-danger");
		$("#btnStart").html("Stop");
		$("#alert-message").css({"visibility":"hidden"});

	}

	$('#lnodes').text($(bgWindow.nodes).size());
	$('#ledges').text($(bgWindow.edges).size());

	$("#btnGraph")
		.click(function(){

		if(bgWindow.nodes.length > 0)
			bgWindow.showGraph();
		else
			{
				$("#alert-message").text("Sorry but no nodes are found. (Press start button to enable HRNet).");
				$("#alert-message").css({"visibility":"visible"});
			}
	});
	$("#loadUrls")
		.click(function(){
			if(!bgWindow.STATUS)
			{
				$("#btnStart").attr("class","btn btn-danger");
				$("#btnStart").html("Stop");
				bgWindow.startHTTPsurfing();
				$("#alert-message").text("Start HTTP sniffing.");
				$("#alert-message").css({"visibility":"visible"});
				$('#lnodes').text($(bgWindow.nodes).size());
				$('#ledges').text($(bgWindow.edges).size());
			}
			bgWindow.loadUrls($("#urls").val().split(" "));

	});

	$("#btnStart").click(function(){

			if(!bgWindow.STATUS)
			{

				$("#btnStart").attr("class","btn btn-danger");
				$("#btnStart").html("Stop");
				bgWindow.startHTTPsurfing();
				$("#alert-message").text("Start HTTP sniffing.");
				$("#alert-message").css({"visibility":"visible"});
				$('#lnodes').text($(bgWindow.nodes).size());
				$('#ledges').text($(bgWindow.edges).size());

			}
			else
			{

				$("#btnStart").attr("class","btn btn-primary");
				$("#btnStart").html("Start");

				bgWindow.stopHTTPsurfing();
				$("#alert-message").text("Stop HTTP sniffing.");
				$("#alert-message").css({"visibility":"visible"});

			}


	});
});
