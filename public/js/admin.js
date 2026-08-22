document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    const role = localStorage.getItem("campusx_role");
    
    if (!token || role !== "admin") return window.location.href = "/pages/login.html";

    const alertsFeed = document.getElementById("alertsFeed");
    const sosCount = document.getElementById("sosCount");
    const complaintCount = document.getElementById("complaintCount");

    const fetchDashboardData = async () => {
        try {
            // Fetch SOS Alerts
            const sosRes = await fetch("/api/sos/admin/all", { headers: { "Authorization": `Bearer ${token}` } });
            const sosData = await sosRes.json();
            
            // Fetch Complaints (to show count)
            const compRes = await fetch("/api/complaints/admin/all", { headers: { "Authorization": `Bearer ${token}` } });
            const compData = await compRes.json();

            // Update Counts
            if (compData.success) complaintCount.textContent = compData.data.length;
            
            // Render SOS Feed
            if (sosData.success) {
                sosCount.textContent = sosData.data.length;
                
                if (sosData.data.length === 0) {
                    alertsFeed.innerHTML = `<p style="color: #10b981;">✅ All clear. No active emergencies.</p>`;
                } else {
                    alertsFeed.innerHTML = sosData.data.map(alert => `
                        <div class="alert-card">
                            <div>
                                <h3 style="margin: 0 0 5px 0; color: #f8fafc;">🚨 SOS: ${alert.name || 'Student'}</h3>
                                <p style="margin: 0; color: #94a3b8; font-size: 14px;">Coords: ${alert.latitude.toFixed(5)}, ${alert.longitude.toFixed(5)}</p>
                            </div>
                            <a href="https://www.google.com/maps?q=${alert.latitude},${alert.longitude}" target="_blank" class="map-btn">📍 View Map</a>
                        </div>
                    `).join('');
                }
            }
        } catch (error) {
            console.error("Dashboard sync error:", error);
        }
    };

    fetchDashboardData();
    setInterval(fetchDashboardData, 10000); // Auto-refresh every 10s
});