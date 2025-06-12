# 🤖 Conversational AI Assistant

A voice-activated AI assistant inspired by Alexa, built for the browser using modern web technologies. This assistant supports multi-language input, natural language understanding, context-aware conversation, and mock smart device control.

🟢 **Live Demo**: [Visit the app on Netlify](https://your-netlify-url.netlify.app)  
🟣 **Hosted via**: GitHub + Netlify

---

## 🧠 Features

- 🎙️ **Voice Input & Output**: Speak to the assistant using your microphone; hear replies via text-to-speech
- 🌐 **Multi-language Support**: Understands English, Hindi, and other languages
- 🔁 **Context Awareness**: Handles follow-up questions (e.g., "What about tomorrow?")
- 💡 **Smart Task Execution**:
  - General knowledge Q&A
  - Setting reminders
  - Simulated control of smart home devices
- 📄 **Text Responses**: Every voice interaction also returns a readable response
- 🔘 **Mock Smart Device Toggle**: Interact with virtual switches

---

## 🛠️ Technologies Used

**Frontend**:
- Vite + React + TypeScript
- Tailwind CSS for styling
- shadcn/ui for components
- Web Speech API for speech recognition and synthesis

**Backend (Mock API layer)**:
- Flask (Python)
- REST endpoint for intent recognition and task handling

**Other Tools**:
- GitHub for version control
- Netlify for deployment

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

- Node.js & npm
- Python 3.x (for the backend, if testing locally)

---

### 🔧 Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate into the project directory
cd your-repo-name

# Install dependencies
npm install

# Run the development server
npm run dev


```
---
🧪 Sample Interactions

Q: "What’s the weather in Delhi?"
A: "It’s 28°C and partly cloudy in Delhi."

Q: "And tomorrow?"
A: "Tomorrow will be 30°C and sunny in Delhi."

Q: "Set a reminder for my meeting at 5 PM."
A: "Reminder set for 5 PM."

Q: "Turn on the living room light."
A: "The living room light has been turned on."

---

🛸 Future Enhancements
🔐 Authentication with user profiles

📅 Calendar integration (Google/Outlook)

📲 Cross-platform mobile app (Flutter or React Native)

🌐 Real device control via IoT (MQTT, Zigbee)

🗣️ Emotion detection in voice input

📣 Custom wake word engine

🧠 Self-learning AI via reinforcement learning


---


🙌 Thank You for Visiting!
We hope you enjoy exploring and building upon the Conversational AI Assistant.
