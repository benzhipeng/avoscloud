
'use strict';

var avos    = require("cloud/avos.js"); 
var cheerio = require('cheerio');
var cheerio1 = require('cheerio');
var async = require('async');
var urlsync = require('urllib-sync');


exports.fetchData=function (offset,tag_id,callback) {

	//取出所有数据
	var url="http://www.4j4j.cn/index.php?c=pic&a=load&page=1&offset=" + offset + "&tag_id=" + tag_id;
	var request = urlsync.request;
	var res1 = request(url);
	var lines = res1.data.toString('utf-8');
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
		var num = parseInt(text.substr(1,1));
		var suburl = href.substr(0,href.length - 5);
		for (var j = 1; j <= num; j++){
			var _url = suburl + "_" + j + ".html";
			res1 = request(_url);
			xx = cheerio1.load(res1.data);
			var ss = xx('div[class=pic-image]').find('img').attr('src');
			imgArray.push(ss);
			
		}
		var obj = { 
		  index: a,
		  src: src,
		  alt: alt,
		  width: width,
		  height: height,
		  imgArray:imgArray
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