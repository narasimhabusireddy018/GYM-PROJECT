// ================= COUNTER ANIMATION =================

function counter(id, start, end, duration) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const range = end - start;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + range * progress);

        element.textContent = current.toLocaleString() + "+";

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

document.addEventListener("DOMContentLoaded", () => {
    let totalMembers = 0;
    let totalWorkouts = 0;
    let totalCalories = 0;

    if (typeof db !== "undefined" && db.users) {
        const usersList = Object.values(db.users);
        totalMembers = usersList.length;
        
        usersList.forEach(user => {
            if (user.stats) {
                totalCalories += (user.stats.caloriesBurned || 0);
                totalWorkouts += (user.stats.workoutsCompleted || 0) || Math.floor((user.stats.workoutTime || 0) / 15) || (user.stats.workoutTime ? 1 : 0);
            }
        });
    }

    counter("members", 0, totalMembers, 1500);
    counter("workouts", 0, totalWorkouts, 1500);
    counter("calories", 0, totalCalories, 1500);
});
