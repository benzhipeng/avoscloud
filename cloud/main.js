// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:

var api=require("cloud/api.js");

AV.Cloud.define("fetchData", function(request, response) {
  // response.success(" world 111!");
  	api.fetchData(request.params.offset,request.params.tag_id,function (data) {

		response.success(data);
  	});
});

AV.Cloud.define("fetchDataWithURL", function(request, response) {
  
  	api.fetchDataWithURL(request.params.url,request.params.num,function (data) {

	// console.info(data);
		response.success(data);
  	});
});

