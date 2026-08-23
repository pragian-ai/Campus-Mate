// ================================
// CHATBOT FRONTEND JAVASCRIPT
// ================================


// Open / Close Chat
function openChat() {

    const chat = document.getElementById("chatWindow");
    const bubble = document.getElementById("messageBubble");

    if (chat.style.display === "block") {

        chat.style.display = "none";
        bubble.style.display = "block";

    } else {

        chat.style.display = "block";
        bubble.style.display = "none";

        // Input par automatically cursor
        document.getElementById("userInput").focus();
    }
}


// ================================
// SEND MESSAGE
// ================================

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");

    const message = input.value.trim();

    // Empty message ko send mat karo
    if (message === "") {
        return;
    }


    // ----------------------------
    // 1. USER MESSAGE UI
    // ----------------------------

    const userMessage = document.createElement("div");

    userMessage.className = "user-message";
    userMessage.innerText = message;

    chatBody.appendChild(userMessage);

    // Input clear
    input.value = "";

    // Scroll bottom
    chatBody.scrollTop = chatBody.scrollHeight;


    // ----------------------------
    // 2. TYPING MESSAGE
    // ----------------------------

    const typingMessage = document.createElement("div");

    typingMessage.className = "bot-message";
    typingMessage.id = "typingMessage";

    typingMessage.innerText = "Typing...";

    chatBody.appendChild(typingMessage);

    chatBody.scrollTop = chatBody.scrollHeight;


    // ----------------------------
    // 3. SEND MESSAGE TO BACKEND
    // ----------------------------

    try {

        const response = await fetch("http://localhost:8080/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        // Backend error
        if (!response.ok) {
            throw new Error("Backend server error");
        }


        // Backend se JSON response
        const data = await response.json();


        // ----------------------------
        // 4. REMOVE TYPING MESSAGE
        // ----------------------------

        typingMessage.remove();


        // ----------------------------
        // 5. BOT RESPONSE
        // ----------------------------

        const botMessage = document.createElement("div");

        botMessage.className = "bot-message";

        botMessage.innerText = data.reply;

        chatBody.appendChild(botMessage);


        // Scroll bottom
        chatBody.scrollTop = chatBody.scrollHeight;


    } catch (error) {

        console.error("Chatbot Error:", error);


        // Typing remove
        typingMessage.remove();


        // Error message
        const errorMessage = document.createElement("div");

        errorMessage.className = "bot-message";

        errorMessage.innerText =
            "⚠️ Server se connection nahi ho pa raha.";


        chatBody.appendChild(errorMessage);


        chatBody.scrollTop = chatBody.scrollHeight;
    }

}


// ================================
// ENTER KEY
// ================================

function checkEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }

}