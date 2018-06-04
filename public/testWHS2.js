
/* This array is just for testing purposes.  You will need to
   get the real image data using an AJAX query. */

let photos = [
];
function getautocomplete()
{
    var numString = document.getElementById("num").value;
    numString.replace(/^\s+ | ^\,+ | \s+$ | \,+$/,'');
    if (numString.length == 2)
    {
        var oReq = new XMLHttpRequest();
        //numString = numString.replace(", ", ",");
        //var numList = numString.split(',');
        var url = "query?autocomplete="+numString;
        // var numQueryString = numList.join('+');
        // var url = "query?keyList="+numQueryString;
        oReq.open("GET", url);  // setup callback
        oReq.addEventListener("load", autoListener);    // load event occurs when response comes back
        oReq.send();
    }
}
function createbutton()
{
    document.getElementById('headerFB').style.display = "flex";
    document.getElementById('num').style.display = "none";
    document.getElementById('sub').style.display = "none";



        var header = document.getElementById("query");
    if (document.getElementById("srch_bttn") === null) {
            var search_buttn = document.createElement("button");
            var theglass = document.createElement("i");
            theglass.id = "smallglass";
            theglass.className = "fa fa-search"

            //<button id ="sub" onclick="photoByNumber()"><i id= "magglass" class="fa fa-search"></i></button>
            search_buttn.id = "srch_bttn"
            //search_buttn.src = "search_icon.jpg";
            search_buttn.innerHTML
            search_buttn.style.border = "none";

            search_buttn.appendChild(theglass);
            header.appendChild(search_buttn);
            search_buttn.onclick = function() {

                document.getElementById('headerFB').style.display = "block";
                document.getElementById('num').style.display = "block";
                document.getElementById('sub').style.display = "block";
                document.getElementById("srch_bttn").style.display = "none";
                document.getElementById('bookClubTitle').style.display = "none";
            };
            search_buttn.style.display = "block";
        }
}

window.onresize = function() {
    var w = window.innerWidth;
    if (w > 480) {
        document.getElementById('bookClubTitle').style.display = "block";
        ReactDOM.render(React.createElement(App),reactContainer);
        document.getElementById('num').style.display = "block";
        document.getElementById('sub').style.display = "block";
        var search_button = document.getElementById('srch_bttn');
        if (search_button != null)
            {
                search_button.parentNode.removeChild(search_button);
            }



    }
    if (w < 481) {
        ReactDOM.render(React.createElement(App),reactContainer);



        createbutton();



    }
}






// A react component for a tag
class Tag extends React.Component {

    render () {
        var _onClick = this.props.onClick;
        var _index = this.props.text;
        //var _tags = this.props.tagarray;
        return React.createElement('p',  // type
            { className: 'tagText',onClick: function onClick(e) {
                    console.log("tile onclick");
                    e.stopPropagation();
                    // call Gallery's onclick
                    return _onClick (e,
                        { index: _index })
                }}, // properties
            this.props.text);  // contents
    }
};


// A react component for controls on an image tile
class TileControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = { thetagarray: this.props.tags, theimage:this.props.filename};
        this.selectTag = this.selectTag.bind(this);
    }
    selectTag(event, obj) {
        console.log("in onclick!", obj);
        //let photos = this.state.photos;
        let array = this.state.thetagarray;
        array = array.filter(a => a !== obj.index);
        var update = array.join(',');
        this.setState({ thetagarray: array });
        if (this.state.theimage != "")
        {
            var oReq = new XMLHttpRequest();
            //numString = numString.replace(", ", ",");
            //var numList = numString.split(',');
            var url = "query?fileName="+this.state.theimage;
            for (var i = 0; i < array.length ;i++)
            {
                url = url + "&query?taglist="+array[i];
            }

            // var numQueryString = numList.join('+');
            // var url = "query?keyList="+numQueryString;
            oReq.open("GET", url);  // setup callback
            //oReq.addEventListener("load", reqListener);    // load event occurs when response comes back
            oReq.send();
        }

    }
    render () {
        // remember input vars in closure
        var _selected = this.props.selected;
        var _src = this.props.src;
        var _tags = this.state.thetagarray;

        // parse image src for photo name
        var photoName = _src.split("/").pop();
        photoName = photoName.split('%20').join(' ');
        var objects = [];

        for (var x = 0; x < _tags.length; x++) {
            //objects.push({key: _tags[x], text: _tags[x] });
            objects.push(React.createElement(Tag,
                {key: _tags[x], text: _tags[x], onClick: this.selectTag }));
        }
        return ( React.createElement('div',
                {className: _selected ? 'selectedControls' : 'normalControls'},
                // div contents - so far only one tag

                objects
            )// createElement div
        )// return
    } // render
};


