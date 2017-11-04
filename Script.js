var diseases = ["Heart Disease"];
var diseaseMods = [0.02];

var answerLog = [];

var answers = [];
var question = "";

var questionElement;
var answerElement;
var ageSelectElement;
var modalElement;

var questionIndex = 0;

window.onload = function(){
    questionElement = document.getElementById("question");
    answerElement = document.getElementById("answers");
    modalElement = document.getElementById("modal");
    
    ageSelectElement = document.getElementById("age select");
    for(var i=0; i<100; i++) {
        ageSelectElement.innerHTML += "<option>"+i+"</option>";
    }
    nextQuestion();
}

function submitModal(elem) {
    modal.style.display = "none";
}

function gotAnswer(ele) {
    var tempMods = getDisseaseMods(ele.value, questionIndex);
    for(var i=0; i<diseaseMods.length; i++) {
        diseaseMods[i] *= tempMods[i];
    }
    console.log("Disease Mods: "+diseaseMods);
    nextQuestion();
}

function nextQuestion() {
    questionIndex++;
    var qa = getQAndA(questionIndex);
    makeQuestion(qa[0]);
    makeAnswers(qa[1]);
}

function makeQuestion(question) {    
    questionElement.innerHTML = question;
}

function makeAnswers(answers) {
    var a = "";
    
    for(var i=0; i<answers.length; i++) {
        a += '<input type="button" id="'+i
            +'" value="'+answers[i]
            +'" onClick="gotAnswer(this)">';
    }
    
    answerElement.innerHTML = a;
}

function getQAndA(index) {
    return ["Question "+index, ["Answer A "+index, "Answer B "+index]];
}

function getDisseaseMods(answer, index) {
    return [0.50];
}
