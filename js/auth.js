// ================= SHOW/HIDE PASSWORD =================

function setupPasswordToggle(toggleId, passwordId) {
    const toggleButton = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);

    if (!toggleButton || !passwordInput) {
        return;
    }

    toggleButton.addEventListener("click", () => {
        const shouldShowPassword = passwordInput.type === "password";

        passwordInput.type = shouldShowPassword ? "text" : "password";
        toggleButton.setAttribute(
            "aria-label",
            shouldShowPassword ? "Hide password" : "Show password"
        );
    });
}

setupPasswordToggle("toggleLoginPassword", "loginPassword");
setupPasswordToggle("toggleSignupPassword", "signupPassword");

// ================= SIGNUP FORM =================

const signupForm =
document.getElementById("signupForm");

if(signupForm){

    signupForm.addEventListener("submit", (e)=>{

        e.preventDefault();

        const username =
        document.getElementById("signupUsername").value.trim();

        const email =
        document.getElementById("signupEmail").value.trim();


        const password =
        document.getElementById("signupPassword").value;

        const confirmPassword =
        document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){
            showToast("Error", "Passwords do not match", "error");
            return;
        }

        if(password.length < 6){
            showToast("Error", "Password must be at least 6 characters", "error");
            return;
        }

        // SAVE USER DATA VIA DB
        const result = db.register(username, email, password);

        if(result.success) {
            showToast("Success", result.message, "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            showToast("Error", result.message, "error");
        }
    });

}

// ================= LOGIN FORM =================

const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit",(e)=>{

        e.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        const result = db.login(username, password);

        if(result.success) {
            showToast("Welcome Back!", result.message, "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showToast("Error", result.message, "error");
        }
    });

}

// ================= BACKGROUND VIDEO CONTROL =================
document.addEventListener("DOMContentLoaded", () => {
    const bgVideo = document.getElementById("bgVideo");
    const soundToggleBtn = document.getElementById("soundToggleBtn");

    if (bgVideo && soundToggleBtn) {
        // Toggle sound click handler
        soundToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent document click trigger
            if (bgVideo.muted) {
                bgVideo.muted = false;
                soundToggleBtn.innerHTML = '<i class="ph ph-speaker-high"></i> Sound On';
            } else {
                bgVideo.muted = true;
                soundToggleBtn.innerHTML = '<i class="ph ph-speaker-slash"></i> Muted';
            }
        });

        // Unmute on first user interaction anywhere (browser policy requires click/keydown)
        const unmuteOnInteract = () => {
            if (bgVideo.muted) {
                bgVideo.muted = false;
                soundToggleBtn.innerHTML = '<i class="ph ph-speaker-high"></i> Sound On';
            }
            document.removeEventListener("click", unmuteOnInteract);
            document.removeEventListener("keydown", unmuteOnInteract);
        };

        document.addEventListener("click", unmuteOnInteract);
        document.addEventListener("keydown", unmuteOnInteract);
    }
});
