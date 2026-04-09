import { useMemo, useState } from "react";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const questions = [
    {
      q: "Maymunum şu an en çok neyi bilsin istiyorum?",
      a: ["Aklım hep onda", "Kahve içiyorum", "Uyuyorum"],
      correct: 0,
    },
    {
      q: "Onu en çok ne için özlüyorum?",
      a: ["Yanında olmak", "Telefonu", "Erken kalkması"],
      correct: 0,
    },
    {
      q: "Kalbimdeki en baskın his ne?",
      a: ["Özlem ve sevgi", "Merak", "Utanç"],
      correct: 0,
    },
  ];

  const cards = useMemo(() => {
    const base = [
      { id: 1, emoji: "💜" },
      { id: 2, emoji: "🌙" },
      { id: 3, emoji: "✨" },
      { id: 4, emoji: "💌" },
    ];
    return shuffle(
      [...base, ...base].map((item, index) => ({
        ...item,
        uid: `${item.id}-${index}`,
      }))
    );
  }, []);

  const answerQuestion = (index) => {
    if (selected !== null) return;
    setSelected(index);

    if (index === questions[quizIndex].correct) {
      setQuizScore((s) => s + 1);
    }

    setTimeout(() => {
      if (quizIndex < questions.length - 1) {
        setQuizIndex((q) => q + 1);
        setSelected(null);
      } else {
        setStep(1);
      }
    }, 700);
  };

  const flipCard = (card) => {
    if (
      flipped.length === 2 ||
      flipped.includes(card.uid) ||
      matched.includes(card.id)
    ) {
      return;
    }

    const next = [...flipped, card.uid];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);

      const first = cards.find((c) => c.uid === next[0]);
      const second = cards.find((c) => c.uid === next[1]);

      if (first.id === second.id) {
        setTimeout(() => {
          setMatched((m) => [...m, first.id]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  const finished = matched.length === 4;

  const buttonStyle = {
    border: "none",
    background: "#8b5cf6",
    color: "white",
    padding: "12px 20px",
    borderRadius: 14,
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
  };

  const cardStyle = {
    background: "white",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f3ff, #ffffff)",
        padding: 20,
        fontFamily: "sans-serif",
        color: "#333",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ color: "#7c3aed", fontSize: 44, marginBottom: 10 }}>
          Murat’ım İçin 💜
        </h1>
        <p style={{ color: "#666", maxWidth: 600, margin: "0 auto 20px" }}>
          Maymunum… sana küçük bir sürpriz hazırladım.
        </p>

        {!started && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ color: "#7c3aed" }}>Sana küçük bir sürprizim var</h2>
            <button style={buttonStyle} onClick={() => setStarted(true)}>
              Oyunu Başlat
            </button>
          </div>
        )}

        {started && step === 0 && (
          <div style={cardStyle}>
            <p style={{ color: "#777" }}>
              Soru {quizIndex + 1} / {questions.length}
            </p>
            <h2 style={{ color: "#7c3aed" }}>{questions[quizIndex].q}</h2>

            <div style={{ marginTop: 20 }}>
              {questions[quizIndex].a.map((option, i) => {
                const correct = selected !== null && i === questions[quizIndex].correct;
                const wrong = selected === i && i !== questions[quizIndex].correct;

                return (
                  <button
                    key={i}
                    onClick={() => answerQuestion(i)}
                    style={{
                      display: "block",
                      margin: "10px auto",
                      padding: 14,
                      width: "100%",
                      maxWidth: 420,
                      borderRadius: 14,
                      border: "1px solid #ddd",
                      background: correct
                        ? "#dcfce7"
                        : wrong
                        ? "#fee2e2"
                        : "white",
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {started && step === 1 && (
          <div>
            <div style={{ ...cardStyle, marginBottom: 18 }}>
              <h2 style={{ color: "#7c3aed", marginTop: 0 }}>
                Anılarımızı Eşleştirme Oyunu
              </h2>
              <p style={{ color: "#666" }}>
                Tüm çiftleri bul. Quiz puanın: {quizScore}/{questions.length}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              {cards.map((card) => {
                const open =
                  flipped.includes(card.uid) || matched.includes(card.id);

                return (
                  <button
                    key={card.uid}
                    onClick={() => flipCard(card)}
                    style={{
                      aspectRatio: "1 / 1",
                      border: "none",
                      borderRadius: 18,
                      background: open ? "white" : "#c4b5fd",
                      fontSize: 34,
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    {open ? card.emoji : "?"}
                  </button>
                );
              })}
            </div>

            <p style={{ color: "#666", marginTop: 16 }}>Hamle sayısı: {moves}</p>

            {finished && (
              <button
                style={{ ...buttonStyle, marginTop: 10 }}
                onClick={() => setStep(2)}
              >
                Final Sürprizini Aç
              </button>
            )}
          </div>
        )}

        {started && step === 2 && (
          <div style={cardStyle}>
            <div style={{ fontSize: 50 }}>💜</div>
            <h2 style={{ color: "#7c3aed" }}>İyi ki Varsın Murat</h2>
            <p style={{ maxWidth: 600, margin: "0 auto", lineHeight: 1.8, color: "#555" }}>
              Maymunum, üzgün olsan da yalnız değilsin. Seni çok özlüyorum,
              yanında olmayı çok istiyorum. Seninle güldüğüm anları, sana
              sarılmayı ve sana dokunmayı çok seviyorum.
            </p>

            <button
              style={{ ...buttonStyle, marginTop: 20 }}
              onClick={() => window.location.reload()}
            >
              Baştan Oyna
            </button>
          </div>
        )}
      </div>
    </div>
  );
}