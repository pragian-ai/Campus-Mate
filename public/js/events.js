document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    // Protect the page
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const eventForm = document.getElementById("eventForm");
    const eventsFeed = document.getElementById("eventsFeed");

    // =================================
    // FETCH & RENDER EVENTS
    // =================================
    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                renderEvents(data.data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const renderEvents = (events) => {
        if (events.length === 0) {
            eventsFeed.innerHTML = "<p>No upcoming events.</p>";
            return;
        }

        eventsFeed.innerHTML = events.map(event => `
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; border-left: 4px solid #151619;">
                <h4 style="margin: 0 0 5px 0; font-size: 18px;">${event.title}</h4>
                <div style="display: flex; gap: 15px; margin-bottom: 10px; font-size: 13px; color: #555;">
                    <span>📅 ${event.date}</span>
                    <span>⏰ ${event.time}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <p style="margin: 0; font-size: 14px;">${event.description || 'No description provided.'}</p>
            </div>
        `).join('');
    };

    // =================================
    // SUBMIT NEW EVENT
    // =================================
    if (eventForm) {
        eventForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const title = document.getElementById("title").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const location = document.getElementById("location").value;
            const description = document.getElementById("description").value;

            try {
                const res = await fetch("/api/events", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, date, time, location, description })
                });
                
                const data = await res.json();
                
                if (data.success) {
                    alert("Event posted successfully!");
                    eventForm.reset();
                    fetchEvents();
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error posting event:", error);
            }
        });
    }

    // Load events initially
    fetchEvents();
});

//  Logout Logic
const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Destroy the wristband and user data
            localStorage.removeItem("campusx_token");
            localStorage.removeItem("campusx_user");
            
            // Send back to login
            window.location.href = "/pages/login.html";
        });
};