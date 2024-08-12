// Import stylesheets
//import './style.css';
var form = document.getElementById("form-control6");
var button = document.getElementById("button-submit");
var defineWord = document.getElementById("definition12");
var pTagPhonetic = document.getElementById("lead");
var ul = document.getElementById("list-unstyled");
var items = ul.getElementsByTagName("li");
var ulForSyn = document.getElementById("synonyms");
var itemsForSyn = ulForSyn.getElementsByTagName("li");
var ulForAnt = document.getElementById("antonymns");
var itemsForAnt = ulForAnt.getElementsByTagName("li");
button.addEventListener("click", function (event) {
    console.log(form.value);
    event.preventDefault();
    form.style.borderColor = "yellow";
    getUsers(form.value);
});
function getUsers(text) {
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(text))
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(function (data) {
        var firstArray = data[0];
        Object.keys(firstArray).forEach(function (key) {
            console.log(key + ": " + firstArray[key]);
        });
        runFunctionToUpdateData(firstArray);
    })
        .catch(function (error) {
        console.error('There was a problem with the fetch operation:', error);
    });
}
function updateHtmlWithApiData(data) {
    defineWord.innerHTML = "Word: " + data.word;
    pTagPhonetic.innerHTML = "phonetics : " + "<b>" + data.phonetic + "</b>";
}
function emptyOutList() {
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("list-group-item");
        itemsForAnt[i].classList.remove("list-group-item");
        itemsForSyn[i].classList.remove("list-group-item");
        items[i].innerHTML = "";
        itemsForAnt[i].innerHTML = "";
        itemsForSyn[i].innerHTML = "";
    }
}
function putDataInList(amount, data) {
    for (var i = 0; i < data.meanings[amount].definitions.length; i++) {
        if (i == 6) {
            return;
        }
        items[i].classList.add("list-group-item");
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
function putDataForSynonyms(amount, data) {
    for (var i = 0; i < data.meanings[amount].synonyms.length; i++) {
        if (data.meanings[amount].synonyms.length == 0) {
            return;
        }
        if (i === 6) {
            return;
        }
        itemsForSyn[i].classList.add("list-group-item");
        if (i == 0) {
            itemsForSyn[i].innerHTML = "<i>" + "Synonyms:" + "</i> " + "<br/>" + "<i>" + data.meanings[amount].synonyms[i] + "</i>";
        }
        else {
            itemsForSyn[i].innerHTML = "<i>" + data.meanings[amount].synonyms[i] + "</i>";
        }
    }
}
function putDataForAntonyms(amount, data) {
    for (var i = 0; i < putDataForAntonyms.length; i++) {
        if (data.meanings[amount].antonyms.length == 0) {
            return;
        }
        if (i === 6) {
            return;
        }
        itemsForAnt[i].classList.add("list-group-item");
        if (i == 0) {
            itemsForAnt[i].innerHTML = "<i>" + "Antonyms:" + "</i> " + "<br/>" + "<i>" + data.meanings[amount].antonyms[i] + "<i/>";
        }
        else {
            itemsForAnt[i].innerHTML = "<i>" + data.meanings[amount].antonyms[i] + "<i/>";
        }
    }
}
function runFunctionToUpdateData(firstArray) {
    updateHtmlWithApiData(firstArray);
    emptyOutList();
    putDataInList(0, firstArray);
    putDataForSynonyms(0, firstArray);
    putDataForAntonyms(0, firstArray);
}
