const askAssistant = (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let botResponse = "I'm not sure about that. Try asking about the library, canteen, Wi-Fi, or campus timings!";

    // Simple keyword matching engine
    if (userMessage.includes("library")) {
        botResponse = "📚 The Main Library is open from 8:00 AM to 10:00 PM. You need your ID card to enter.";
    } else if (userMessage.includes("canteen") || userMessage.includes("food")) {
        botResponse = "🍔 The Main Canteen serves lunch from 12:30 PM to 2:30 PM. Check the Smart Wait page to see how busy it is right now!";
    } else if (userMessage.includes("wifi") || userMessage.includes("wi-fi") || userMessage.includes("internet")) {
        botResponse = "📶 The student Wi-Fi network is 'CampusX_Secure'. The default password is your student ID. If it's down, you can report it on the Complaints page.";
    } else if (userMessage.includes("hello") || userMessage.includes("hi")) {
        botResponse = "👋 Hi there! I'm your Campus Assistant. How can I help you today?";
    } else if (userMessage.includes("events") || userMessage.includes("hackathon")) {
        botResponse = "🎉 We have events happening all the time! Check the Events page on your sidebar for the latest schedule.";
    }

    setTimeout(() => {
        res.json({ success: true, reply: botResponse });
    }, 500); 
};

module.exports = { askAssistant };