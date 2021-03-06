const diseases = ["Cancer", "Heart Disease"];
var diseaseMods = [0, 0.04];

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
    "static/assets/grave.gif"
];

var heartIcon;
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
    
    playerIcon = document.getElementById("player-icon");
    playerPusher = document.getElementById("gif pusher");
    heartIcon = document.getElementById("heart-icon");
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
    if(finished) {
        modalElement.style.display = "none";
        populateInfo();
        nextQuestion();
    }
    
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
    var riskFactors = [];
    for(var i=0; i<answerLog.length; i++) {
        if(answerLog[i][2][diseaseIndex] > 1)
            riskFactors.push(answerLog[i][1]);
    }
    var mc = 
        `<div class="modal-content" style="width: 60%"> 
            You've got: <br><p style="color: red">`+diseases[diseaseIndex]+`</p>
            <br> <p style="font-size: 14px; line-height: 30px;">
            The following choices lead you there:<br>`;
    
    for(var i=0; i<riskFactors.length; i++) {
        mc += riskFactors[i]+"<br>";
    }
            
    mc += ` </p><br><input type="button" value="Try Again?" class="in-modal"    
            onClick="reset()" > </div> `;
    modalElement.innerHTML = mc;
}

function naturalDeath() {
    modalTitle.innerHTML = "Dead";
    modalElement.style.display = "block";
    modalName.style.display = "none";
    var mc = 
        `<div class="modal-content" style="width: 60%">
            Congratulations <br>
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
    recieveAnswer(getDiseaseMods(questionIndex, newAnswer.value));
    
}

function recieveAnswer(tempMods) {
    for(var i=0; i<diseaseMods.length; i++) {
        diseaseMods[i] *= tempMods[2][i];
        if(diseaseMods[i] > Math.random()) kill(i);
    }
    
    var heartIndex = Math.floor(diseaseMods[1]*30);
    if(heartIndex < heartImages.length) heartIcon.src = heartImages[heartIndex];
    else heartIcon.src = heartImages[3];
    
    answerLog[questionIndex] = tempMods;
    console.log(questionIndex+" Risks: "+diseaseMods);
    nextQuestion();
}

function nextQuestion() {
    questionIndex++;
    if(questionIndex*ageMod >= maxAge) naturalDeath();
    ageElement.innerHTML = questionIndex * ageMod;
    playerPusher.style.paddingLeft = (questionIndex*7)+"%";
    playerIcon.src = playerImages[questionIndex];
    if(questionIndex*ageMod <= maxAge)
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

function getQandA(questionId) {
    const data = [
        ["Have your parents had heart disease or related illnesses? ",["1 parent over the age of 50 had heart disease", "1 parent under the age of 50 has had heart disease", "2 parents over the age of 50 has had heart disease", "2 parents have had heart disease, one over 50 one under 50", "2 parents have had heart disease, both under the age of 50", "My parents have no heart related illnesses"]],
        ["Do you walk at least 30 minutes each day at a moderate to vigirous pace?", ["Yes, I walk at least 30 minutes each day", "No, I do not walk at least 30 minutes each day"]],
        ["On average, do you drink more or less than 1 can of soda a day",["Yes, I often drink soda", "No, I rarely drink soda type drinks"]],
        ["Fast food is a common way to get a quick, delicious meal. How often to you consume fast food per week?",["I eat fast food four or more times a week", "I eat fast food two to three times a week", "I eat fast food around one time a week", "I do not eat fast food often"]],
        ["Cigarettes and Tobacco products are still apart of many peoples lives. How would you best describe your relationship with Cigarettes?",["I smoke more than one pack a day", "I smoke on occasion, less than one pack a week", "I dont smoke myself, but am often around it", "I dont smoke and am not often around it"]],
        ["How many portions of fruit and vegetables to do you eat per day?(1 portion is 80g or roughly two spears of broccoli, desert bowl of salad, two slices of watermelon, 1 apple)",["I eat more than five portions of fruits and vegetables a day", "I eat 4 portions of vegetables and fruits a day", "I eat 3 portions of vegetables and fruit a day", "I eat 2 portions of vegetables and fruits a day", "I eat less than one portion of vegetables and fruits a day"]],
        ["Around How many alcholic drinks do you have per week? ",["I have more than 15 drinks a week", "I have 1-14 drinks a week", "I have less than 1 drink a week"]],
        ["How physically active are you? This can include things like playing sports, going to the gym, or just running around outside",["I am physically active most days of the week", "I am not very physically active"]],
        ["What social and economic class are you in?",["Upper class", "Middle class", "Lower class"]],
        ["What is your favorite sitcom?",["Friends", "Seinfield", "Drake and Josh", "Malcolm in the Middle"]]        
    ]
    
    return data[questionId];

}

function getDiseaseMods(questionId, answerString) {
    
    console.log("Index and answer: ",questionId," : ",answerString);
    const data = [
        [0, "1 parent over the age of 50 had heart disease", [1, 1.67]],
        [0, "1 parent under the age of 50 has had heart disease", [1, 2.36]],
        [0, "2 parents over the age of 50 has had heart disease", [1, 2.9]],
        [0, "2 parents have had heart disease, one over 50 one under 50", [1, 3.26]],
        [0, "2 parents have had heart disease, both under the age of 50", [1, 6.56]],
        [0, "My parents have no heart related illnesses", [1, 1]],
        [1, "Yes, I walk at least 30 minutes each day", [1, 0.7]],
        [1, "No, I do not walk at least 30 minutes each day", [1, 1]],
        [2, "Yes, I often drink soda", [1, 1.5]],
        [2, "No, I rarely drink soda type drinks", [1, 1]],
        [3, "I eat fast food four or more times a week", [1, 1.8]],
        [3, "I eat fast food two to three times a week", [1, 1.5]],
        [3, "I eat fast food around one time a week", [1, 1.2]],
        [3, "I do not eat fast food often", [1, 1]],
        [4, "I smoke more than one pack a day", [1, 4]],
        [4, "I smoke on occasion, less than one pack a week", [1, 2]],
        [4, "I dont smoke myself, but am often around it", [1, 1.1147]],
        [4, "I dont smoke and am not often around it", [1, 1]],
        [5, "I eat more than five portions of fruits and vegetables a day", [1, 0.8]],
        [5, "I eat 4 portions of vegetables and fruits a day", [1, 0.84]],
        [5, "I eat 3 portions of vegetables and fruit a day", [1, 0.88]],
        [5, "I eat 2 portions of vegetables and fruits a day", [1, 0.92]],
        [5, "I eat less than one portion of vegetables and fruits a day", [1, 1]],
        [6, "I have more than 15 drinks a week", [1, 1.7]],
        [6, "I have 1-14 drinks a week", [1, 0.77]],
        [6, "I have less than 1 drink a week", [1, 1]],
        [7, "I am physically active most days of the week", [1, 0.55]],
        [7, "I am not very physically active", [1, 1]],
        [8, "Upper class", [1, 1]],
        [8, "Middle class", [1, 1]],
        [8, "Lower class", [1, 1.5]],
        [9, "Friends", [1, 1]],
        [9, "Seinfield", [1, 1]],
        [9, "Drake and Josh", [1, 1]],
        [9, "Malcolm in the Middle", [1, 1]]
    ];
    
    const row = data.filter(function (a){
        return a[0] == questionId && a[1] == answerString;
    });
    console.log("row: ",row);
    console.log("ret: ",row[0]);
    return row[0];
}