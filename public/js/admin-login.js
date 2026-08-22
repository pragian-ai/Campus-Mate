document.addEventListener("DOMContentLoaded", () => {
    const adminLoginForm = document.getElementById("adminLoginForm");
    const errorMsg = document.getElementById("errorMsg");

    adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        errorMsg.textContent = "Authenticating...";
        errorMsg.style.color = "#94a3b8";

        try {
            // We use the exact same backend route!
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // THE GATEKEEPER CHECK: Are they actually an admin?
                if (data.role !== "admin") {
                    errorMsg.textContent = "Access Denied: This portal is for administrators only.";
                    errorMsg.style.color = "#fca5a5";
                    return; // Stop here, do not save token!
                }

                // If they ARE an admin, save credentials and redirect to command center
                localStorage.setItem("campusx_token", data.token);
                localStorage.setItem("campusx_role", data.role);
                window.location.href = "/pages/admin.html";
            } else {
                errorMsg.textContent = "Error: " + data.message;
                errorMsg.style.color = "#fca5a5";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMsg.textContent = "Server connection failed.";
            errorMsg.style.color = "#fca5a5";
        }
    });
});