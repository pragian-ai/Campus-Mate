document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const complaintForm = document.getElementById("complaintForm");
    const complaintsFeed = document.getElementById("complaintsFeed");

    // =================================
    // FETCH MY COMPLAINTS
    // =================================
    const fetchComplaints = async () => {
        try {
            const res = await fetch("/api/complaints", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                renderComplaints(data.data);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    const renderComplaints = (complaints) => {
        if (complaints.length === 0) {
            complaintsFeed.innerHTML = "<p>You haven't submitted any tickets yet.</p>";
            return;
        }

        complaintsFeed.innerHTML = complaints.map(complaint => {
            // Determine status color
            let statusColor = "#666";
            if (complaint.status === "Submitted") statusColor = "#ca8a04"; // Yellow
            if (complaint.status === "In Progress") statusColor = "#2563eb"; // Blue
            if (complaint.status === "Resolved") statusColor = "#166534"; // Green

            return `
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <h4 style="margin: 0; font-size: 18px;">${complaint.title}</h4>
                        <span style="font-size: 12px; font-weight: bold; color: ${statusColor}; background: #f3f4f6; padding: 4px 8px; border-radius: 12px;">
                            ${complaint.status}
                        </span>
                    </div>
                    <span style="font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px;">
                        📂 ${complaint.category}
                    </span>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #444;">${complaint.description}</p>
                </div>
            `;
        }).join('');
    };

    // =================================
    // SUBMIT NEW COMPLAINT
    // =================================
    if (complaintForm) {
        complaintForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const title = document.getElementById("title").value;
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;

            try {
                const res = await fetch("/api/complaints", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, category, description })
                });
                
                const data = await res.json();
                
                if (data.success) {
                    alert("Ticket submitted successfully!");
                    complaintForm.reset();
                    fetchComplaints(); // Refresh the list
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error submitting complaint:", error);
            }
        });
    }

    // Initial load
    fetchComplaints();
});