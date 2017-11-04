const diseases = ["Heart Disease"];
var diseaseMods = [0.02];

var answerLog = [];

var answers = [];
var question = "";

var questionElement;
var answerElement;
var ageSelectElement;
var modalElement;
var modalName;
var modalSelcets = [];
var modalTitle;

// Name, Sex, State
var playerInfo = [];

var questionIndex = 0;

window.onload = function(){
    questionElement = document.getElementById("question");
    answerElement = document.getElementById("answers");
    modalElement = document.getElementById("modal");
    modalName = document.getElementById("modal name");
    modalSelcets = document.getElementsByClassName("modal-select");
    modalTitle = document.getElementsByClassName("modal-title")[0];
    
    nextQuestion();
}

function submitModal(elem) {
    var finished = true;
    playerInfo[0] = modalName.value;
    if(playerInfo[0] == "") {
        finished = false;
        modalName.style.backgroundColor = "palevioletred";
    } else modalName.style.backgroundColor = "paleturquoise";
    for(var i=0; i<modalSelcets.length; i++) {
        var selctedIndex = modalSelcets[i].selectedIndex;
        playerInfo[i+1] = modalSelcets[i].options[selctedIndex].text;
        if(playerInfo[i+1].indexOf("Select") != -1) {
            finished = false;
            modalSelcets[i].style.backgroundColor = "palevioletred";
        }
        else modalSelcets[i].style.backgroundColor = "paleturquoise";
    }
    if(finished) modalElement.style.display = "none";
    console.log(playerInfo);
}

function kill() {
    modalTitle.innerHTML = "Dead";
    modalElement.style.display = "block";
    modalName.style.display = "none";
    for(var i=0; i<modalSelcets.length; i++) {
        modalSelcets[i].style.display = "none";
    }
    modalElement.innerHTML += 'Hello';
}

function gotAnswer(ele) {
    var tempMods = getDisseaseMods(ele.value, questionIndex);
    for(var i=0; i<diseaseMods.length; i++) {
        diseaseMods[i] *= tempMods[i];
        if(diseaseMods[i] > Math.random()) kill();
    }
    answerLog[questionIndex] = [ele.value, tempMods];
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
    return [1.50];
}
