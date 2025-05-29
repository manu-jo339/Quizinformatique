let currentLevel = 1;
let questionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft;
let isAnswering = false;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timerEl = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const explanationEl = document.getElementById('explanation');
const finalScoreEl = document.getElementById('finalScore');
const finalResultEl = document.getElementById('finalResult');
const medalDisplay = document.getElementById('medalDisplay');
const bestScoreEl = document.getElementById('bestScore'); // nouveau élément pour afficher meilleur score

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const levelSound = document.getElementById('levelSound');

function startTimer() {
    timeLeft = 10;
    timerEl.textContent = `⏳ Temps restant: ${timeLeft}s`;
    progressBar.style.width = '100%';
    let progress = 100;
    timerInterval = setInterval(() => {
        timeLeft--;
        progress -= 10;
        timerEl.textContent = `⏳ Temps restant: ${timeLeft}s`;
        progressBar.style.width = `${progress}%`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            disableAnswers();
            explanationEl.textContent = `Temps écoulé! La bonne réponse était : ${getCurrentQuestion().correct}`;
            explanationEl.classList.add('visible');
            wrongSound.play();
            setTimeout(nextQuestion, 2000);
        }
    }, 1000);
}

function getCurrentQuestion() {
    return questions[currentLevel][questionIndex];
}

function showQuestion() {
    isAnswering = true;
    explanationEl.classList.remove('visible');
    explanationEl.textContent = "";
    levelDisplay.textContent = currentLevel;
    scoreDisplay.textContent = score;

    const currentQ = getCurrentQuestion();
    questionEl.textContent = currentQ.q;

    answersEl.innerHTML = '';
    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(option);
        answersEl.appendChild(btn);
    });

    startTimer();
}

function disableAnswers() {
    const buttons = answersEl.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        btn.style.opacity = '0.6';
    });
    isAnswering = false;
    clearInterval(timerInterval);
}

function selectAnswer(selected) {
    if (!isAnswering) return;
    disableAnswers();
    clearInterval(timerInterval);

    const currentQ = getCurrentQuestion();
    if (selected === currentQ.correct) {
        score += 10;
        scoreDisplay.textContent = score;
        explanationEl.textContent = "✅ Bonne réponse! " + currentQ.explanation;
        explanationEl.classList.add('visible');
        correctSound.play();
    } else {
        explanationEl.textContent = "❌ Mauvaise réponse! " + currentQ.explanation;
        explanationEl.classList.add('visible');
        wrongSound.play();
    }

    setTimeout(nextQuestion, 2000);
}

function showLevelComplete() {
    // Cacher questions et réponses
    document.querySelector('.question-box').style.display = 'none';
    timerEl.style.display = 'none';
    progressBar.style.width = '0%';

    // Afficher message de niveau terminé
    explanationEl.textContent = `🎉 Niveau ${currentLevel - 1} terminé ! Prépare-toi pour le niveau ${currentLevel}...`;
    explanationEl.classList.add('visible');

    levelSound.play();

    // Après 2 secondes, reprendre quiz
    setTimeout(() => {
        explanationEl.classList.remove('visible');
        document.querySelector('.question-box').style.display = 'block';
        timerEl.style.display = 'block';
        showQuestion();
    }, 2000);
}

function endQuiz() {
    clearInterval(timerInterval);
    document.querySelector('.question-box').style.display = 'none';
    timerEl.style.display = 'none';
    progressBar.style.width = '0%';
    finalScoreEl.style.display = 'block';
    finalResultEl.textContent = score;

    // Sauvegarde et affichage du meilleur score
    let bestScore = localStorage.getItem('bestScore') || 0;
    bestScore = parseInt(bestScore);
    if (score > bestScore) {
        localStorage.setItem('bestScore', score);
        bestScore = score;
    }
    bestScoreEl.textContent = `Meilleur score: ${bestScore}`;

    // Afficher médaille selon score (exemple simple)
    if (score >= 150) medalDisplay.textContent = "🏅 Médaillé d'or";
    else if (score >= 100) medalDisplay.textContent = "🥈 Médaillé d'argent";
    else if (score >= 50) medalDisplay.textContent = "🥉 Médaillé de bronze";
    else medalDisplay.textContent = "🛡️ Continue à t'entraîner!";

    answersEl.innerHTML = "";
    questionEl.textContent = "Merci d'avoir joué!";
}

function nextQuestion() {
    questionIndex++;
    if (questionIndex >= questions[currentLevel].length) {
        currentLevel++;
        if (currentLevel > 20) {
            // Fin du quiz
            endQuiz();
            return;
        } else if (!questions[currentLevel]) {
            // Pas de questions chargées pour ce niveau, fin du quiz aussi
            endQuiz();
            return;
        }
        questionIndex = 0;

        // Ajout de transition entre niveaux
        showLevelComplete();
        return;
    }
    showQuestion();
}

function restartGame() {
    currentLevel = 1;
    questionIndex = 0;
    score = 0;
    finalScoreEl.style.display = 'none';
    explanationEl.classList.remove('visible');
    document.querySelector('.question-box').style.display = 'block';
    timerEl.style.display = 'block';
    showQuestion();
}

// Démarrer quiz au chargement
window.onload = () => {
    showQuestion();
};
document.getElementById('restartBtn').addEventListener('click', () => {
    restartGame();
});
function endGame() {
    document.getElementById("quiz").style.display = "none"; // Cache le quiz
    document.getElementById("finalScore").style.display = "block"; // Affiche le score
  
    const playerName = document.getElementById("name").value || "Joueur";
    const finalScore = score;
  
    document.getElementById("playerNameDisplay").textContent = playerName;
    document.getElementById("scoreDisplay").textContent = finalScore + " / " + questions.length;
  }
  function shareScore() {
    const playerName = document.getElementById("playerNameDisplay").textContent;
    const scoreText = document.getElementById("scoreDisplay").textContent;
    const text = `Je suis ${playerName} et j'ai obtenu un score de ${scoreText} sur le quiz santé ! 💪`;
  
    const shareURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareURL, '_blank');
  }
    
