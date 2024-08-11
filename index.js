// Import stylesheets
//import './style.css';
var form = document.getElementById("form-control6");
var button = document.getElementById("button-submit");
var defineWord = document.getElementById("definition12");
var pTagPhonetic = document.getElementById("lead");
var ul = document.getElementById("list-unstyled");
var items = ul.getElementsByTagName("li");
button.addEventListener("click", function (event) {
    console.log(form.value);
    event.preventDefault();
    // Prevent default form submission
    console.log("inside event listener");
    form.style.borderColor = "yellow";
    //const banner: any = document.getElementsByClassName("navbar navbar-expand-md navbar-dark bg-dark mb-4")
    //banner.style.background = "red";
    getUsers(form.value);
});
function getUsers(text) {
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(text))
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming the response is JSON
    })
        .then(function (data) {
        console.log("updated data");
        var firstArray = data[0];
        Object.keys(firstArray).forEach(function (key) {
            console.log(key + ": " + firstArray[key]);
        });
        updateHtmlWithApiData(firstArray);
        emptyOutList();
        putDataInList(0, firstArray);
    })
        .catch(function (error) {
        console.error('There was a problem with the fetch operation:', error);
    });
}
function updateHtmlWithApiData(data) {
    //var ul: any = document.getElementById("list-unstyled");
    defineWord.innerHTML = "Word: " + data.word;
    pTagPhonetic.innerHTML = "phonetics : " + "<b>" + data.phonetic + "</b>";
    //var items: any = ul.getElementsByTagName("li");
}
function emptyOutList() {
    // var ul = document.getElementById("list-unstyled");
    //  var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; i++) {
        // do something with items[i], which is a <li> element
        items[i].innerHTML = "";
    }
}
function putDataInList(amount, data) {
    //var ul = document.getElementById("list-unstyled");
    // var items = ul.getElementsByTagName("li");
    for (var i = 0; i <= data.meanings[amount].definitions.length; i++) {
        // do something with items[i], which is a <li> element
        // data.meanings.definitions.partOfSpeech +  ": "+
        if (i == 0 && data.meanings[amount].partOfSpeech) {
            items[i].innerHTML = " Part of Speech:  " + data.meanings[amount].partOfSpeech
                + "<br/>" + "<b>" + (i + 1) + "</b>" + ": " + data.meanings[amount].definitions[i].definition;
        }
        else {
            items[i].innerHTML = "<b>" + (i + 1) + "</b>" + ": " + data.meanings[amount].definitions[i].definition;
            if (data.meanings[amount].definitions[i].example) {
                items[i].innerHTML += "<br/>" + " <b>Example</b>: " + "<i>" + data.meanings[amount].definitions[i].example + "</i>";
            }
        }
    }
}
