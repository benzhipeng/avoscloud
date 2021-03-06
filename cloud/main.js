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
  
  	api.fetchDataWithURL(request.params.dataURL,request.params.urlLen,request.params.num,function (data) {

	// console.info(data);
		response.success(data);
  	});
});

AV.Cloud.define("fetch115DataWithURL", function(request, response) {
  
  	api.fetch115DataWithURL(request.params.url,function (data) {

	 // console.info(data);
		response.success(data);
  	});
});

AV.Cloud.define("fetch115DetailDataWithURL", function(request, response) {
  
  	api.fetch115DetailDataWithURL(request.params.url,function (data) {

	 // console.info(data);
		response.success(data);
  	});
});

AV.Cloud.define("fetchKuaiDiInfo", function(request, response) {
  
    api.fetchKuaiDiInfo(request.params.kuaidiKey,request.params.kuaidiNumber,function (data) {
       response.success(data);
    });
});

AV.Cloud.define('timerToFetchKuaiDiInfo', function(request, response) {
  
    api.timerToFetchKuaiDiInfo(function (data) {
       console.log(data);
       response.success(data);      
       // console.info(data);
    });
});

AV.Cloud.define('manshijian', function(request, response) {
  
    api.manshijian(request.params.m_page,request.params.m_type,function (data) {
       // console.log(data);
       response.success(data);      
    });
});

AV.Cloud.define('manshijiandetail', function(request, response) {
  
    api.manshijiandetail(request.params.m_url,function (data) {
       // console.log(data);
       response.success(data);      
    });
});


