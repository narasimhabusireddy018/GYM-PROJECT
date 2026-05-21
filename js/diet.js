// ================= DIET JS =================

const generateBtn = document.getElementById("generateBtn");
const resultsWrapper = document.getElementById("resultsWrapper");

if(generateBtn){
    generateBtn.addEventListener("click", () => {
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const goal = document.getElementById("goal").value;

        // VALIDATION
        if(!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0 || !goal) {
            alert("Please fill all details correctly.");
            return;
        }

        // SHOW LOADING SIMULATION
        const originalBtnHtml = generateBtn.innerHTML;
        generateBtn.innerHTML = `<i class="ph ph-spinner spinner" style="display:inline-block;"></i> Calculating Plan...`;
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.7";
        resultsWrapper.classList.remove("show");

        // Simulate Calculation
        setTimeout(() => {
            generateBtn.innerHTML = originalBtnHtml;
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
            
            calculateAndShowResults(weight, height, goal);
            
            // Fade in results
            resultsWrapper.classList.add("show");
            
            // Scroll smoothly to results
            resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }, 1500); // 1.5 seconds loading
    });
}

function calculateAndShowResults(weight, height, goal) {
    // ================= BMI =================
    const heightInMeters = height / 100;
    const finalBmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    animateValue("bmiResult", 0, finalBmi, 1000, false);

    // ================= CALORIES (Mifflin-St Jeor Equation) =================
    // Assuming average age 25 and male for this calculation
    const bmr = (10 * weight) + (6.25 * height) - (5 * 25) + 5;
    const tdee = bmr * 1.55; // Moderate exercise multiplier

    let finalCalories = tdee;
    if(goal === "lose") finalCalories = tdee - 500;
    else if(goal === "gain") finalCalories = tdee + 500;
    
    animateValue("calorieResult", 0, finalCalories, 1200, true, " <span style='font-size:16px; color:var(--text-secondary);'>kcal</span>");

    // ================= WATER =================
    // Realistic water requirement based on weight and activity
    const finalWater = parseFloat((weight * 0.04).toFixed(1));
    animateValue("waterResult", 0, finalWater, 1000, false, " <span style='font-size:16px; color:var(--text-secondary);'>L</span>");

    // ================= PROTEIN =================
    let proteinMultiplier = 1.6;
    if(goal === "lose") proteinMultiplier = 2.2; // Higher protein to preserve muscle during cut
    else if(goal === "gain") proteinMultiplier = 2.0;

    let finalProtein = weight * proteinMultiplier;
    animateValue("proteinResult", 0, Math.round(finalProtein), 1200, true, " <span style='font-size:16px; color:var(--text-secondary);'>g</span>");

    // ================= EXPERT RECOMMENDATION =================
    let recommendation = "";
    if(goal === "lose") {
        recommendation = "<strong>Weight Loss Strategy:</strong> We've created a calorie deficit plan focused on high-satiety foods, lean proteins, and complex carbohydrates to preserve muscle while maximizing fat loss.";
    } else if(goal === "gain") {
        recommendation = "<strong>Muscle Gain Strategy:</strong> Your plan features a caloric surplus optimized with high-quality proteins and strategic carbohydrate timing to fuel heavy lifting and accelerate hypertrophy.";
    } else {
        recommendation = "<strong>Maintenance Strategy:</strong> A beautifully balanced macronutrient ratio designed to fuel your daily activities, optimize recovery, and maintain your current physique efficiently.";
    }
    
    // Typewriter effect for recommendation text
    const recEl = document.getElementById("expertRecommendation");
    recEl.innerHTML = "";
    typeWriterEffect(recEl, recommendation, 0);

    // ================= MEAL PLAN =================
    let meals = [];
    if(goal === "lose") {
        meals = [
            "<i class='ph ph-coffee'></i> <strong>Breakfast:</strong> Protein Oats with mixed berries & green tea",
            "<i class='ph ph-hamburger'></i> <strong>Lunch:</strong> Grilled Chicken Breast with quinoa & steamed broccoli",
            "<i class='ph ph-apple'></i> <strong>Snack:</strong> Greek Yogurt with a handful of almonds",
            "<i class='ph ph-bowl-food'></i> <strong>Dinner:</strong> Baked Salmon with a large mixed green salad"
        ];
    } else if(goal === "gain") {
        meals = [
            "<i class='ph ph-coffee'></i> <strong>Breakfast:</strong> 4 Whole Eggs, 2 slices whole wheat toast & peanut butter",
            "<i class='ph ph-hamburger'></i> <strong>Lunch:</strong> Large Chicken Breast, 1.5 cups brown rice & asparagus",
            "<i class='ph ph-apple'></i> <strong>Snack:</strong> Whey Protein Shake with a banana & oats",
            "<i class='ph ph-bowl-food'></i> <strong>Dinner:</strong> Lean Steak, sweet potato mash & mixed vegetables"
        ];
    } else {
        meals = [
            "<i class='ph ph-coffee'></i> <strong>Breakfast:</strong> Oatmeal with milk, chia seeds, and banana",
            "<i class='ph ph-hamburger'></i> <strong>Lunch:</strong> Turkey wrap with whole wheat tortilla and side salad",
            "<i class='ph ph-apple'></i> <strong>Snack:</strong> Apple slices with almond butter",
            "<i class='ph ph-bowl-food'></i> <strong>Dinner:</strong> Grilled Paneer/Tofu with mixed roasted vegetables"
        ];
    }

    const mealPlan = document.getElementById("mealPlan");
    mealPlan.innerHTML = "";
    meals.forEach((meal, index) => {
        setTimeout(() => {
            mealPlan.innerHTML += `<li>${meal}</li>`;
        }, index * 300); // Staggered appearance
    });
}

// ================= ANIMATION UTILITIES =================

function animateValue(id, start, end, duration, isInteger = false, suffix = "") {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        let currentVal = start + easeProgress * (end - start);
        
        if(isInteger) {
            obj.innerHTML = Math.round(currentVal) + suffix;
        } else {
            obj.innerHTML = currentVal.toFixed(1) + suffix;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if(isInteger) obj.innerHTML = end + suffix;
            else obj.innerHTML = end.toFixed(1) + suffix;
        }
    };
    window.requestAnimationFrame(step);
}

function typeWriterEffect(element, htmlContent, index) {
    if (index === 0) {
        // Strip HTML tags for character counting but keep them for rendering correctly
        // A simple workaround for this specific task is just to inject it via innerHTML 
        // with a fast interval to simulate text appearing.
        element.innerHTML = htmlContent;
        element.style.opacity = 0;
        let op = 0;
        let timer = setInterval(() => {
            if (op >= 1) clearInterval(timer);
            element.style.opacity = op;
            op += 0.1;
        }, 50);
    }
}
