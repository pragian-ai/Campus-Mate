document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    const role = localStorage.getItem("campusx_role");
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const adminPanel = document.getElementById("adminPanel");
    const itemForm = document.getElementById("itemForm");
    const itemsFeed = document.getElementById("itemsFeed");

    // 1. CONDITIONAL UI: Show form ONLY if user is admin
    if (role === "admin") {
        adminPanel.style.display = "block";
    }

    // 2. FETCH ITEMS
    const fetchItems = async () => {
        try {
            // Note: Update this URL if your route is named differently (e.g. /api/items)
            const res = await fetch("/api/lost-found", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                renderItems(data.data);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // 3. RENDER BEAUTIFUL CARDS
    const renderItems = (items) => {
        if (items.length === 0) {
            itemsFeed.innerHTML = `
                <div style="grid-column: 1 / -1; background: white; padding: 40px; text-align: center; border-radius: 12px; color: #6b7280;">
                    No lost or found items reported right now.
                </div>`;
            return;
        }

        itemsFeed.innerHTML = items.map(item => {
            // Dynamic badge color based on status
            const badgeClass = item.status.toLowerCase() === "lost" ? "lost" : "found";
            
            return `
            <div class="item-card">
                <span class="badge ${badgeClass}">${item.status}</span>
                <h4 class="item-title">${item.name}</h4>
                <div class="item-meta">
                    <span>📍 <strong>Location:</strong> ${item.location}</span>
                    <span>📞 <strong>Contact:</strong> ${item.contact}</span>
                </div>
                <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">${item.description || 'No description provided.'}</p>
            </div>
        `}).join('');
    };

    // 4. SUBMIT ITEM (Admins Only)
    if (itemForm) {
        itemForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("itemName").value;
            const status = document.getElementById("itemStatus").value;
            const location = document.getElementById("itemLocation").value;
            const contact = document.getElementById("contactInfo").value;
            const description = document.getElementById("itemDescription").value;

            try {
                const res = await fetch("/api/lost-found", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, status, location, contact, description })
                });
                
                const data = await res.json();
                
                if (data.success) {
                    itemForm.reset();
                    fetchItems(); // Refresh feed instantly
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error posting item:", error);
            }
        });
    }

    fetchItems();
});