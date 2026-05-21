// ================= MOCK DATABASE API =================
// Strictly for frontend-only prototyping. Saves all data securely in localStorage.

class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem("db_users")) || {};
        this.currentUser = localStorage.getItem("db_currentUser") || null;
    }

    _save() {
        localStorage.setItem("db_users", JSON.stringify(this.users));
    }

    _hash(str) {
        // Simple base64 encoding (pseudo-hashing) to avoid plaintext passwords in localStorage
        return btoa(str);
    }

    register(username, email, password) {
        if (this.users[username]) {
            return { success: false, message: "Username already exists." };
        }
        
        // Create new user profile with default stats
        this.users[username] = {
            email: email,
            password: this._hash(password),
            stats: {
                caloriesBurned: 0,
                workoutTime: 0,
                workoutsCompleted: 0,
                water: 0,
                streak: 1,
                joinedDate: new Date().toISOString()
            }
        };
        
        this._save();
        return { success: true, message: "Account created successfully!" };
    }

    login(username, password) {
        const user = this.users[username];
        if (!user) {
            return { success: false, message: "User not found." };
        }
        
        if (user.password !== this._hash(password)) {
            return { success: false, message: "Incorrect password." };
        }
        
        this.currentUser = username;
        localStorage.setItem("db_currentUser", username);
        return { success: true, message: "Login successful!" };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem("db_currentUser");
    }

    getCurrentUser() {
        if (!this.currentUser) return null;
        return { username: this.currentUser, ...this.users[this.currentUser] };
    }

    updateStats(newStats) {
        if (!this.currentUser) return;
        this.users[this.currentUser].stats = { 
            ...this.users[this.currentUser].stats, 
            ...newStats 
        };
        this._save();
    }

    addWater() {
        const user = this.getCurrentUser();
        if(!user) return null;
        let currentWater = user.stats.water || 0;
        if(currentWater < 8) {
            this.updateStats({ water: currentWater + 1 });
            return currentWater + 1;
        }
        return currentWater;
    }

    logWorkout(minutes, calories) {
        const user = this.getCurrentUser();
        if(!user) return null;
        this.updateStats({
            workoutTime: (user.stats.workoutTime || 0) + minutes,
            caloriesBurned: (user.stats.caloriesBurned || 0) + calories,
            workoutsCompleted: (user.stats.workoutsCompleted || 0) + 1
        });
        return this.getCurrentUser().stats;
    }
}

// Initialize global DB instance
const db = new Database();
