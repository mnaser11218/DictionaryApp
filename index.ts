// Import stylesheets
//import './style.css';

const form: HTMLFormElement= document.getElementById("form-control6") as HTMLFormElement;
const button : HTMLButtonElement = document.getElementById("button-submit") as HTMLButtonElement;
const AIbutton : HTMLButtonElement = document.getElementById("ai-button") as HTMLButtonElement;

const defineWord: HTMLHeadElement= document.getElementById("definition12") as HTMLHeadElement;
const pTagPhonetic: HTMLParagraphElement = document.getElementById("lead") as HTMLParagraphElement;
var ul = document.getElementById("list-unstyled") as HTMLUListElement;
var items = ul.getElementsByTagName("li");
var ulForSyn = document.getElementById("synonyms") as HTMLUListElement;
var itemsForSyn = ulForSyn.getElementsByTagName("li");
var ulForAnt = document.getElementById("antonymns") as HTMLUListElement;
var itemsForAnt = ulForAnt.getElementsByTagName("li")
type GenericObject = Record<string, any>;


button.addEventListener("click", (event) => {
  console.log(form.value)
  event.preventDefault();
  form.style.borderColor = "yellow";  
 getDef(form.value);
});

AIbutton.addEventListener("click", (event) => {
//   console.log(form.value)
  event.preventDefault();
//   form.style.borderColor = "yellow";  
//  getDef(form.value);
console.log("spelling button clicked")
});

function getDef(text: string): void{
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    var firstArray = data[0];
    Object.keys(firstArray).forEach(key => {
      console.log(key + ": " + firstArray[key]);
    });
    runFunctionToUpdateData(firstArray)
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

function updateHtmlWithApiData(data: GenericObject): void{
  defineWord.innerHTML= "Word: " + data.word;
  pTagPhonetic.innerHTML = "phonetics : " + "<b>" + data.phonetic + "</b>";
}

function emptyOutList(): void{
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("list-group-item");
    itemsForAnt[i].classList.remove("list-group-item");
    itemsForSyn[i].classList.remove("list-group-item");

    items[i].innerHTML= "";
    itemsForAnt[i].innerHTML = "";
    itemsForSyn[i].innerHTML = "";
  }


}

function putDataInList(amount: number, data: GenericObject) : void{
  for (var i = 0; i < data.meanings[amount].definitions.length; i++) {
    if(i ==6){
      return;
    }
    items[i].classList.add("list-group-item");
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

function putDataForSynonyms(amount: number, data: GenericObject): void{
  for(var i =0; i < data.meanings[amount].synonyms.length; i++){
    if(data.meanings[amount].synonyms.length == 0){
      return;
    }
    if(i === 6){
      return;
    }
    itemsForSyn[i].classList.add("list-group-item");

    if(i== 0){
      itemsForSyn[i].innerHTML = "<i>" +  "Synonyms:" +  "</i> " + "<br/>" +  "<i>"+data.meanings[amount].synonyms[i] + "</i>";
    }else{
      itemsForSyn[i].innerHTML = "<i>" + data.meanings[amount].synonyms[i] + "</i>";
    }
  }
}

function putDataForAntonyms(amount: number, data: GenericObject): void{
for(var i =0; i < putDataForAntonyms.length; i++){
  if(data.meanings[amount].antonyms.length == 0){
    return;
  }
  if(i === 6){
    return;
  }
  itemsForAnt[i].classList.add("list-group-item");

  if(i== 0){
    itemsForAnt[i].innerHTML = "<i>" +  "Antonyms:" +  "</i> " + "<br/>" + "<i>"+data.meanings[amount].antonyms[i] + "<i/>";
  }else{
    itemsForAnt[i].innerHTML = "<i>" +  data.meanings[amount].antonyms[i] + "<i/>";
  }
}
}

function runFunctionToUpdateData(firstArray: GenericObject): void {
  updateHtmlWithApiData(firstArray);
  emptyOutList();
  putDataInList(0, firstArray);
  putDataForSynonyms(0, firstArray);
  putDataForAntonyms(0, firstArray)
}
