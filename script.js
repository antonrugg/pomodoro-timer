const circle = document.querySelector('#circleTimer');
const needle = document.querySelector('.needle');
const workTimer = document.querySelector('#workTimer');
const breakTimer = document.querySelector('#breakTimer');
const controlBtn = document.querySelector('#controlBtn');
const addTimeBtn = document.querySelector('#addTimeBtn');

//Inizializzazione cerchi 
const radius = 50;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

//Costanti
const workSeconds = 1500;
const breakSeconds = 300;
const increment = 60;
//Inizializzazione timer e variabili
let timer;
let currentSeconds = workSeconds;
let isPaused = true;
let inWorkPhase = true;
let currentTimer = workTimer;
let currentTotal = workSeconds;

updateTimer(workTimer, workSeconds);
updateTimer(breakTimer, breakSeconds);

//Funzione per impostare il tempo nei timer html
//total = 90 
function updateTimer(element, total) {
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    element.textContent = `${minutes}:${formattedSeconds}`;
}

//Imposta offset cerchio e rotazione del braccio
function setProgress(percentage) {
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    const rotation = (percentage / 100) * 360;
    needle.style.transform = `rotate(${rotation}deg)`;
}


//Funzione che decrementa i secondi di 1
// Gestisce anche il cambio fase da work a break ad eventuale reset finale 
function decrement() {
    if (isPaused) {
        return;
    }
    currentSeconds--; //toglie 1
    updateTimer(currentTimer, currentSeconds);

    const percentage = Math.ceil(((currentTotal - currentSeconds) / currentTotal) * 100);
    setProgress(percentage);


    if (currentSeconds === 0) {
        clearInterval(timer);

        if (inWorkPhase) {
            //siamo nella fase di pausa
            inWorkPhasefalse = false;
            currentSeconds = breakSeconds;
            currentTimer = breakTimer
            document.body.classList.add('break-phase');
            workTimer.classList.remove('timer--active');
            breakTimer.classList.add('timer--active');

            timer = setInterval(decrement, 1000);
        } else {
            controBtn.classList.remove('control-btn--pause');
            controlBtn.setAttribute('disable', 'disabled');
            addTimeBtn.setAttribute('disable', 'disabled');
        }
        
    }
}

controlBtn.addEventListener('click', function () {
    isPaused = !isPaused;

    if (!isPaused){
        controlBtn.classList.add('control-btn--pause');
    } else {
        controlBtn.classList.remove('contro-btn--pause');
    }

    if (!timer) { //eseguito solo la prima volta
        addTimeBtn.removeAttribute('disabled');
        timer = setInterval(decrement, 1000);
    }

});


addTimeBtn.addEventListener('click', function () {
    currentSeconds += increment;
    currentTotal += increment;
    updateTimer(currentTimer, currentSeconds); 
});