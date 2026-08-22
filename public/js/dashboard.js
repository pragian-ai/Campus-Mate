document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    const role = localStorage.getItem("campusx_role");
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    document.getElementById("roleDisplay").textContent = role === "admin" ? "Administrator" : "Student";
    
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "/pages/login.html";
    });
});