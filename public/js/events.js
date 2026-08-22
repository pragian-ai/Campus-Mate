document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    const role = localStorage.getItem("campusx_role"); // Fetch the role!
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const adminPanel = document.getElementById("adminPanel");
    const eventForm = document.getElementById("eventForm");
    const eventsFeed = document.getElementById("eventsFeed");

    // 1. CONDITIONAL UI: Show form ONLY if user is admin
    if (role === "admin") {
        adminPanel.style.display = "block";
    }

    // 2. FETCH EVENTS
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

    // 3. RENDER BEAUTIFUL CARDS
    const renderEvents = (events) => {
        if (events.length === 0) {
            eventsFeed.innerHTML = "<p>No upcoming events at the moment.</p>";
            return;
        }

        eventsFeed.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-date">${new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <h4 class="event-title">${event.title}</h4>
                <div class="event-meta">
                    <span>⏰ ${event.time}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">${event.description}</p>
            </div>
        `).join('');
    };

    // 4. SUBMIT EVENT (Admins Only)
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
                    eventForm.reset();
                    fetchEvents(); // Refresh feed
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error posting event:", error);
            }
        });
    }

    fetchEvents();
});