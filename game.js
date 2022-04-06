const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

const loader = document.getElementById("loader");
const game = document.getElementById("game");
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");


let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then(res => {
    return res.json();
})
.then(loadedQuestions => {
  //  console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question : loadedQuestion.question
        }

        const answeredChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answeredChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice
        })
        return formattedQuestion;
    })
    
    
    startGame();
})


const CORRECT_BONUS = 10;
const MAX_Questions = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
  //  console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

getNewQuestion = () => {    
    if(availableQuestions.length === 0 || questionCounter 
        >= MAX_Questions ) {
            localStorage.setItem("mostRecentScore", score)
            // go to end page
            return  window.location.assign("./end.html");  
        }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_Questions}`;
    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_Questions) * 100}%`;

    const questionIndex =  Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText  = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        
        const classToApply = selectedAnswer == parseInt(currentQuestion.answer) ? "correct" : "incorrect";
        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }
        selectedChoice.parentElement.classList.add(classToApply);
        

        setTimeout(()=> {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
        
    });
});


incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
