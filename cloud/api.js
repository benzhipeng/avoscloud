
'use strict';

var avos    = require("cloud/avos.js"); 
var cheerio = require('cheerio');
var cheerio1 = require('cheerio');
var async = require('async');
var urlsync = require('sync-request');;
exports.timerToFetchKuaiDiInfo = function (callback){
	var expressOrderInfo_class = AV.Object.extend("ExpressOrderInfo");
		var query = new AV.Query(expressOrderInfo_class);
		query.find({
		  	success: function(results) {
		    	for (var i = 0; i < results.length; i++){
		    		var obj = results[i];
		    		exports.fetchKuaiDiInfo(obj.get('express_type'),obj.get('express_number'),callback);
		    	}
		  	},
		  	error: function(error) {
		  	}
		}); 
}


exports.fetchKuaiDiInfo = function (kuaidiKey,KuaidiNumber,callback){
	
	AV.Cloud.httpRequest({
	  url: 'http://api.ickd.cn',
	  params: {
	    "id" : '109158',
	    "secret" : 'b7898d0a4dd41f8f1a05711f200bfb90',
	    "com" : kuaidiKey,
	    "nu" : KuaidiNumber,
	    "type" : 'json',
	    "ord" : 'asc',
	    "encode" : 'utf-8',
	    "ver" : '2',
	  },
	  success: function(httpResponse) {

		var expressOrderInfo_class = AV.Object.extend("ExpressOrderInfo");
		var query = new AV.Query(expressOrderInfo_class);
		query.equalTo("express_type", kuaidiKey);
		query.equalTo("express_number", KuaidiNumber);
		query.find({
		  	success: function(results) {
		    
		    	var jsonResult_from_ackd = JSON.parse(httpResponse.text);
		    	var update_time_from_ackd = jsonResult_from_ackd["update"];
		    	var items_from_ackd = jsonResult_from_ackd['data']; 
    			var item_from_ackd  = items_from_ackd[items_from_ackd.length - 1];
    			var item_time_ackd = item_from_ackd['time'];

		    	if(results.length > 0){
		    		var obj = results[0];
		    		var update_time_from_avos = obj.get("express_lastupdatetime");	
		    		if(update_time_from_ackd >= parseInt(update_time_from_avos)){ //大于本地存储的时间 
		    			obj.set('express_lastupdatetime',update_time_from_avos);
		    			var item_time_avos = obj.get('express_last_data_time');	

		    			if(item_time_avos != item_time_ackd){
		    				item_from_ackd['status'] = jsonResult_from_ackd['status'];
		    				callback(JSON.stringify(item_from_ackd));
		    				obj.save();
		    			}else {
		    				callback('暂无数据');
		    			}
		    		}else {
		    			
		    		}

		    	}else {
		    		
					var expressOrderInfo = AV.Object.new('ExpressOrderInfo');
					expressOrderInfo.save({
		 				express_type: kuaidiKey.toString(),
		 				express_number: KuaidiNumber.toString(),
		 				express_result:httpResponse.text,
		 				express_lastupdatetime:update_time_from_ackd.toString(),
		 				express_last_data_time:item_time_ackd
					}, {
		  			success: function(expressOrderInfo) {
		    			
		  			},
		  			error: function(expressOrderInfo, error) {
		    			
		  			}
					});
		    	}
		  	},
		  	error: function(error) {
		    	
		  	}
		});    
	  },
	  error: function(httpResponse) {
	    callback(null);
	  }
	});

}


//http://q.115.com/t-122826-30463.html
exports.fetch115DetailDataWithURL = function (url,callback){
	avos.httpGet(url,function(res) {
	 	var data = res.data.toString('utf-8');
	 	var x = cheerio.load(data);
	 	var a = 0;
	 	var myArray = [];
	 	var imgs = x('div[id=js_content_box]').eq(0).find('img');
	 	for (var i = 0; i < imgs.length; i++){
	 		var src = imgs.eq(i).attr('src');
 			myArray.push(src);	
	 	}
	 	callback(JSON.stringify(myArray));
	 });
}

