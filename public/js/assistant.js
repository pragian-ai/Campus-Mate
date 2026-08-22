document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("campusx_token");
    
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement("div");
        
        if (sender === "user") {
            msgDiv.style = "align-self: flex-end; background: #151619; color: white; padding: 12px 16px; border-radius: 16px 16px 4px 16px; max-width: 80%;";
        } else {
            msgDiv.style = "align-self: flex-start; background: #e5e7eb; color: #111; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 80%;";
        }
        
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        
        // Auto-scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // 1. Add user message to UI
        addMessage(message, "user");
        userInput.value = ""; // clear input

        // 2. Send to backend
        try {
            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // 3. Add bot reply to UI
                addMessage(data.reply, "bot");
            }
        } catch (error) {
            console.error("Error communicating with assistant:", error);
            addMessage("Sorry, I'm having trouble connecting to the server right now.", "bot");
        }
    });
});