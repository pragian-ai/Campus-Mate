document.addEventListener("DOMContentLoaded", () => {
    const sosBtn = document.getElementById("sosBtn");
    const statusDiv = document.getElementById("status");
    const token = localStorage.getItem("campusx_token");

    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    sosBtn.addEventListener("click", () => {
        statusDiv.textContent = "Locating...";
        statusDiv.style.color = "#f59e0b";

        if (!navigator.geolocation) {
            statusDiv.textContent = "❌ Geolocation is not supported by your browser.";
            statusDiv.style.color = "#ef4444";
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const res = await fetch("/api/sos", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ latitude, longitude })
                });

                const data = await res.json();

                if (data.success) {
                    statusDiv.textContent = "✅ SOS ALERT SENT TO ADMIN!";
                    statusDiv.style.color = "#10b981";
                    
                    // Add a visual flash effect to the button
                    sosBtn.style.background = "#991b1b";
                    setTimeout(() => sosBtn.style.background = "#dc2626", 1000);
                } else {
                    statusDiv.textContent = "❌ " + data.message;
                    statusDiv.style.color = "#ef4444";
                }
            } catch (error) {
                statusDiv.textContent = "❌ Connection failed.";
                statusDiv.style.color = "#ef4444";
            }
        }, (error) => {
            statusDiv.textContent = "❌ Please allow location access to send SOS.";
            statusDiv.style.color = "#ef4444";
        });
    });
});