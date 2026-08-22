document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    // Protect the page
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
            // Determine colors based on status
            let statusColor = "#166534"; // Green for Normal
            let statusBg = "#dcfce7";
            
            if (queue.status === "Busy") {
                statusColor = "#9a3412"; // Orange for Busy
                statusBg = "#ffedd5";
            } else if (queue.status === "Very Busy") {
                statusColor = "#991b1b"; // Red for Very Busy
                statusBg = "#fee2e2";
            }

            return `
                <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px;">${queue.facility_name}</h3>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <div>
                            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">People Waiting</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">👤 ${queue.people_waiting}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Est. Wait</p>
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

    // Load data immediately
    fetchQueues();
    
    // Optional: Refresh data every 30 seconds for that "live" feel
    setInterval(fetchQueues, 30000);
});