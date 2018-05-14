
// Called when the user pushes the "submit" button 
function photoByNumber() {

	var num = document.getElementById("num").value;
    var oReq = new XMLHttpRequest(); 
    var url = "query?numList="+num;
    var newchar = '+'
    url = url.split(',').join(newchar);
    oReq.open("GET", url);  // setup callback 
    oReq.addEventListener("load", reqListener);    // load event occurs when response comes back 
    oReq.send(); 

}



function reqListener () {
    var photoURL = this.responseText;
    var json = JSON.parse(photoURL);
    var display = document.getElementById("photoImg");
    if (photoURL !== "imagenotfound")
    {
        display.src = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + photoURL;
    }
    else
    {
        alert("Image not found");
    }

} 