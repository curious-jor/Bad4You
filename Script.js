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
    questionElement = document.getElementById("question-text");
    answerElement = document.getElementById("answers");
    modalElement = document.getElementById("modal");
    modalName = document.getElementById("modal name");
    modalSelcets = document.getElementsByClassName("modal-select");
    modalTitle = document.getElementsByClassName("modal-title")[0];
    
    nameElement = document.getElementById("name");
    ageElement = document.getElementById("age");
    sexElement = document.getElementById("sex");
    stateElement = document.getElementById("state");

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
    
    populateInfo();
}

function populateInfo() {
    nameElement.innerHTML = playerInfo[0];
    ageElement.innerHTML = questionIndex;
    sexElement.innerHTML = playerInfo[1];
    stateElement.innerHTML = playerInfo[2];
}

function kill(diseaseIndex) {
    modalTitle.innerHTML = "Dead";
    modalElement.style.display = "block";
    modalName.style.display = "none";
    for(var i=0; i<modalSelcets.length; i++) {
        modalSelcets[i].style.display = "none";
    }
    console.log(answerLog);
    var riskFactors = [];
    for(var i=1; i<answerLog.length; i++) {
        if(answerLog[i][1][diseaseIndex] != 1)
            riskFactors.push(answerLog[i][0]);
    }
    var mc = 
        `<div class="modal-content" style="width: 60%"> 
            You've got: <br>`+diseases[diseaseIndex]+`
            <br> The following choices lead you there:<br>`;
    
    for(var i=0; i<riskFactors.length; i++) {
        mc += riskFactors[i]+"<br>";
    }
            
    modalElement.innerHTML += "</div>";
    modalElement.innerHTML = mc;
}

var newAnswer;
function gotAnswer(ele){
    newAnswer = ele;
    //google.script.run.withSuccessHandler(recieveAnswer)
    //                 .getDiseaseMods(questionIndex, ele.value);
    recieveAnswer(getDisseaseMods(questionIndex, newAnswer.value));
    
}

function recieveAnswer(tempMods) {
    for(var i=0; i<diseaseMods.length; i++) {
        diseaseMods[i] *= tempMods[i];
        if(diseaseMods[i] > Math.random()) kill(i);
    }
    answerLog[questionIndex] = [newAnswer.value, tempMods];
    nextQuestion();
}

function nextQuestion() {
    questionIndex++;
    ageElement.innerHTML = questionIndex * 10;
    //google.script.run.withSuccessHandler(recieveQuestion)
                    //.getQandA(questionIndex);
    recieveQuestion(getQandA(questionIndex));
}

function recieveQuestion(qa) {
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

function getQandA(index) {
    return ["Question "+index, ["Answer A "+index, "Answer B "+index]];
}

function getDisseaseMods(index, answer) {
    return [1.50];
}