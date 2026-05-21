// ================= WORKOUT DATA =================

const workouts = [

    {
        category:"chest",
        title:"Bench Press",
        image:"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1974",
        video:"videos/bench_press.mp4",
        description:"Build chest strength effectively.",
        difficulty:"Intermediate"
    },

    {
        category:"back",
        title:"Pull Ups",
        image:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1974",
        video:"videos/pull_ups.mp4",
        description:"Improve back and arm muscles.",
        difficulty:"Advanced"
    },

    {
        category:"legs",
        title:"Squats",
        image:"https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=2070",
        video:"videos/squats.mp4",
        description:"Powerful leg strengthening workout.",
        difficulty:"Beginner"
    },

    {
        category:"cardio",
        title:"Treadmill Running",
        image:"https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=2070",
        video:"videos/treadmill.mp4",
        description:"Burn calories with cardio sessions.",
        difficulty:"Easy"
    }

];

// ================= DISPLAY WORKOUTS =================

const workoutContainer =
document.getElementById("workoutContainer");

function displayWorkouts(category){

    if(!workoutContainer){

        return;

    }

    workoutContainer.innerHTML = "";

    const filteredWorkouts =
    category === "all"
    ? workouts
    : workouts.filter(
        workout => workout.category === category
    );

    filteredWorkouts.forEach(workout => {

        workoutContainer.innerHTML += `

        <div class="workout-card" onclick="playVideo(this)" style="cursor: pointer;">

            <img src="${workout.image}" alt="${workout.title}" style="width: 100%; height: 200px; border-radius: 15px 15px 0 0; object-fit: cover;" loading="lazy">
            <video src="${workout.video}" style="display:none; width: 100%; height: 200px; border-radius: 15px 15px 0 0; object-fit: cover; background: #000;" controls muted></video>

            <div class="workout-content">

                <h3>${workout.title}</h3>

                <p>${workout.description}</p>

                <span class="badge">
                    ${workout.difficulty}
                </span>

            </div>

        </div>

        `;

    });

}

if(workoutContainer){

    displayWorkouts("all");

}

function playVideo(cardElement) {
    const img = cardElement.querySelector('img');
    const vid = cardElement.querySelector('video');
    
    if(img && vid) {
        if(img.style.display !== 'none') {
            // Play video
            img.style.display = 'none';
            vid.style.display = 'block';
            vid.play();
        } else {
            // Pause video and return to image
            vid.pause();
            vid.style.display = 'none';
            img.style.display = 'block';
        }
    }
}

// ================= CATEGORY BUTTONS =================

const categoryButtons =
document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click",()=>{

        const activeButton =
        document.querySelector(".category-btn.active");

        if(activeButton){

            activeButton.classList.remove("active");

        }

        button.classList.add("active");

        const category =
        button.dataset.category;

        displayWorkouts(category);

    });

});

// ================= TIMER =================

let timerInterval = null;
let isRunning = false;
let currentSeconds = 30;
let totalDuration = 30;
let currentMode = "standard"; // standard, custom, tabata, hiit
let currentPhase = "work";    // work, rest
let soundOn = true;

// SVG properties
const circleRadius = 95;
const circumference = 2 * Math.PI * circleRadius; // ~596.9

// DOM Elements
const timerDisplay = document.getElementById("timer");
const timerCircle = document.getElementById("timerCircle");
const timerPhase = document.getElementById("timerPhase");
const timerPlus = document.getElementById("timerPlus");
const timerMinus = document.getElementById("timerMinus");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const soundToggle = document.getElementById("soundToggle");
const presetBtns = document.querySelectorAll(".preset-btn");

// Init SVG circle
if (timerCircle) {
    timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    timerCircle.style.strokeDashoffset = 0;
}

// Audio Synthesizer (Retro Web Audio API Beeps)
let audioCtx = null;
function playBeep(frequency, duration) {
    if (!soundOn) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume if suspended by browser autoplay policy
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration - 0.02);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Silent catch for browsers restricting audio context
    }
}

