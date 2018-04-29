/*

* Create By mryang On 18-4-29
* 
*/
var request = require("request");
var options = {url: 'https://api.github.com/repos/mikeal/request', headers: {'User-Agent': 'request'}};
request(options, function (err, result) {
    if (err) {
        console.log("错误：" + err);
    }
    var res = JSON.parse(result.body);
});