//http://q.115.com/122826
exports.fetch115DataWithURL = function (url,callback){

	 avos.httpGet(url,function(res) {
	 	var data = res.data.toString('utf-8');
	 	var x = cheerio.load(data);
	 	var a = 0;
	 	var myArray = [];
	 	x('li[class=topic-gallery]').each(function(i, elem) {
	 		var photo = x(elem).find("div[class=photo]");
	 		var title = x(elem).find("div[class=content]");
	 		
 			var imgArray = [];
 			var dds = photo.find("dd");
 			for (var j = 0; j < dds.length; j++){
 				imgArray.push(dds.eq(j).find("img").attr("org-src"));
 			}
 			var  re_e = /\r/g;
 			var  re_a = /\n/g;
 			var  re_c = /undefinedd/g;
 			var  re_d = / /g;
 			var item = title.find("div[class=title]").eq(0).children().eq(0);
 			var content = item.text().trim();
 			content = content.replace(re_e,"");
 			content = content.replace(re_a,"");
 			content = content.replace(re_c,"");
 			content = content.replace(re_d,"");

 			var  suburl = title.find("a").eq(0).attr("href");
 			suburl = "http://q.115.com" + suburl;
 			var obj = { 
			  imgArray:imgArray,
			  content:content,
			  sourceUrl:suburl
			}
 			myArray.push(obj);
	 		
	 		a++;
	 	});
	 	callback(JSON.stringify(myArray));
	 });
}	

exports.fetchDataWithURL = function (dataURL,urlLen,num,callback) {

	var imgArray = [];

	var suburl = dataURL.substr(0,urlLen - 5);
	for (var j = 1; j <= parseInt(num); j++){
		var _url = suburl + "_" + j + ".html";
		var res1 = urlsync('GET',_url);
		var xx = cheerio1.load(res1.getBody().toString('utf-8'));
		var ss = xx('div[class=pic-image]').find('img').attr('src');
		imgArray.push(ss);
	}
	callback (JSON.stringify(imgArray));
}

