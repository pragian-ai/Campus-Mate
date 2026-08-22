document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const queuesFeed = document.getElementById("queuesFeed");

    const fetchQueues = async () => {
        try {
            const res = await fetch("/api/queues", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                renderQueues(data.data);
            }
        } catch (error) {
            console.error("Error fetching queues:", error);
        }
    };

    const renderQueues = (queues) => {
        if (queues.length === 0) {
            queuesFeed.innerHTML = "<p>No queue data available.</p>";
            return;
        }

        queuesFeed.innerHTML = queues.map(queue => {
            let statusColor = "#166534"; 
            let statusBg = "#dcfce7";
            
            if (queue.status === "Busy") {
                statusColor = "#9a3412"; 
                statusBg = "#ffedd5";
            } else if (queue.status === "Very Busy") {
                statusColor = "#991b1b"; 
                statusBg = "#fee2e2";
            }

            return `
                <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #ddd;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px;">${queue.facility_name}</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 12px;">PEOPLE WAITING</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">👤 ${queue.people_waiting}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; color: #666; font-size: 12px;">EST. WAIT</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">⏱ ${queue.estimated_wait_min}m</p>
                        </div>
                    </div>
                    <div style="display: inline-block; background: ${statusBg}; color: ${statusColor}; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                        Status: ${queue.status}
                    </div>
                </div>
            `;
        }).join('');
    };

    fetchQueues();
});

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
};