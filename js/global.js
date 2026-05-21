// ================= TOAST NOTIFICATION (GLOBAL) =================

window.showToast = function(title, message, type = "success") {
    const container = document.getElementById("toastContainer");
    if(!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success" ? "ph-check-circle" : "ph-warning-circle";
    
    toast.innerHTML = `
        <i class="ph-fill ${icon} toast-icon"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => { toast.classList.add("show"); }, 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400); 
    }, 4000);
};

// ================= GLOBAL INTERSECTION OBSERVER =================

document.addEventListener("DOMContentLoaded", () => {
    // Select all elements that have animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');

    // Create an intersection observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When element enters viewport
            if (entry.isIntersecting) {
                // Add the 'show' class to trigger animation
                entry.target.classList.add('show');
                
                // Optionally stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the very bottom
    });

    // Observe each element
    animatedElements.forEach(el => observer.observe(el));

    // ================= MOBILE MENU LOGIC =================
    const menuToggle = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    if(menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            // Toggle icon from hamburger to X
            const icon = menuToggle.querySelector("i");
            if(navLinks.classList.contains("active")) {
                icon.classList.remove("ph-list");
                icon.classList.add("ph-x");
            } else {
                icon.classList.remove("ph-x");
                icon.classList.add("ph-list");
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if(!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                icon.classList.remove("ph-x");
                icon.classList.add("ph-list");
            }
        });
    }

    // ================= AUTH STATE UI UPDATE =================
    // Only runs if db.js is loaded
    if (typeof db !== "undefined") {
        const user = db.getCurrentUser();
        const navButtons = document.querySelector(".nav-buttons");
        
        if (user) {
            // Replace Login/Signup in navbar with Logout
            if (navButtons) {
                navButtons.innerHTML = `
                    <button class="logout-btn" id="navLogoutBtn" style="background: transparent; border: 1px solid var(--border-light); color: var(--text-primary); padding: 10px 20px; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                        <i class="ph ph-sign-out"></i> Logout
                    </button>
                `;
                
                document.getElementById("navLogoutBtn").addEventListener("click", () => {
                    db.logout();
                    window.location.reload();
                });
            }

            // Replace "Start Your Journey" signup button with Dashboard link
            const heroSignupBtn = document.querySelector('.hero-buttons .primary-btn');
            if(heroSignupBtn && heroSignupBtn.getAttribute('href') === 'signup.html') {
                heroSignupBtn.setAttribute('href', 'dashboard.html');
                heroSignupBtn.innerHTML = `Go to Dashboard <i class="ph-fill ph-arrow-right"></i>`;
            }
        }
    }
});
