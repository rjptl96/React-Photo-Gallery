//Staticserver.js!
var http = require('http');
var static = require('node-static');
var file = new static.Server('./public');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('PhotoQ.db');
var fs = require('fs');  // file access module

function fileServer(request, response) {

    const myURL = url.parse(request.url, true);
    

    var thequery = myURL.path.split('/query/');

    if (myURL.pathname === '/query' && myURL.query && myURL.query.numList  )
    {
        var thenums = myURL.query.numList;

        var newchar = ',';
        thenums = thenums.split(' ').join(newchar);
        db.all( ' SELECT * FROM photoTags WHERE idNum IN (' + thenums + ')', function (err, rowData) {
            dataCallback(err, rowData,response);

        });
        // if (myURL.query.num >= 0 && myURL.query.num < 989)
        // {
        //     response.writeHead(200, {"Content-Type": "application/json"});
        //     var json = imgList[myURL.query.num];
        //     response.end(json);
        // }
        // else
        // {
        //     response.writeHead(200, {"Content-Type": "application/json"});
        //     response.end("imagenotfound");
        // }

    }
    else
        {
            request.addListener('end', function() {
        file.serve(request, response, function(err, result) {
            if (err && (err.status === 404)) { // If the file wasn't found
                file.serveFile('/not-found.html', 404, {}, request, response);
            }
        });
    }).resume();
        }
    
}

function dataCallback(err, rowData,response) {
    if (err) {
        console.log("error: ",err);
        response.writeHead(404, {"Content-Type": "application/json"});
        response.end();
    }
    else {
        var listObj = JSON.stringify(rowData);
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(listObj);

        //console.log("got: ",rowData,"\n");
    }
}

var server = http.createServer(fileServer);


// fill in YOUR port number!
server.listen("53890");