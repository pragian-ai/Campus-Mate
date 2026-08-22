document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    if (!token) { window.location.href = "/pages/login.html"; return; }

    const queuesFeed = document.getElementById("queuesFeed");

    const fetchQueues = async () => {
        try {
            const res = await fetch("/api/queues", { headers: { "Authorization": `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) renderQueues(data.data);
        } catch (error) {
            console.error("Error fetching queues:", error);
        }
    };

    const renderQueues = (queues) => {
        if (queues.length === 0) {
            queuesFeed.innerHTML = "<p>No queue data available.</p>";
            return;
        }
        queuesFeed.innerHTML = queues.map(q => {
            const statusClass = q.status.toLowerCase() === "busy" ? "status-busy" : "status-normal";
            return `
            <div class="queue-card">
                <h4>${q.facility_name} <span class="badge ${statusClass}" style="float: right;">${q.status}</span></h4>
                <div class="stat"><span>People Waiting:</span> <strong>${q.people_waiting}</strong></div>
                <div class="stat"><span>Est. Wait Time:</span> <strong>${q.estimated_wait_min} mins</strong></div>
            </div>`;
        }).join('');
    };

    fetchQueues();
    setInterval(fetchQueues, 30000);
});