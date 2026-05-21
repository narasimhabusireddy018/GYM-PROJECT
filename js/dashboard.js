// ===== DASHBOARD DATA & STATE =====

let dashboardData = {};

function loadUserData() {
    const user = db.getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return false;
    }

    dashboardData = {
        user: user.username,
        calories: user.stats.caloriesBurned,
        workoutTime: user.stats.workoutTime,
        water: user.stats.water,
        streak: user.stats.streak,
        bmi: "--", // Could be dynamic if we added a profile form
        weight: "--"
    };

    // Update sidebar profile name
    const profileName = document.querySelector('.profile-name');
    if(profileName) profileName.textContent = user.username;
    
    return true;
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    if(!loadUserData()) return; // Stop initialization if not logged in
    
    updateGreeting();
    updateDate();
    updateHeroStats();
    updateStatCards();
    initChart();
    updateWaterTracker();
    setupEventListeners();
});

// ===== GREETING =====

function updateGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let timeGreeting = "Good Evening";
        let icon = "🌙";

        if (hour >= 5 && hour < 12) {
            timeGreeting = "Good Morning";
            icon = "☀️";
        } else if (hour >= 12 && hour < 18) {
            timeGreeting = "Good Afternoon";
            icon = "⛅";
        }

        greetingEl.textContent = `${timeGreeting}, ${dashboardData.user} ${icon}`;
    }
}

// ===== DATE =====

function updateDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        dateEl.textContent = today;
    }
}

// ===== HERO STATS =====

function updateHeroStats() {
    document.getElementById('heroCals').textContent = dashboardData.calories;
    document.getElementById('heroStreak').textContent = dashboardData.streak;
    document.getElementById('heroBMI').textContent = dashboardData.bmi;
    document.getElementById('heroWeight').textContent = dashboardData.weight;
}

// ===== STAT CARDS =====

function updateStatCards() {
    // Update Text
    document.getElementById('statCals').textContent = dashboardData.calories || 0;
    document.getElementById('statTime').textContent = (dashboardData.workoutTime || 0) + ' min';
    document.getElementById('statWater').textContent = (dashboardData.water || 0) + '/8';
    document.getElementById('statStreak').textContent = (dashboardData.streak || 0) + ' days';

    // Update Progress Bars
    const calsProgress = document.getElementById('calsProgress');
    if(calsProgress) {
        // Assume daily goal is 2000 cals
        const pct = Math.min(((dashboardData.calories || 0) / 2000) * 100, 100);
        calsProgress.style.width = `${pct}%`;
    }

    const timeProgress = document.getElementById('timeProgress');
    if(timeProgress) {
        // Assume daily goal is 60 mins
        const pct = Math.min(((dashboardData.workoutTime || 0) / 60) * 100, 100);
        timeProgress.style.width = `${pct}%`;
    }

    const streakProgress = document.getElementById('streakProgress');
    if(streakProgress) {
        // 7 day streak goal
        const pct = Math.min(((dashboardData.streak || 0) / 7) * 100, 100);
        streakProgress.style.width = `${pct}%`;
    }
}

// ===== CHART =====

let progressChart = null;

function initChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Calories Burned',
                data: [650, 720, 800, 750, 900, 850, 920],
                borderColor: '#CBD5E1',
                backgroundColor: 'rgba(203, 213, 225, 0.1)',
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#CBD5E1',
                pointBorderColor: '#CBD5E1',
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                    titleColor: '#CBD5E1',
                    bodyColor: '#ffffff',
                    borderColor: '#CBD5E1',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return context.parsed.y + ' kcal';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// ===== WATER TRACKER =====

function updateWaterTracker() {
    const waterValue = document.getElementById('waterValue');
    if (waterValue) {
        waterValue.textContent = dashboardData.water;
    }

    const waterProgress = document.getElementById('waterProgress');
    if (waterProgress) {
        const percentage = Math.min((dashboardData.water / 8) * 100, 100);
        waterProgress.style.width = `${percentage}%`;
    }

    const statWater = document.getElementById('statWater');
    if (statWater) statWater.textContent = dashboardData.water + '/8';
}

