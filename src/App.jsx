import { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
} from "firebase/firestore";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [name, setName] = useState("");
  const [horrorMode, setHorrorMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedName = sessionStorage.getItem("username");
    if (savedName) {
      setName(savedName);
    } else {
      const username = prompt("Enter your name") || "Anonymous";
      setName(username);
      sessionStorage.setItem("username", username);
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const serverMsgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis?.() || 0,
      }));

      setMessages((prev) => {
        const localOnly = prev.filter((m) => m.localOnly);
        const combined = [...serverMsgs, ...localOnly];
        combined.sort((a, b) => a.timestamp - b.timestamp);
        return combined;
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim().toLowerCase();
    if (!trimmed) return;

    const timestamp = Date.now();

    // Hidden texts/Easter eggs kinda
    if (trimmed === "hi") {
      setMessages((prev) => [
        ...prev,
        {
          id: "local-rick-" + timestamp,
          name: "do not click!!",
          text: "heyyy! got a surprise for you!",
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          localOnly: true,
          timestamp,
        },
      ]);
      setNewMsg("");
      return;
    }

    if (trimmed === "magic") {
      setMessages((prev) => [
        ...prev,
        {
          id: "local-magic-" + timestamp,
          name: "The Marauders!",
          text: "I solemnly swear that I was up to no good!",
          localOnly: true,
          timestamp,
        },
      ]);
      setNewMsg("");
      return;
    }

    if (trimmed === "the hell?") {
      const enteringVoid = !horrorMode;
      setHorrorMode(enteringVoid);

      setMessages((prev) => [
        ...prev,
        {
          id: "local-emo-" + timestamp,
          name: enteringVoid ? "Vecna" : "Spidey",
          text: enteringVoid
            ? "Welcome to the void."
            : "Back to the vibes.",
          localOnly: true,
          timestamp,
        },
      ]);
      setNewMsg("");
      return;
    }

    
    await addDoc(collection(db, "messages"), {
      name,
      text: newMsg,
      timestamp: serverTimestamp(),
    });

    setNewMsg("");
  };

  const clearMessages = async () => {
    const messagesRef = collection(db, "messages");
    const snapshot = await getDocs(messagesRef);
    const batch = writeBatch(db);
  
    snapshot.forEach((docItem) => {
      batch.delete(docItem.ref);
    });
  
    try {
      await batch.commit();
      console.log("Everything has been wiped from the timeline.");
    } catch (err) {
      console.error(" Message deletion failed:", err);
    }
  
    
    setMessages([]);
  };
  
  const theme = horrorMode ? styles.horror : styles.synth;

  return (
    <div style={{ ...styles.container, ...theme.container }}>
      <div style={styles.header}>
        <h2 style={theme.title}>EchoChamber</h2>
        <button
          onClick={clearMessages}
          style={{ ...styles.button, ...theme.button }}
        >
          Clear Chat
        </button>
      </div>

      <div style={{ ...styles.chatBox, ...theme.chatBox }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.name === name ? styles.myMsg : styles.otherMsg),
              ...theme.message,
              fontFamily: horrorMode ? "'Nosifer', cursive" : "'Rajdhani', sans-serif",
              backgroundColor:
                msg.name === name
                  ? horrorMode
                    ? "#300"
                    : "#ff00ff33"
                  : horrorMode
                  ? "#1a0000"
                  : "#00ffff22",
              color: horrorMode ? "#ff4444" : "#ffffff",
              boxShadow: horrorMode
                ? "none"
                : "0 0 10px #ff00ff, 0 0 20px #00ffff",
            }}
          >
            <strong>{msg.name}</strong>
            <p style={{ margin: "4px 0 0 0" }}>
              {msg.link ? (
                <a
                  href={msg.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00ffff", textShadow: "0 0 5px #00ffff" }}
                >
                  {msg.text}
                </a>
              ) : (
                msg.text
              )}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          style={{
            ...styles.input,
            ...theme.input,
            fontFamily: horrorMode ? "'Nosifer', cursive" : "'Rajdhani', sans-serif",
          }}
        />
        <button type="submit" style={{ ...styles.button, ...theme.button }}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    padding: "1rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    animation: "pulseGlow 10s infinite ease-in-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  chatBox: {
    flex: 1,
    overflowY: "scroll",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "thin",
    msOverflowStyle: "none",
    transition: "all 0.3s ease-in-out",
  },
  message: {
    maxWidth: "75%",
    padding: "10px 15px",
    margin: "6px 0",
    borderRadius: "15px",
    fontSize: "16px",
    lineHeight: "1.4",
    wordBreak: "break-word",
    border: "1px solid #fff3",
  },
  myMsg: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  otherMsg: {
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
  },
  synth: {
    container: {
      backgroundColor: "#0f0c29",
      backgroundImage: "linear-gradient(315deg, #0f0c29 0%, #302b63 74%)",
      fontFamily: "'Rajdhani', sans-serif",
    },
    chatBox: {
      backgroundColor: "rgba(0,0,0,0.3)",
      border: "1px solid #ff00ff",
      boxShadow: "0 0 20px #ff00ff",
    },
    title: {
      fontSize: "2.5rem",
      fontFamily: "'Quantico', sans-serif",
      color: "#ff00ff",
      textShadow: "0 0 15px #ff00ff, 0 0 30px #00ffff",
    },
    input: {
      backgroundColor: "#1a1a2e",
      color: "#fff",
      border: "1px solid #ff00ff",
      textShadow: "0 0 5px #ff00ff",
    },
    button: {
      backgroundColor: "#ff00ff",
      color: "#00ffff",
      fontFamily: "'Orbitron', sans-serif",
      textShadow: "0 0 5px #00ffff",
    },
    message: {},
  },
  horror: {
    container: {
      backgroundColor: "#000",
      fontFamily: "'Nosifer', cursive",
    },
    chatBox: {
      backgroundColor: "#1a0000",
    },
    title: {
      fontSize: "2.5rem",
      color: "#ff0000",
      fontFamily: "'Nosifer', cursive",
      textShadow: "none",
    },
    input: {
      backgroundColor: "#220000",
      color: "#ff4444",
      border: "1px solid #770000",
    },
    button: {
      backgroundColor: "#440000",
      color: "#ff4444",
      fontFamily: "'Nosifer', cursive",
      border: "1px solid #770000",
    },
    message: {},
  },
};

export default App;
