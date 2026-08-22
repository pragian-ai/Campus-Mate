document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const nameGroup = document.getElementById("nameGroup");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submitBtn");
    const toggleMode = document.getElementById("toggleMode");
    const formTitle = document.getElementById("formTitle");
    const msg = document.getElementById("msg");

    let isLogin = true;

    toggleMode.addEventListener("click", () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = "Student Login";
            nameGroup.classList.add("hidden");
            nameInput.removeAttribute("required");
            submitBtn.textContent = "Login";
            toggleMode.innerHTML = `Need an account? <span>Sign Up</span>`;
        } else {
            formTitle.textContent = "Student Sign Up";
            nameGroup.classList.remove("hidden");
            nameInput.setAttribute("required", "true");
            submitBtn.textContent = "Create Account";
            toggleMode.innerHTML = `Already have an account? <span>Login</span>`;
        }
        msg.textContent = "";
    });

    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        msg.textContent = "Processing...";
        msg.style.color = "#4b5563";

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const payload = {
            email: emailInput.value,
            password: passwordInput.value
        };
        if (!isLogin) payload.name = nameInput.value;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                if (isLogin) {
                    localStorage.setItem("campusx_token", data.token);
                    localStorage.setItem("campusx_role", data.role);
                    window.location.href = "/pages/dashboard.html";
                } else {
                    msg.textContent = "✅ " + data.message + " Please login.";
                    msg.style.color = "#10b981";
                    setTimeout(() => toggleMode.click(), 2000);
                }
            } else {
                msg.textContent = "❌ " + data.message;
                msg.style.color = "#ef4444";
            }
        } catch (error) {
            msg.textContent = "❌ Connection error.";
            msg.style.color = "#ef4444";
        }
    });
});