// public/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // =================================
    // SIGN UP LOGIC
    // =================================
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Stop page reload
            
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (data.success) {
                    alert("Account created! Please log in.");
                    window.location.href = "/pages/login.html";
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Signup failed:", error);
            }
        });
    }

    // =================================
    // LOGIN LOGIC
    // =================================
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Save the token (wristband) in the browser!
                    localStorage.setItem("campusx_token", data.token);
                    localStorage.setItem("campusx_user", JSON.stringify(data.user));
                    
                    // Redirect to the dashboard
                    window.location.href = "/pages/dashboard.html";
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Login failed:", error);
            }
        });
    }
});