// Update DOM Visuals
function updateTimerDisplay() {
    if (!timerDisplay) return;

    const minutes = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
    const seconds = (currentSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;

    // Update Circle Progress
    if (timerCircle) {
        const offset = circumference - (currentSeconds / totalDuration) * circumference;
        timerCircle.style.strokeDashoffset = isNaN(offset) ? 0 : offset;
        
        // Colors: WORK phase is warm red/orange. REST phase is cool green/cyan.
        if (currentMode === "tabata" || currentMode === "hiit") {
            if (currentPhase === "work") {
                timerCircle.style.stroke = "#f97316"; // Orange
                if (timerPhase) timerPhase.textContent = "WORK ⚡";
            } else {
                timerCircle.style.stroke = "#10b981"; // Emerald Green
                if (timerPhase) timerPhase.textContent = "REST 🥤";
            }
        } else {
            timerCircle.style.stroke = "var(--accent-vibrant-2)"; // Cyan/Blue
            if (timerPhase) timerPhase.textContent = isRunning ? "CRUSH IT!" : "READY";
        }
    }
}

// Sound Cues logic
function playSoundCues() {
    if (currentSeconds > 0 && currentSeconds <= 3) {
        playBeep(440, 0.15); // Low beep (A4)
    } else if (currentSeconds === 0) {
        playBeep(880, 0.4);  // High double-frequency beep (A5)
    }
}

// Interval Logic
function tick() {
    if (currentSeconds > 0) {
        currentSeconds--;
        updateTimerDisplay();
        playSoundCues();
    } else {
        // Phase completion or final timer finish
        if (currentMode === "tabata" || currentMode === "hiit") {
            // Swap phases
            if (currentPhase === "work") {
                currentPhase = "rest";
                currentSeconds = currentMode === "tabata" ? 10 : 20;
                totalDuration = currentSeconds;
            } else {
                currentPhase = "work";
                currentSeconds = currentMode === "tabata" ? 20 : 40;
                totalDuration = currentSeconds;
            }
            updateTimerDisplay();
            playBeep(600, 0.3);
        } else {
            // Standard timer finished
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            if (timerPhase) timerPhase.textContent = "DONE 🎉";
            playBeep(880, 0.4);
            setTimeout(() => playBeep(880, 0.3), 150);
        }
    }
}

// Core Controls
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    updateTimerDisplay();
    // Warm-up beep
    playBeep(523.25, 0.1); 
    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    updateTimerDisplay();
}

function resetTimer() {
    pauseTimer();
    currentPhase = "work";
    
    if (currentMode === "tabata") {
        currentSeconds = 20;
        totalDuration = 20;
    } else if (currentMode === "hiit") {
        currentSeconds = 40;
        totalDuration = 40;
    } else {
        // Fallback to active preset or default
        const activePreset = document.querySelector(".preset-btn.active");
        if (activePreset && activePreset.dataset.seconds) {
            currentSeconds = parseInt(activePreset.dataset.seconds);
            totalDuration = currentSeconds;
        } else {
            currentSeconds = 30;
            totalDuration = 30;
        }
    }
    updateTimerDisplay();
}

// Attach Event Listeners
if (startBtn) startBtn.addEventListener("click", startTimer);
if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);

// Custom adjustments (+ / -)
if (timerPlus) {
    timerPlus.addEventListener("click", () => {
        if (isRunning) return;
        currentMode = "custom";
        // Remove active flags from preset buttons
        presetBtns.forEach(btn => btn.classList.remove("active"));
        currentSeconds = Math.min(currentSeconds + 5, 600); // 10 min cap
        totalDuration = currentSeconds;
        updateTimerDisplay();
    });
}

if (timerMinus) {
    timerMinus.addEventListener("click", () => {
        if (isRunning) return;
        currentMode = "custom";
        presetBtns.forEach(btn => btn.classList.remove("active"));
        currentSeconds = Math.max(currentSeconds - 5, 5); // 5s min
        totalDuration = currentSeconds;
        updateTimerDisplay();
    });
}

// Presets Selection
presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (isRunning) pauseTimer();
        
        presetBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const seconds = btn.dataset.seconds;
        const mode = btn.dataset.mode;
        
        if (seconds) {
            currentMode = "standard";
            currentSeconds = parseInt(seconds);
            totalDuration = currentSeconds;
        } else if (mode) {
            currentMode = mode;
            currentPhase = "work";
            currentSeconds = mode === "tabata" ? 20 : 40;
            totalDuration = currentSeconds;
        }
        
        updateTimerDisplay();
    });
});

// Sound Toggle Control
if (soundToggle) {
    soundToggle.addEventListener("click", () => {
        soundOn = !soundOn;
        if (soundOn) {
            soundToggle.innerHTML = '<i class="ph-fill ph-speaker-high"></i> Sound On';
            // Brief validation beep
            playBeep(440, 0.1);
        } else {
            soundToggle.innerHTML = '<i class="ph-fill ph-speaker-slash"></i> Muted';
        }
    });
}

// Initial draw
updateTimerDisplay();
