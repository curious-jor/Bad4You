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
var playerIcon;
var playerPusher;

// Name, Sex, State
var playerInfo = [];
const playerImages = [
    "static/assets/baby.gif",
    "static/assets/child.gif",
    "static/assets/teen.gif",
    "static/assets/adult.gif",
    "static/assets/adult.gif",
    "static/assets/adult.gif",
    "static/assets/elder.gif",
    "static/assets/elder.gif",
    "static/assets/elder.gif",
    "static/assets/elder.gif",
    "static/assets/elder.gif",
    "static/assets/grave.gif"
];

const heartImages = [
    "static/assets/heart1.gif",
    "static/assets/heart2.gif",
    "static/assets/heart3.gif",
    "static/assets/heart4.gif",
];

var questionIndex = -1;
const maxAge = 100;
const ageMod = 10;



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
    
    playerIcon = document.getElementById("player icon");
    playerPusher = document.getElementById("gif pusher");
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
    nextQuestion();
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
    for(var i=0; i<answerLog.length; i++) {
        if(answerLog[i][1][diseaseIndex] != 1)
            riskFactors.push(answerLog[i][0]);
    }
    var mc = 
        `<div class="modal-content" style="width: 60%"> 
            You've got: <br><p style="color: red">`+diseases[diseaseIndex]+`</p>
            <br> <p style="font-size: 16px">
            The following choices lead you there: </p> <br>`;
    
    for(var i=0; i<riskFactors.length; i++) {
        mc += riskFactors[i]+"<br>";
    }
            
    mc += ` <br><input type="button" value="Try Again?" class="in-modal"    
            onClick="reset()" > </div> `;
    modalElement.innerHTML = mc;
}

function naturalDeath() {
    modalTitle.innerHTML = "Dead";
    modalElement.style.display = "block";
    modalName.style.display = "none";
    var mc = 
        `<div class="modal-content" style="width: 60%">
            Congradulations <br>
            <p style="color: green"> You died peacefully of old age</p>
            <br> <p style="font-size: 16px">
            <br><input type="button" value="Again?" class="in-modal"    
            onClick="reset()" > </div> `;
    modalElement.innerHTML = mc;
}

function reset() {
    location.reload();
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
    if(questionIndex*ageMod >= maxAge) naturalDeath();
    answerLog[questionIndex] = [newAnswer.value, tempMods];
    nextQuestion();
}

function nextQuestion() {
    questionIndex++;
    ageElement.innerHTML = questionIndex * ageMod;
    playerPusher.style.paddingLeft = (questionIndex*7)+"%";
    playerIcon.src = playerImages[questionIndex];
    console.log(playerIcon);
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
            +'" class="answer-button"'
            +' onClick="gotAnswer(this)">';
    }

    answerElement.innerHTML = a;
}

function getQandA(index) {
    return ["Question "+index, ["Answer A "+index, "Answer B "+index]];
}

function getDisseaseMods(index, answer) {
    return [1.01];
}