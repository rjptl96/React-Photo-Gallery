// Node module for working with a request to an API or other fellow-server
var APIrequest = require('request');
var dotenv = require('dotenv');
const result = dotenv.config({path: 'apikey.env'})
var fs = require('fs');
var url = require('url');
var http = require('http');
http.globalAgent.maxSockets = 1;


const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('PhotoQ.db');

if (result.error) {
    throw result.error;
}
// An object containing the data the CCV API wants
// Will get stringified and put into the body of an HTTP request, below



// URL containing the API key
// You'll have to fill in the one you got from Google


// function to send off request to the API
function annotateImage() {

    theurl = 'https://vision.googleapis.com/v1/images:annotate?key=' + process.env.MYAPIKEY;

    var data = fs.readFileSync('photoList.json');
    if (! data) {
        console.log("cannot read 6whs.json");
    } else {
        listObj = JSON.parse(data);
        imgList = listObj.photoURLs;
    }
    var i;
    for (i = 0; i < 2; i++) {
        // myURL = url.parse(imgList[i], true);
        imgUrl = imgList[i];
        APIrequestObject = {
            "requests":[
                {
                    "image":{
                        "source":{
                            "imageUri":
                                imgUrl
                        }
                    },
                    "features":[
                        {
                            "type": "LABEL_DETECTION" , "type": "LANDMARK_DETECTION"
                        }
                    ]
                }
            ]
        }

        APIrequest(
            { // HTTP header stuff
                url: theurl,
                method: "POST",
                headers: {"content-type": "application/json"},
                // will turn the given object into JSON
                json: APIrequestObject
            },
            // callback function for API request
            APIcallback
        );

    }




    // The code that makes a request to the API
    // Uses the Node request module, which packs up and sends off
    // an HTTP message containing the request to the API server



    // callback function, called when data is received from API
    function APIcallback(err, APIresponse, body) {
        if ((err) || (APIresponse.statusCode != 200)) {
            console.log("Got API error");
            console.log(body);
        } else {
            APIresponseJSON = body.responses[0];
            console.log(APIresponseJSON);
            var bod = JSON.parse(APIresponse.request.body);
            var requesturl = url.parse(bod.requests[0].image.source.imageUri);
            var str = requesturl.path;
            var n = str.lastIndexOf('/');
            var result = str.substring(n + 1);
            var string = 'UPDATE photoTags SET tags = \'' + result + '\' WHERE fileName = \'' + result + '\'';
            console.log(string);
            db.all( string, function (err, rowData) {
                dataCallback(err, rowData);

            });


            //console.log(APIresponseJSON.landmarkAnnotations[0].locations);
        }
    } // end callback function

} // end annotateImage

function dataCallback(err, rowData,response) {
    if (err) {
        console.log("error: ",err);
    }
    else {
        var listObj = JSON.stringify(rowData);
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(listObj);

        //console.log("got: ",rowData,"\n");
    }
}
// Do it!
annotateImage();