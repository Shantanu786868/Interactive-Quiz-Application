// Database of questions categorized by tab
const quizData = {
    "General Tech": [
        { question: "What does CPU stand for?", answers: [{ text: "Central Process Unit", correct: false }, { text: "Computer Personal Unit", correct: false }, { text: "Central Processing Unit", correct: true }, { text: "Central Processor Unit", correct: false }] },
        { question: "Who is known as the father of computers?", answers: [{ text: "Alan Turing", correct: false }, { text: "Charles Babbage", correct: true }, { text: "Steve Jobs", correct: false }, { text: "Bill Gates", correct: false }] }
    ],
    "Coding": [
        { question: "Which HTML tag is used for internal CSS?", answers: [{ text: "<script>", correct: false }, { text: "<style>", correct: true }, { text: "<css>", correct: false }, { text: "<design>", correct: false }] },
        { question: "Which of these is NOT a JS framework?", answers: [{ text: "React", correct: false }, { text: "Django", correct: true }, { text: "Vue", correct: false }, { text: "Angular", correct: false }] }
    ],
    "Design": [
        { question: "What does UX stand for?", answers: [{ text: "User Experience", correct: true }, { text: "User Example", correct: false }, { text: "Universal Experience", correct: false }, { text: "User Execution", correct: false }] },
        { question: "Which color model is used for digital screens?", answers: [{ text: "CMYK", correct: false }, { text: "RGB", correct: true }, { text: "Pantone", correct: false }, { text: "HEX", correct: false }] }
    ]
};

// Quiz Elements
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const trackerElement = document.getElementById("question-tracker");
const timerElement = document.getElementById("timer");
const tabs = document.querySelectorAll(".tab");

let currentCategory = "General Tech";
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// Modal Elements
const modal = document.getElementById("login-modal");
const openModalBtn = document.getElementById("open-login-btn");
const closeModalBtn = document.getElementById("close-login-btn");

// --- MODAL LOGIC ---
openModalBtn.addEventListener("click", () => modal.style.display = "flex");
closeModalBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// --- TAB SWITCHING LOGIC ---
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active class from all tabs, add to clicked
        tabs.forEach(t => t.classList.remove("active-tab"));
        tab.classList.add("active-tab");
        
        // Update category and restart quiz
        currentCategory = tab.getAttribute("data-category");
        startQuiz();
    });
});

// --- QUIZ LOGIC ---
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next Question";
    showQuestion();
}

function startTimer() {
    timeLeft = 15;
    timerElement.innerText = `⏱️ ${timeLeft}s`;
    timerElement.style.color = "#e53e3e"; // reset color
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `⏱️ ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function showQuestion() {
    resetState();
    let questions = quizData[currentCategory];
    let currentQuestion = questions[currentQuestionIndex];
    
    trackerElement.innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    startTimer();
}

function resetState() {
    nextButton.style.display = "none";
    clearInterval(timer);
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    clearInterval(timer); // stop timer on click
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("incorrect");
    }
    revealCorrectAnswer();
}

function handleTimeOut() {
    timerElement.innerText = "⏱️ Time's up!";
    revealCorrectAnswer();
}

function revealCorrectAnswer() {
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true; // Disable all buttons
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    trackerElement.innerText = "Quiz Complete";
    timerElement.innerText = "";
    questionElement.innerHTML = `You scored ${score} out of ${quizData[currentCategory].length} in ${currentCategory}!`;
    nextButton.innerHTML = "Restart Category";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    let questions = quizData[currentCategory];
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        if (nextButton.innerHTML === "Restart Category") {
            startQuiz();
        } else {
            showScore();
        }
    }
});

// Initialize first run
startQuiz();