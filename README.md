# EchoChamber

**EchoChamber** is a real-time group chat app built with **React**, **Firebase**, and **Vite**.  
It’s simple, fast, and lets multiple users chat instantly — no login required.

Styled with a synthwave-inspired theme just to keep things interesting. 🌃 ✨🎴     

[Have a go at it!](https://echo-chamber-eta.vercel.app/)

---

## ⚙️ Core Features

- Real-time group messaging using Firebase
- Messages update instantly across all connected users
- Built with React and Vite for a smooth, minimal frontend
- "Clear Chat" button wipes the timeline for everyone
- Responsive layout (mostly works on mobile, still a bit janky)
    
---

## 💻 Tech Stack

- **React** – frontend library
- **Vite** – fast dev/build tool
- **Firebase Firestore** – real-time NoSQL database
- **CSS** – custom styling with synthwave + horror themes
- **Deployed with Vercel**

---

👀 Easter Eggs
| Command	| Response |
|---------|----------|
| hi	    | Surprise gift! |
| magic |	A nod to The Marauders |
| the hell?	| Vecna's calling... |

These are local-only — no one else sees them but you.

## 🧪 Might Add Later

- Sign-in with usernames or Google (something minimal, nothing wild) or Profiles maybe… maybe not.
- Public and private chat rooms
- More easter eggs (never stop never stopping)
- Typing indicators — if the mood strikes
- Smooth transitions, sound effects and more synth-vibe (for that extra flair)
- Media upload if possible (GIFs and stickers carry the conversation!)

## 🚀 Getting Started

```bash
git clone https://github.com/Kenmaaa05/EchoChamber.git
cd EchoChamber
npm install
npm run dev
```
Add your Firebase config in a .env file:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```


```pgsql
src/
  ├─ App.jsx
  └─ firebase.js

public/
  └─ index.html
.env
README.md
```

Didn’t wanna write lab manuals, so I made this instead.
Debugging was mostly me yelling at ChatGPT until it kinda worked. 
It was fun.

