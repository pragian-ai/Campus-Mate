document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    // Protect the page
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const reportForm = document.getElementById("reportForm");
    const itemsFeed = document.getElementById("itemsFeed");

    // =================================
    // FETCH & RENDER ITEMS
    // =================================
    const fetchItems = async () => {
        try {
            const res = await fetch("/api/lost-found", {
                headers: { "Authorization": `Bearer ${token}` } // Attaching the wristband!
            });
            const data = await res.json();
            
            if (data.success) {
                renderItems(data.data);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const renderItems = (items) => {
        if (items.length === 0) {
            itemsFeed.innerHTML = "<p>No items reported yet.</p>";
            return;
        }

        itemsFeed.innerHTML = items.map(item => `
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                <span style="background: ${item.type === 'lost' ? '#fee2e2' : '#dcfce7'}; color: ${item.type === 'lost' ? '#991b1b' : '#166534'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                    ${item.type}
                </span>
                <h4 style="margin: 10px 0 5px 0;">${item.title}</h4>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #555;">📍 ${item.location}</p>
                <p style="margin: 0; font-size: 14px;">${item.description || 'No description provided.'}</p>
            </div>
        `).join('');
    };

    // =================================
    // SUBMIT NEW REPORT
    // =================================
    if (reportForm) {
        reportForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const type = document.getElementById("type").value;
            const title = document.getElementById("title").value;
            const location = document.getElementById("location").value;
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;

            try {
                const res = await fetch("/api/lost-found", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Attaching the wristband!
                    },
                    body: JSON.stringify({ type, title, location, category, description })
                });
                
                const data = await res.json();
                
                if (data.success) {
                    alert("Report submitted successfully!");
                    reportForm.reset(); // Clear the form
                    fetchItems(); // Refresh the list immediately
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error submitting report:", error);
            }
        });
    }

    // Run the fetch function as soon as the page loads
    fetchItems();
});