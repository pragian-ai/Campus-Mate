document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    const userString = localStorage.getItem("campusx_user");

    // If no token exists, redirect to login immediately
    if (!token || !userString) {
        window.location.href = "/pages/login.html";
        return; 
    }

    const user = JSON.parse(userString);

    // 3. Update the UI with the user's data
    document.getElementById("welcomeMessage").textContent = `Good morning, ${user.name} 👋`;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileRole").textContent = user.role.toUpperCase();

    // 4. Logout Logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Destroy the wristband and user data
            localStorage.removeItem("campusx_token");
            localStorage.removeItem("campusx_user");
            
            // Send back to login
            window.location.href = "/pages/login.html";
        });
    }
});