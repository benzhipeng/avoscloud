// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:

var api=require("cloud/api.js");

AV.Cloud.define("hello", function(request, response) {
  // response.success(" world 111!");
  	api.fetchData(request.params.offset,request.params.tag_id,function (data) {

  		console.info('data: '+ data);
  	});
});