// A react component for an image tile
class ImageTile extends React.Component {

    render() {
        // onClick function needs to remember these as a closure
        var _onClick = this.props.onClick;
        var _index = this.props.index;
        var _photo = this.props.photo;
        var _selected = _photo.selected; // this one is just for readability

        return (
            React.createElement('div',
                {style: {margin: this.props.margin, width: _photo.width},
                    className: 'tile',
                    onClick: function onClick(e) {
                        console.log("tile onclick");
                        // call Gallery's onclick
                        return _onClick (e,
                            { index: _index, photo: _photo })
                    }
                }, // end of props of div
                // contents of div - the Controls and an Image
                React.createElement(TileControl,
                    {selected: _selected,
                        src: _photo.src, tags: _photo.tags.split(','), filename: _photo.fname}),
                React.createElement('img',
                    {className: _selected ? 'selected' : 'normal',
                        src: _photo.src,
                        width: _photo.width,
                        height: _photo.height
                    })
            )//createElement div
        ); // return
    } // render
} // class



// The react component for the whole image gallery
// Most of the code for this is in the included library
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { photos: photos };
        this.selectTile = this.selectTile.bind(this);
    }

    selectTile(event, obj) {
        console.log("in onclick!", obj);
        let photos = this.state.photos;
        photos[obj.index].selected = !photos[obj.index].selected;
        this.setState({ photos: photos });
    }

    render() {
        var w = window.innerWidth;
        var columns1;
        if (w >= 480){
            columns1 = 2;
        }
        if (w >= 1024){
            columns1 = 3;
        }
        if (w >= 1824){
            columns1 = 4;
        }
        if(w<480)
        {
            columns1 = 1;
        }

        return (
            React.createElement( Gallery, {photos: photos,columns: columns1,
                onClick: this.selectTile,
                ImageComponent: ImageTile} )
        );



    }

}

/* Finally, we actually run some code */

const reactContainer = document.getElementById("react");

ReactDOM.render(React.createElement(App),reactContainer);


// Called when the user pushes the "submit" button 
function photoByNumber() {

    var w = window.innerWidth;
    if (w > 480) {

        document.getElementById('headerFB').style.display = "flex";
        document.getElementById('bookClubTitle').style.display = "block";


    }
    if (w < 481) {
        document.getElementById('headerFB').style.display = "block";
        document.getElementById('bookClubTitle').style.display = "block";
        var search_button = document.getElementById('srch_bttn');
        if (search_button != null)
            {
                search_button.parentNode.removeChild(search_button);
            }
        createbutton();


    }

	var numString = document.getElementById("num").value;
    numString.replace(/^\s+ | ^\,+ | \s+$ | \,+$/,'')
	if (numString != "")
    {
        var oReq = new XMLHttpRequest();
        numString = numString.replace(", ", ",");
        var numList = numString.split(',');
        var url = "query?keyList="+numList[0];
        for (var i = 1; i < numList.length ;i++)
        {
            url = url + "&query?keyList="+numList[i];
        }

       // var numQueryString = numList.join('+');
       // var url = "query?keyList="+numQueryString;
        oReq.open("GET", url);  // setup callback
        oReq.addEventListener("load", reqListener);    // load event occurs when response comes back
        oReq.send();
    }


}

function autoListener() {
    var photoURL = this.responseText;
    if (photoURL != "")
    {
        var json = JSON.parse(photoURL);
        console.log(json);
    }

}

function reqListener () {
    var photoURL = this.responseText;
    var json = JSON.parse(photoURL);
    var display = document.getElementById("photoImg");


    if (photoURL !== "imagenotfound")
    {
        //display.src = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + json[0].fileName;
        var i;
        if(json.length > 0)
        {
            document.getElementById('initialtext').style.display = "none";
        }


        for (i = 0; i< json.length ; i++)
        {
            var theimage = {src:"http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + json[i].fileName, width: json[i].width, height: json[i].height, tags: json[i].tags, fname: json[i].fileName };
            photos.push(theimage);
        }


        ReactDOM.render(React.createElement(App),reactContainer);
    }
    else
    {
        alert("Image not found");
    }

} 