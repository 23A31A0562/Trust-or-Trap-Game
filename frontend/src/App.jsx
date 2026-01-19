import { useEffect, useRef, useState } from "react";
import "./index.css";

const scenarios = [
  { text: "A stranger offers you double money if you share your OTP.", trust: false },
  { text: "Your close friend asks for urgent help and shows valid proof.", trust: true },
  { text: "An unknown app promises rewards for login.", trust: false },
  { text: "Your company HR emails from an official company domain.", trust: true },
  { text: "You receive a link saying your bank account will be blocked.", trust: false },
  { text: "Your bank sends alerts only inside its official mobile app.", trust: true },
  { text: "A WhatsApp message asks for UPI payment urgently.", trust: false },
  { text: "Your manager calls you from their known phone number.", trust: true },
  { text: "An email claims you won a lottery you never entered.", trust: false },
  { text: "A verified delivery app asks for address confirmation.", trust: true },

  { text: "A pop-up asks you to install software to fix your system.", trust: false },
  { text: "Your college portal requests login via official website.", trust: true },
  { text: "A message asks you to share CVV for refund processing.", trust: false },
  { text: "Your email provider alerts about suspicious login attempt.", trust: true },
  { text: "A random caller asks personal details for KYC update.", trust: false },
  { text: "Your bank asks KYC update through official branch visit.", trust: true },
  { text: "A website asks permission to access contacts unnecessarily.", trust: false },
  { text: "A government site uses https and verified domain.", trust: true },
  { text: "A fake job offer asks for registration fee.", trust: false },
  { text: "Your company uses official Slack or Teams for communication.", trust: true },

  { text: "An SMS asks to click a link to track unknown courier.", trust: false },
  { text: "You receive password reset email you requested.", trust: true },
  { text: "A gaming site asks for Google login but looks suspicious.", trust: false },
  { text: "Your cloud service sends billing alert via dashboard.", trust: true },
  { text: "A QR code at public place asks for UPI scan.", trust: false },
  { text: "A verified restaurant app requests payment confirmation.", trust: true },
  { text: "An email says your account is hacked and asks OTP.", trust: false },
  { text: "Your social media app warns about new device login.", trust: true },
  { text: "A stranger asks to borrow your phone for OTP.", trust: false },
  { text: "Your company IT team emails from internal domain.", trust: true },

  { text: "A fake website mimics your bank login page.", trust: false },
  { text: "You receive transaction alert after actual purchase.", trust: true },
  { text: "A random DM offers crypto investment tips.", trust: false },
  { text: "Your salary credit SMS matches bank records.", trust: true },
  { text: "An app asks admin access without explanation.", trust: false },
  { text: "Your OS asks for update through system settings.", trust: true },
  { text: "A caller threatens legal action unless paid immediately.", trust: false },
  { text: "Your university sends exam updates via official portal.", trust: true },
  { text: "A website forces download before showing content.", trust: false },
  { text: "Your email client flags a message as verified sender.", trust: true },

  { text: "A stranger asks you to test their payment app.", trust: false },
  { text: "Your bank branch staff asks ID in person.", trust: true },
  { text: "An unknown extension asks browser permissions.", trust: false },
  { text: "Your company uses SSO login through official URL.", trust: true },
];

const QUESTIONS_PER_GAME = 5;

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomQuestions(allQuestions) {
  const used = JSON.parse(localStorage.getItem("usedQuestions")) || [];

  // available questions (not used before)
  let available = allQuestions.filter(
    (_, index) => !used.includes(index)
  );

  // if not enough questions left → reset
  if (available.length < QUESTIONS_PER_GAME) {
    localStorage.removeItem("usedQuestions");
    available = allQuestions;
  }

  const shuffled = shuffleArray(available);
  const selected = shuffled.slice(0, QUESTIONS_PER_GAME);

  // save used question indexes
  const selectedIndexes = selected.map(q =>
    allQuestions.indexOf(q)
  );

  localStorage.setItem(
    "usedQuestions",
    JSON.stringify([...used, ...selectedIndexes])
  );

  return selected;
}


function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [gameScenarios, setGameScenarios] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const clickSound = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio("/sounds/click.mp3");
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const handleChoice = (choice) => {
    clickSound.current?.play();

    const correct = gameQuestions[index].trust === choice;

    if (correct) {
      setScore((s) => s + 5);
      setFeedback("correct");
      correctSound.current?.play();
    } else {
      setScore((s) => s - 5);
      setFeedback("wrong");
      wrongSound.current?.play();
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 === gameQuestions.length) {
        setGameOver(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 900);
  };

  const restartGame = () => {
    setStarted(false);
    setIndex(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    setGameQuestions([]);
  };

  const getRiskProfile = () => {
    if (score >= 15) return "🧠 Strategic Thinker";
    if (score >= 5) return "⚖️ Balanced Decision Maker";
    if (score >= 0) return "😐 Neutral Player";
    return "🔥 High-Risk Taker";
  };

  /* ---------------- START SCREEN ---------------- */
  if (!started) {
    return (
      <div className="app">
        <div className="game-container card">
          <h1 className="title">🧠 Trust or Trap</h1>

          <p className="scenario">
            You’ll be shown real-world situations.
            Decide whether to <b>Trust</b> or identify a <b>Trap</b>.
          </p>

          <ul className="rules">
            <li>✔ Correct choice: +5 points</li>
            <li>❌ Wrong choice: −5 points</li>
            <li>🧠 Think like a cybersecurity expert</li>
          </ul>

          <button
            className="trust"
            onClick={() => {
              setGameQuestions(getRandomQuestions(scenarios));
              setStarted(true);
            }}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- GAME OVER ---------------- */
  if (gameOver) {
    return (
      <div className="app">
        <div className="game-container card">
          <h1 className="title">Game Over</h1>
          <p className="scenario">Final Score: {score}</p>
          <p className="score">Profile: {getRiskProfile()}</p>

          <button className="trust" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- GAME PLAY ---------------- */
  return (
    <div className="app">
      <div className="game-container card">
        <h1 className="title">🧠 Trust or Trap</h1>

        <p className="scenario">{gameQuestions[index].text}</p>

        <div className="feedback-slot">
          {feedback && (
            <div className={`feedback ${feedback}`}>
              {feedback === "correct" ? "✅ Smart choice!" : "❌ Risky decision!"}
            </div>
          )}
        </div>

        <div className="buttons">
          <button className="trust" onClick={() => handleChoice(true)}>
            Trust
          </button>
          <button className="trap" onClick={() => handleChoice(false)}>
            Trap
          </button>
        </div>

        <div className="score">Score: {score}</div>
      </div>
    </div>
  );
}

export default App;