exports.fetchData=function (offset,tag_id,callback) {

	//取出所有数据
	var url="http://www.4j4j.cn/index.php?c=pic&a=load&page=1&offset=" + offset + "&tag_id=" + tag_id;	
	var res1 =  urlsync('GET',url);
	var lines = res1.getBody().toString('utf-8');
	var  re = /\\/g; // 创建正则表达式模式。
	var  re_e = /\"/g;
 	lines = lines.replace(re, ""); // 用 "A" 替换 "The"。 
 	lines = lines.replace(re_e, ""); // 用 "A" 替换 "The"。 
	var x = cheerio.load(lines);

	
 	var myArray = [];
	var a = 0;
	x('li').each(function(i, elem) {

		
		var src = x(elem).find("img").attr("data-original");
		// src = src.replace(re, ""); // 用 "A" 替换 "The"。 
		// src = src.replace(re_e, ""); // 用 "A" 替换 "The"。 
		var alt = x(elem).find("img").attr("alt");
		// alt = alt.replace(re, ""); // 用 "A" 替换 "The"。 
		// alt = alt.replace(re_e, ""); // 用 "A" 替换 "The"。 
		var width = x(elem).find("img").attr("width");
		// width = width.replace(re, ""); // 用 "A" 替换 "The"。 
		// width = width.replace(re_e, ""); // 用 "A" 替换 "The"。 
		var height = x(elem).find("img").attr("height");
		// height = height.replace(re, ""); // 用 "A" 替换 "The"。 
		// height = height.replace(re_e, ""); // 用 "A" 替换 "The"。 
		var  href = x(elem).find("img").parent().attr("href");
	// 　　 href = href.replace(re, ""); // 用 "A" 替换 "The"。 
	// 	href = href.replace(re_e, ""); // 用 "A" 替换 "The"。 
		
		a++;
		var ins = x(elem).find("ins")[1];
		

		var imgArray = [];
		var  text = x(ins).text();
		var num = parseInt(text.replace(/[^0-9]/ig,""));



		// var suburl = href.substr(0,href.length - 5);
		// for (var j = 1; j <= num; j++){
		// 	var _url = suburl + "_" + j + ".html";
		// 	res1 = urlsync('GET',_url);
		// 	var xx = cheerio1.load(res1.getBody().toString('utf-8'));
		// 	var ss = xx('div[class=pic-image]').find('img').attr('src');
		// 	imgArray.push(ss);
		// }
		var obj = { 
		  src: src,
		  alt: alt,
		  width: width,
		  height: height,
		  href:href,
		  num:num
		}
		myArray.push(obj);
	});
	callback (JSON.stringify(myArray));

	// var url = "http://www.4j4j.cn/beauty/29.html";
	// var request = urlsync.request;
	// var res1 = request(url);
	// var xx = cheerio1.load(res1.data);
	// console.info(xx('div[class=pic-image]').find('img').attr('src'));

	// res1 = request("http://www.4j4j.cn/beauty/29_2.html");
	// xx = cheerio1.load(res1.data);
	// console.info(xx('div[class=pic-image]').find('img').attr('src'));	

	 // var url="http://www.4j4j.cn/index.php?c=pic&a=load&page=1&offset=2520&tag_id=0";
	 // avos.httpGet(url,function(res) {

		// var  re = /\\/g; // 创建正则表达式模式。
		// var  re_e = /\"/g;
		// var  re_a = /\t/g;
	 // 	var json=res.data;
	 // 	 var lines = json.toString('utf-8');
	 // 	lines = lines.replace(re, ""); // 用 "A" 替换 "The"。 
	 // 	lines = lines.replace(re_e, ""); // 用 "A" 替换 "The"。 
	 // 	lines = lines.replace(re_a, ""); // 用 "A" 替换 "The"。 
	 // 	// console.info(lines);
	 // 	var x= cheerio.load(lines);
	 // 	var myArray = [];
		// var a = 0;
		// x('li').each(function(i, elem) {

			
		// 	var src = x(elem).find("img").attr("data-original");
		// 	src = src.replace(re, ""); // 用 "A" 替换 "The"。 
		// 	src = src.replace(re_e, ""); // 用 "A" 替换 "The"。 
		// 	var alt = x(elem).find("img").attr("alt");
		// 	alt = alt.replace(re, ""); // 用 "A" 替换 "The"。 
		// 	alt = alt.replace(re_e, ""); // 用 "A" 替换 "The"。 
		// 	var width = x(elem).find("img").attr("width");
		// 	width = width.replace(re, ""); // 用 "A" 替换 "The"。 
		// 	width = width.replace(re_e, ""); // 用 "A" 替换 "The"。 
		// 	var height = x(elem).find("img").attr("height");
		// 	height = height.replace(re, ""); // 用 "A" 替换 "The"。 
		// 	height = height.replace(re_e, ""); // 用 "A" 替换 "The"。 
		// 	var  href = x(elem).find("img").parent().attr("href");
		// 　　 href = href.replace(re, ""); // 用 "A" 替换 "The"。 
		// 	href = href.replace(re_e, ""); // 用 "A" 替换 "The"。 
		// 	var obj = { 
		// 	  index: a,
		// 	  src: src,
		// 	  alt: alt,
		// 	  width: width,
		// 	  height: height,
		// 	  href:href
		// 	}
		// 	myArray.push(obj);
		// 	a++;

			
		// 	var ins = x(elem).find("ins")[1];
		// 	if (ins != null) {
		// 		if (a == 1){
		// 			var  text = x(ins).text();
		// 			var num = parseInt(text.substr(1,1));
		// 			var request = urlsync.request;
		// 			var res1 = request(href);

		// 			 var xx = cheerio1.load(res1.data);
		// 			 console.info($('div[class=pic-image]').html());
		// 		}
		// 	}
		// });
		
		
		

	 // 	//callback (JSON.stringify(myArray));
	 // });
};

exports.htmlParser