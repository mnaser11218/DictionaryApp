var form = document.getElementById("form-control6");
var gradeLevelform = document.getElementById("grade-level-input");
var contextform = document.getElementById("context-def-input");
var button = document.getElementById("button-submit");
var AIbutton = document.getElementById("ai-button");
// var apiKey = localStorage.getItem('MY_GLOBAL_VAR');
var apiKey = function getApiKeyFromCookies() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      if (cookie.trim().startsWith('MY_GLOBAL_VAR=')) {
        return cookie.trim().substring('MY_GLOBAL_VAR='.length);
      }
    }
    return null;
  }
// const apiKey = localStorage.getItem('MY_GLOBAL_VAR');
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

    if(!contextform.value && !gradeLevelform.value){
        getDef(form.value);
    }else{
        fetchOpenAiContext(contextform.value, gradeLevelform.value, form.value)
    }
    
    });

    AIbutton.addEventListener("click", (event) => { 
    event.preventDefault();
    fetchOpenAiSpelling(form.value)
    });



    function fetchOpenAiSpelling(word) {
        if (!word) {
            alert("Word cannot be empty for an AI response.");
        } else {
            const apiUrl = 'https://api.openai.com/v1/chat/completions';
            const requestPayload = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Fix the spelling of this word, return only the updated word: ${word}`
                    }
                ],
                max_tokens: 1000
            };
    
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            };
    
            fetch(apiUrl, requestOptions)
                .then(response => response.json())  // Parse the JSON response
                .then(data => {
                    console.log(data.choices[0].message.content);  // Log the response
                    const gptResponse = data.choices[0].message.content;
                    console.log("gpt response is: " + gptResponse)
                    form.value = gptResponse;  // Update the form with the AI response
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
            function getDef(text) {
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
            console.log(key + " : " + firstArray[key]);
            });

        console.log("data from api: " + firstArray)
        runFunctionToUpdateData(firstArray);
    })
        .catch(function (error) {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function fetchOpenAiContext(contextWord, gradeLevel, word){
    if (!contextWord) {
        alert("Word cannot be empty for an AI response.");
    } else {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const requestPayload = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `provide MULTIPLE definitions of this word: ${word}, and give examples of the word in the context of: ${contextWord}, use examples for someone who's grade level is: ${gradeLevel}. Return it in an object similar to this: {
    "word": "${word}",
    "phonetic": "/kɑː/",
    "phonetics": [
      {
        "text": "/kɑː/",
        "audio": "",
        "sourceUrl": "",
        "license": {
          "name": "",
          "url": ""
        }
      },
    ],
    "meanings": [
      {
        "partOfSpeech": "noun",
        "definitions": [
          {
            "definition": "provide a definition of this word ${form.value} in context: ${contextWord} ",
            "synonyms": [
           "provide multiple synonyms of this word ${form.value} in context: ${contextWord} ",
            ],
            "antonyms": [],
            "example": " provide a sentence example of this word ${form.value} in the context of: ${contextWord}, for someone who's grade level is:${gradeLevel} "
          },
          {
             "definition": "provide another definition of this word ${form.value} in the context of: ${contextWord}",
            "synonyms": [
           "provide multiple synonyms of this word ${form.value} in the context of: ${contextWord} ",
            ],
            "antonyms": [],
            "example": " provide a sentence example of this word ${form.value} in context: ${contextWord} "
          },

            {
             "definition": "provide another definition of this word ${form.value} in the context of: ${contextWord}, for someone who's grade level is:${gradeLevel} ",
            "synonyms": [
           "provide multiple synonyms of this word ${form.value} in the context of: ${contextWord} ",
            ],
            "antonyms": [],
            "example": " provide a sentence example of this word ${form.value} in context: ${contextWord}, for someone who's grade level is:${gradeLevel} "
          }
        ],
        "synonyms": [
        " provide MULTIPLE synonyms of this word ${form.value} in context: ${contextWord} "
       
        ],
        "antonyms": [" provide MULTIPLE antonyms of this word ${form.value} in the context of: ${contextWord}"]
      }
    ],
    "license": {
      "name": "CC BY-SA 3.0",
      "url": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "sourceUrls": [
      "https://en.wiktionary.org/wiki/car"
    ]
  }`
                }
            ],
            max_tokens: 1000
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                console.log(data.choices[0].message.content);  // Log the response
                const gptResponse = data.choices[0].message.content;
                const gptResponse1 = JSON.parse(gptResponse)
                runFunctionToUpdateData(gptResponse1);

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
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
