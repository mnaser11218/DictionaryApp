// Import stylesheets
//import './style.css';

const form: HTMLFormElement= document.getElementById("form-control6") as HTMLFormElement;
const button : HTMLButtonElement = document.getElementById("button-submit") as HTMLButtonElement;
const defineWord: HTMLHeadElement= document.getElementById("definition12") as HTMLHeadElement;
const pTagPhonetic: HTMLParagraphElement = document.getElementById("lead") as HTMLParagraphElement;
var ul = document.getElementById("list-unstyled");
var items = ul.getElementsByTagName("li");
var ulForSyn = document.getElementById("synonyms")
var itemsForSyn = ulForSyn.getElementsByTagName("li");

button.addEventListener("click", (event) => {
  console.log(form.value)
  event.preventDefault();
   // Prevent default form submission
   console.log("inside event listener")
  form.style.borderColor = "yellow";

 //const banner: any = document.getElementsByClassName("navbar navbar-expand-md navbar-dark bg-dark mb-4")
  
  //banner.style.background = "red";
 getUsers(form.value);
});

function getUsers(text: string){
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Assuming the response is JSON
  })
  .then(data => {
    console.log("updated data")
    var firstArray = data[0];
    Object.keys(firstArray).forEach(key => {
      console.log(key + ": " + firstArray[key]);
    });
    updateHtmlWithApiData(firstArray);
    emptyOutList();
    putDataInList(0, firstArray);
    putDataForSynonyms(0, firstArray);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

function updateHtmlWithApiData(data: any){
  defineWord.innerHTML= "Word: " + data.word;
  pTagPhonetic.innerHTML = "phonetics : " + "<b>" + data.phonetic + "</b>";
}

function emptyOutList(){
  for (var i = 0; i < items.length; i++) {
    items[i].innerHTML= "";
  }

}

function putDataInList(amount: number, data: any){
  for (var i = 0; i <= data.meanings[amount].definitions.length; i++) {
    if(i ==6){
      return;
    }
   if(i ==0  &&  data.meanings[amount].partOfSpeech){
    items[i].innerHTML = " Part of Speech:  " + data.meanings[amount].partOfSpeech 
    + "<br/>" + "<b>" + (i +1) + "</b>"  + ": "  + data.meanings[amount].definitions[i].definition;
    }else{
    items[i].innerHTML =  "<b>" + (i +1) + "</b>"  + ": "  + data.meanings[amount].definitions[i].definition;
    if(data.meanings[amount].definitions[i].example){
      items[i].innerHTML += "<br/>" + " <b>Example</b>: "  + "<i>" + data.meanings[amount].definitions[i].example + "</i>";
    }
  }

  }
}

function putDataForSynonyms(amount, data){
  console.log("inside loop synonymns")
  for(var i =0; i <= data.meanings[amount].synonyms.length; i++){
    if(data.meanings[amount].synonyms.length == 0){
      return;
    }
    if(i === 6){
      return;
    }
    if(i== 0){
      itemsForSyn[i].innerHTML = "<i>" +  "Synonyms:" +  "</i> " + "<br/>" + data.meanings[amount].synonyms[i];
    }else{
      itemsForSyn[i].innerHTML = data.meanings[amount].synonyms[i];
    }
  }
}