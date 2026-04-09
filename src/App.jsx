import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loveReasons = [
  "Seninle güldüğüm anlar kalbimin en güzel köşesinde duruyor.",
  "Yanında olmak bana huzur veriyor.",
  "Sana sarılmayı ve sana dokunmayı çok özlüyorum.",
  "Uzakta olsan da aklım hep sende.",
  "Üzgün olduğunda yanında olduğumu bilmeni istiyorum.",
  "Maymunum, sen kalbime iyi gelen insansın.",
];

const quizQuestions = [
  {
    question: "Maymunum şu an en çok neyi bilsin istiyorum?",
    options: ["Aklımın hep onda olduğunu", "Sadece kahve içtiğimi", "Erken uyuduğumu"],
    correct: 0,
  },
  {
    question: "Murat’ı en çok ne için özlüyorum?",
    options: ["Yanında olmayı", "Telefon şarjını", "Erken uyanmasını"],
    correct: 0,
  },
];

export default function App() {
  const [step, setStep] = useState(0);

  const card = {
    background: "#fff",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f3ff, #fff)",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* 🔥 BUTON EN ÜSTTE */}
        <div style={{ ...card, textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#7c3aed" }}>Sana küçük bir sürprizim var 💜</h2>
          <button
            onClick={() => setStep(1)}
            style={{
              marginTop: 15,
              padding: "12px 20px",
              borderRadius: 15,
              border: "none",
              background: "#8b5cf6",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Oyunu Başlat
          </button>
        </div>

        <AnimatePresence>
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={card}>
                <h3>Maymunumu neden seviyorum?</h3>
                {loveReasons.map((r) => (
                  <p key={r}>{r}</p>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={card}>
                <h2>{quizQuestions[0].question}</h2>
                {quizQuestions[0].options.map((o) => (
                  <button
                    key={o}
                    style={{
                      display: "block",
                      marginTop: 10,
                      padding: 10,
                      width: "100%",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}