// ===== EVENT LISTENERS =====

function setupEventListeners() {
    // Workout Start Buttons
    const startBtns = document.querySelectorAll('.workout-btn');
    startBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'workouts.html';
        });
    });

    // Add Water
    const addWaterBtn = document.getElementById('addWaterBtn');
    if (addWaterBtn) {
        addWaterBtn.addEventListener('click', () => {
            const newWater = db.addWater();
            if(newWater !== null) {
                dashboardData.water = newWater;
                updateWaterTracker();
                updateStatCards();
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            db.logout();
            window.location.href = 'login.html';
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
        });
    }
}

// ===== SIDEBAR TOGGLE (MOBILE) =====

const sidebar = document.querySelector('.sidebar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if(!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

if (window.innerWidth < 768) {
    const navItems = document.querySelectorAll('.nav-item');
    if(sidebar) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        });
    }
}

// ================= ZEN FOCUS MODE =================

const openFocusBtn = document.getElementById('openFocusBtn');
const closeFocusBtn = document.getElementById('closeFocusBtn');
const focusOverlay = document.getElementById('focusOverlay');

if (openFocusBtn && closeFocusBtn && focusOverlay) {
    openFocusBtn.addEventListener('click', () => {
        focusOverlay.classList.add('active');
    });

    closeFocusBtn.addEventListener('click', () => {
        focusOverlay.classList.remove('active');
    });
}

// Focus Timer Logic
const focusStartBtn = document.getElementById('focusStartBtn');
const focusPauseBtn = document.getElementById('focusPauseBtn');
const focusResetBtn = document.getElementById('focusResetBtn');
const focusTimeDisplay = document.getElementById('focusTimeDisplay');
const focusTimerCircle = document.getElementById('focusTimerCircle');

let focusDuration = 45 * 60; // 45 minutes
let focusTimeLeft = focusDuration;
let focusTimerInterval = null;

// SVG Circle properties
const focusRadius = 90;
const focusCircumference = 2 * Math.PI * focusRadius;

if (focusTimerCircle) {
    focusTimerCircle.style.strokeDasharray = `${focusCircumference} ${focusCircumference}`;
    focusTimerCircle.style.strokeDashoffset = 0;
}

function updateFocusDisplay() {
    const minutes = Math.floor(focusTimeLeft / 60).toString().padStart(2, '0');
    const seconds = (focusTimeLeft % 60).toString().padStart(2, '0');
    if (focusTimeDisplay) focusTimeDisplay.textContent = `${minutes}:${seconds}`;

    if (focusTimerCircle) {
        const offset = focusCircumference - (focusTimeLeft / focusDuration) * focusCircumference;
        focusTimerCircle.style.strokeDashoffset = offset;
    }
}

function startFocusTimer() {
    if (focusTimerInterval) return;
    focusTimerInterval = setInterval(() => {
        if (focusTimeLeft > 0) {
            focusTimeLeft--;
            updateFocusDisplay();
        } else {
            clearInterval(focusTimerInterval);
            focusTimerInterval = null;
            
            // Log Workout to DB
            const minutes = Math.floor(focusDuration / 60);
            const calories = minutes * 12; // 12 cals per min intense focus
            const updatedStats = db.logWorkout(minutes, calories);
            
            if (updatedStats) {
                dashboardData.workoutTime = updatedStats.workoutTime;
                dashboardData.calories = updatedStats.caloriesBurned;
                updateStatCards();
                updateHeroStats();
            }

            alert(`Focus Session Complete! 🎉\nYou crushed ${minutes} minutes and burned ${calories} calories!`);
        }
    }, 1000);
}

function pauseFocusTimer() {
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
}

function resetFocusTimer() {
    pauseFocusTimer();
    focusTimeLeft = focusDuration;
    updateFocusDisplay();
}

if (focusStartBtn) focusStartBtn.addEventListener('click', startFocusTimer);
if (focusPauseBtn) focusPauseBtn.addEventListener('click', pauseFocusTimer);
if (focusResetBtn) focusResetBtn.addEventListener('click', resetFocusTimer);
