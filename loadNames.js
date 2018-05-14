var fs = require('fs');
var url = require('url');
var http = require('http');
const sqlite3 = require('sqlite3').verbose();

var sizeOf = require('image-size');
let db = new sqlite3.Database('PhotoQ.db');
var imgUrl;
var options;
var callbackcount = 0;



var imgList = [];
loadImageList ();
function loadImageList () {
    callbackcount = 0;
    var data = fs.readFileSync('6whs.json');
    if (! data) {
	    console.log("cannot read 6whs.json");
    } else {
	    listObj = JSON.parse(data);
	    imgList = listObj.photoURLs;
    }
    var i;
    var myURL;
    for (i = 0; i < imgList.length; i++) {
       // myURL = url.parse(imgList[i], true);
        imgUrl = imgList[i];
        options = url.parse(imgUrl);
        http.get(options,handleCallback).end();
    }


}


function handleCallback(response) {
    var chunks = [];
    var body = '';
    response.on('data', function (chunk) {
        chunks.push(chunk);
        body += chunk;
    }).on('end', function() {


        var buffer = Buffer.concat(chunks);
        //console.log(sizeOf(buffer));
        var height = sizeOf(buffer).height;
        var width = sizeOf(buffer).width;
        var fileName = response.req.path.substr(response.req.path.lastIndexOf('/') + 1);
        //var fileName = "";
        cmdStr = 'INSERT INTO photoTags(fileName ,width , height, location , tags) VALUES (\"'   +fileName+'\",'   +width+', ' +height+', "","")';

        db.run(cmdStr, dbCallback);

    });
}

function dbCallback(err) {
    if (err)
    {
        console.log(err);
    }
    callbackcount++;

    if(callbackcount == imgList.length)
    {
        dumpDB();
        db.close();
    }


}

function dumpDB() {
    db.all ( 'SELECT * FROM photoTags', dataCallback);

}

function dataCallback( err, data ) {
    console.log(data)
}