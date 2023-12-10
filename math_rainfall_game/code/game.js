//getting elements

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const lifeElement = document.getElementById('life');
const startButton = document.getElementById('startButton');
const exitButton = document.getElementById('exitButton');
const pupilButton = document.getElementById('level_pupil');
const studentButton = document.getElementById('level_student');
const professorButton = document.getElementById('level_professor');
const myScoreHelp= document.getElementById('score_help');
const myScoreInfo= document.querySelectorAll('.score_info');
const myBasket = document.getElementById('basket');
const myContainer = document.getElementById('container');
const startContainer = document.getElementById('startContainer');
const myResult = document.getElementById('resultEnd');
const squareElement = document.querySelectorAll(".square");
const hearsContainer = document.getElementById("hearts-container");
const levelTable = document.getElementById("level_table");


//sound

const correctAudio=new Audio("../sound/correct_sound.mp3");
const wrongAudio=new Audio("../sound/wrong_sound.mp3");
const soundTrack=new Audio("../sound/soundtrack.mp3");
correctAudio.volume=0.5;
wrongAudio.volume=0.6;
soundTrack.volume=0.2;

const square1 = document.getElementById('square1');
const square2 = document.getElementById('square2');
const square3 = document.getElementById('square3');

//declaring variables in game

let score=0;
let life=3;
let cur_pos=0;


//starting game

startButton.addEventListener('click', choose_level);

exitButton.addEventListener("click", function() {
    window.close();
});

pupilButton.addEventListener('click', function() {
    level=0;
    animationSpeed = 0.7;
    startGame()
});

studentButton.addEventListener('click', function() {
    level=30;
    animationSpeed = 1.05;
    startGame()
});

professorButton.addEventListener('click', function() {
    level=60;
    animationSpeed = 1.2;
    startGame()
});

function choose_level(){
    startContainer.style.display='none';
    levelTable.style.display='table';
    myResult.style.display='none';
}

function startGame() {
    levelTable.style.display='none';
    soundTrack.play();
    resultElement.textContent = `Score: ${score} |`;
    // lifeElement.textContent = `Life: ${life}`;
    add_hearts();
    generateQuestion();

    //starting style
    myBasket.style.display='block'
    myScoreHelp.style.display = 'block';
    squareElement.forEach(el => el.style.display='flex');
    console.log(square1.style.zIndex, myScoreHelp.style.zIndex);
}

//generating questions

function generateQuestion() {
    //animation speed
    animationSpeed=animationSpeed+0.03;
    level=level+1;
    cur_pos=0;

    //random equation and answers
    const num1 = Math.floor(Math.random() * (10+level)) + 1;
    const num2 = Math.floor(Math.random() * (10+level)) + 1;
    var operator
    var correctAnswer
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            operator = '+';
            correctAnswer=num1 + num2;
            break;
        case 1:
            operator='-';
            correctAnswer=num1 - num2;
            break;
        case 2:
            operator='*';
            correctAnswer=num1 * num2;
            break;
    }
    currentQuestion = {
        num1: num1,
        num2: num2,
        operator: operator,
        correctAnswer: correctAnswer
    };

    const wrongAnswers = generateWrongAnswers(correctAnswer);
    questionElement.textContent = `Question: ${num1} ${operator} ${num2} = ?`;
    const options = [correctAnswer, ...wrongAnswers];
    shuffleArray(options);
    square1.textContent=options[0]
    square2.textContent=options[1]
    square3.textContent=options[2]

    //falling squares(circles) function
    function animateFalling(){
        if (cur_pos>=window.innerHeight-30){
            cur_pos=0;
        }
        if (cur_pos>=80 && cur_pos<=90){
            myScoreHelp.style.background="#1411c7";
        }
        cur_pos+=1*animationSpeed;
        square1.style.top=cur_pos+"px";
        square2.style.top=cur_pos+"px";
        square3.style.top=cur_pos+"px";
        var squareRect1=square1.getBoundingClientRect();
        var basketRect=myBasket.getBoundingClientRect();

        //function to detect catching by basket
        function catching(square){
            var squareRect=square.getBoundingClientRect();
            if (squareRect.bottom>basketRect.top+40 && ((squareRect.left <= basketRect.right && squareRect.left >= basketRect.left) || (squareRect.right<= basketRect.right && squareRect.right >= basketRect.left))){
                checkAnswer(square.textContent, currentQuestion.correctAnswer)
                // console.log(squareRect.left, squareRect.right, basketRect.left, basketRect.right)
                // console.log(square.textContent, currentQuestion.correctAnswer)
                cancelAnimationFrame(animationId)
                if (life>0){
                    generateQuestion();
                } else {
                    stop_the_game()
                }
            }
        }

        //checking catching
        if (catching(square1)){
        } else if (catching(square2)){
        } else if (catching(square3)){
        } else if (squareRect1.bottom>window.innerHeight-50) {
            life-=1
            myScoreHelp.style.background="#c72611";
            wrongAudio.play();
            remove_heart();
            cancelAnimationFrame(animationId)
            if (life>0){
                generateQuestion();
            } else {
                stop_the_game()
            }
        }
        animationId = requestAnimationFrame(animateFalling);
    }
    animationId = requestAnimationFrame(animateFalling);
}

//generating wrong answers
function generateWrongAnswers(correctAnswer) {
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 2) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 30) - 2;
        if (wrongAnswer !== correctAnswer) {
            wrongAnswers.add(wrongAnswer);
        }
    }
    return Array.from(wrongAnswers);
}

//chceking if caught answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer == correctAnswer) {
        score+=1;
        myScoreHelp.style.background="#0cce16";
        correctAudio.play();
        console.log("score")
    } else {
        life-=1;
        myScoreHelp.style.background="#c72611";
        wrongAudio.play();
        remove_heart();
        console.log("life")
    }
    resultElement.textContent = `Score: ${score} |`;
    // lifeElement.textContent = `Life: ${life}`;
}

//shuffling array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//stopping the game
function stop_the_game() {
    cancelAnimationFrame(animationId);
    square1.style.display='none';
    square2.style.display='none';
    square3.style.display='none';
    myScoreHelp.style.display='none';
    myScoreHelp.style.background="#1411c7"
    myResult.textContent = `Score: ${score}`;
    myResult.style.display='flex';
    myBasket.style.display='none';

    //restarting the game
    startContainer.style.display='flex';
    startButton.style.display='inline-block';
    startButton.textContent='Restart';
    startButton.style.width= '15%';
    exitButton.style.display='inline-block';
    soundTrack.pause();
    soundTrack.currentTime = 0;

    score=0;
    life=3;
    cur_pos=0;

}

//hearts functionality

function remove_heart() {
    const myHearts = document.querySelectorAll(".heart");
    if (myHearts.length > 0) {
        hearsContainer.removeChild(myHearts[myHearts.length - 1]);
      }
    
}

function add_hearts() {
    for (let i = 0; i < 3; i++) {
        const newHeart = document.createElement("img");
        newHeart.src = "../images/heart.png";
        newHeart.className = "heart";
        hearsContainer.appendChild(newHeart);
    }
}