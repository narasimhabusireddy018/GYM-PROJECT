// ================= EMAIL VALIDATION =================

function validEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================= BUTTON SIMULATION =================

function simulateNetworkRequest(btn, defaultText, iconClass, callback) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<i class="ph ph-spinner spinner" style="display:inline-block; margin-right:8px;"></i> Processing...`;
    btn.disabled = true;
    btn.style.opacity = "0.8";

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.style.opacity = "1";
        callback();
    }, 1500); // 1.5 second loading simulation
}

// ================= CONTACT FORM =================

const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");

if(contactForm){
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if(!name || !message){
            showToast("Error", "Please complete all fields.", "error");
            return;
        }

        if(!validEmail(email)){
            showToast("Error", "Enter a valid email address.", "error");
            return;
        }

        simulateNetworkRequest(sendBtn, "Send Message", "ph-paper-plane-right", () => {
            showToast("Message Sent", `Thank you, ${name}! We'll be in touch soon.`, "success");
            contactForm.reset();
        });
    });
}

// ================= TRAINER FORM =================

const trainerForm = document.getElementById("trainerForm");
const bookBtn = document.getElementById("bookBtn");

if(trainerForm){
    trainerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const trainerName = document.getElementById("trainerName").value.trim();
        const trainerType = document.getElementById("trainerType").value;
        const bookingDate = document.getElementById("bookingDate").value;

        if(!trainerName || !trainerType || !bookingDate){
            showToast("Error", "Please complete all fields.", "error");
            return;
        }

        simulateNetworkRequest(bookBtn, "Book Session", "ph-bookmark-simple", () => {
            showToast("Session Booked", `Awesome ${trainerName}! Your ${trainerType} session is set for ${bookingDate}.`, "success");
            trainerForm.reset();
        });
    });
}
