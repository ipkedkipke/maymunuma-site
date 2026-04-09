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
    options: [
      "Aklımın hep onda olduğunu",
      "Sadece kahve içtiğimi",
      "Erken uyuduğumu",
    ],
    correct: 0,
  },
  {
    question: "Murat’ı en çok ne için özlüyorum?",
    options: [
      "Yanında olmayı",
      "Telefon şarjını",
      "Erken uyanmasını",
    ],
    correct: 0,
  },
  {
    question: "Kalbimdeki en baskın his ne?",
    options: [
      "Özlem ve sevgi",
      "Merak",
      "Utanç",
    ],
    correct: 0,
  },
];

const giftMessages = [
  "Maymunum, kötü hissettiğin anlarda bile bunu tek başına taşımadığını bil. Ben hep yanındayım 💜",
  "Senden uzakta olmak zor ama sevgim sana her gün ulaşsın istiyorum ✨",
  "Seninle güldüğüm anları düşündükçe seni daha da çok özlüyorum 🌙",
  "Keşke şu an yanında olup sana sarılabilsem. Olana kadar kalbim seninle 💌",
];

const terminalLines = [
  "> whoami",
  "senin maymunun 💜",
  "",
  "> status murat",
  "üzgün olabilir ama asla yalnız değil",
  "",
  "> where_is_my_mind",
  "always with murat",
  "",
  "> hug murat",
  "error: distance too far",
  "retrying with love...",
  "retrying with patience...",
  "retrying until I can hold you again 💜",
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [now, setNow] = useState(new Date());
  const [tapCount, setTapCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const [step, setStep] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const [typedLines, setTypedLines] = useState([]);
  const [showGift, setShowGift] = useState(false);
  const [giftIndex, setGiftIndex] = useState(0);

  // Burayı doğru yıl ile güncelle
  const startDate = new Date("2026-03-16T00:00:00");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = now - startDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

  useEffect(() => {
    if (tapCount >= 3) {
      setShowSecret(true);
      const timeout = setTimeout(() => {
        setShowSecret(false);
        setTapCount(0);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [tapCount]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedLines((prev) => {
        if (index >= terminalLines.length) return prev;
        const next = [...prev, terminalLines[index]];
        index += 1;
        return next;
      });
      if (index >= terminalLines.length) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const memoryCards = useMemo(() => {
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

  const progress = ((step + 1) / 4) * 100;

  const handleQuizAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === quizQuestions[quizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setStep(2);
      }
    }, 900);
  };

  const handleFlip = (card) => {
    if (
      flipped.length === 2 ||
      flipped.includes(card.uid) ||
      matched.includes(card.id)
    ) {
      return;
    }

    const updated = [...flipped, card.uid];
    setFlipped(updated);

    if (updated.length === 2) {
      setMoves((prev) => prev + 1);

      const first = memoryCards.find((c) => c.uid === updated[0]);
      const second = memoryCards.find((c) => c.uid === updated[1]);

      if (first.id === second.id) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first.id]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  const memoryComplete = matched.length === 4;

  const restartGame = () => {
    window.location.reload();
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    padding: "24px",
  };

  return (
    <div
      onClick={() => setTapCount((prev) => prev + 1)}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f3ff, #faf5ff, #ffffff)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#1f2937",
        padding: "28px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.9)",
              padding: "10px 16px",
              borderRadius: 999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              fontSize: 14,
              marginBottom: 14,
            }}
          >
            Murat’ım için hazırlandı 💜
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 62px)",
              lineHeight: 1.05,
              margin: 0,
              color: "#6d28d9",
            }}
          >
            Murat’ım İçin
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: "14px auto 0",
              color: "#5b5566",
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            Maymunum… bu aralar üzgün olduğunu biliyorum. Uzakta olsam da
            aklım hep sende. Bu küçük site sana şunu hissettirsin istiyorum:
            yalnız değilsin, kalbim hep senin yanında.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
            alignItems: "stretch",
            marginBottom: 18,
          }}
        >
          <div style={{ ...cardStyle }}>
            <p style={{ margin: 0, color: "#7c3aed", fontWeight: 700 }}>
              Seni son gördüğümden beri
            </p>
            <div
              style={{
                marginTop: 8,
                fontSize: "clamp(22px, 4vw, 34px)",
                fontWeight: 800,
                color: "#6d28d9",
              }}
            >
              {days} gün {hours} saat {minutes} dk {seconds} sn
            </div>
            <p style={{ marginTop: 10, color: "#6b7280" }}>
              16 Mart’tan beri çok özledim 💜
            </p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#0f172a",
              color: "#4ade80",
              textAlign: "left",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                color: "#94a3b8",
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#f87171",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }}
              />
              <span style={{ marginLeft: 8 }}>murat-console.sh</span>
            </div>

            <div style={{ minHeight: 220 }}>
              {typedLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  style={{
                    color: line.startsWith(">") ? "#c084fc" : "#4ade80",
                    marginBottom: 3,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {line || " "}
                </div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ color: "#86efac" }}
              >
                ▋
              </motion.span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: 22,
            textAlign: "center",
            background: "rgba(255,255,255,0.86)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  delay: i * 0.16,
                }}
                style={{ fontSize: 34 }}
              >
                💜
              </motion.div>
            ))}
          </div>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: "#6d28d9",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            Her atışta aklımdan geçen: Murat
          </p>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: 22,
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 12,
              borderRadius: 999,
              background: "#ede9fe",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(to right, #8b5cf6, #d946ef)",
                borderRadius: 999,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            Aşk yolculuğu %{Math.round(progress)}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              <div style={cardStyle}>
                <h2 style={{ marginTop: 0, color: "#6d28d9" }}>
                  Maymunumu neden bu kadar seviyorum?
                </h2>
                <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                  {loveReasons.map((reason, index) => (
                    <motion.div
                      key={reason}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      style={{
                        background: "#f5f3ff",
                        padding: 14,
                        borderRadius: 18,
                        color: "#4b5563",
                        lineHeight: 1.6,
                      }}
                    >
                      {reason}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                <h2 style={{ marginTop: 0, color: "#6d28d9" }}>
                  Sana küçük bir sürprizim var
                </h2>
                <p style={{ color: "#5b5566", lineHeight: 1.8 }}>
                  Bu küçük site sadece bir mesaj değil. İçinde oyun da var,
                  sürpriz de var, en önemlisi de tamamen sana özel olması var.
                </p>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    marginTop: 22,
                    border: "none",
                    background: "linear-gradient(to right, #8b5cf6, #d946ef)",
                    color: "white",
                    padding: "14px 22px",
                    borderRadius: 18,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Oyunu Başlat
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              style={{ ...cardStyle, maxWidth: 760, margin: "0 auto" }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>
                Soru {quizIndex + 1} / {quizQuestions.length}
              </p>

              <h2 style={{ marginTop: 0, fontSize: 30, color: "#6d28d9" }}>
                {quizQuestions[quizIndex].question}
              </h2>

              <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
                {quizQuestions[quizIndex].options.map((option, index) => {
                  const isCorrect =
                    selectedAnswer !== null &&
                    index === quizQuestions[quizIndex].correct;
                  const isWrongSelected =
                    selectedAnswer === index &&
                    index !== quizQuestions[quizIndex].correct;

                  return (
                    <button
                      key={option}
                      onClick={() => handleQuizAnswer(index)}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 18,
                        border: "1px solid #e9d5ff",
                        background: isCorrect
                          ? "#dcfce7"
                          : isWrongSelected
                          ? "#fee2e2"
                          : "#ffffff",
                        textAlign: "left",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
            >
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <h2 style={{ color: "#6d28d9", fontSize: 32, marginBottom: 8 }}>
                  Anılarımızı Eşleştirme Oyunu
                </h2>
                <p style={{ color: "#6b7280" }}>
                  Tüm çiftleri bul, final mesajını açalım. Quiz puanın:{" "}
                  {quizScore}/{quizQuestions.length}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                {[
                  "Seninle kahkaha attığımız anları çok seviyorum.",
                  "Yanında olmayı ve sana dokunmayı çok özlüyorum.",
                  "Uzakta olsan da kalbimde hep çok yakınsın.",
                ].map((text) => (
                  <div
                    key={text}
                    style={{
                      ...cardStyle,
                      padding: 16,
                      fontSize: 14,
                      color: "#5b5566",
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>

              <div
                style={{
                  maxWidth: 760,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                {memoryCards.map((card) => {
                  const isOpen =
                    flipped.includes(card.uid) || matched.includes(card.id);

                  return (
                    <button
                      key={card.uid}
                      onClick={() => handleFlip(card)}
                      style={{
                        aspectRatio: "1 / 1",
                        border: "none",
                        borderRadius: 24,
                        fontSize: 34,
                        cursor: "pointer",
                        background: isOpen ? "#ffffff" : "#c4b5fd",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                      }}
                    >
                      {isOpen ? card.emoji : "?"}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  color: "#6b7280",
                }}
              >
                Hamle sayısı: {moves}
              </div>

              {memoryComplete && (
                <div style={{ textAlign: "center", marginTop: 22 }}>
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      border: "none",
                      background:
                        "linear-gradient(to right, #8b5cf6, #d946ef)",
                      color: "white",
                      padding: "14px 22px",
                      borderRadius: 18,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Final Sürprizini Aç
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ ...cardStyle, maxWidth: 820, margin: "0 auto", textAlign: "center" }}
            >
              <div style={{ fontSize: 52 }}>💜</div>
              <h2 style={{ marginTop: 10, color: "#6d28d9", fontSize: 38 }}>
                İyi ki Varsın Murat
              </h2>

              <p
                style={{
                  maxWidth: 650,
                  margin: "16px auto 0",
                  color: "#4b5563",
                  fontSize: 17,
                  lineHeight: 1.9,
                }}
              >
                Maymunum, bazen kelimeler yetmiyor ama sana bunu hissettirmek
                istiyorum: üzgün olsan da yalnız değilsin. Aklımın her an sende
                olduğunu, seni ne kadar çok özlediğimi ve yanında olmayı ne
                kadar istediğimi bil. Seninle güldüğüm zamanları, sana sarılmayı
                ve sana dokunmayı çok seviyorum. Uzakta olsan da kalbimin en
                özel yerindesin.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <button
                  onClick={() => {
                    setGiftIndex((prev) => (prev + 1) % giftMessages.length);
                    setShowGift(true);
                  }}
                  style={{
                    border: "1px solid #d8b4fe",
                    background: "#ffffff",
                    color: "#6d28d9",
                    padding: "12px 18px",
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Gizli Mesaj Aç
                </button>

                <button
                  onClick={restartGame}
                  style={{
                    border: "none",
                    background: "linear-gradient(to right, #8b5cf6, #d946ef)",
                    color: "#ffffff",
                    padding: "12px 18px",
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Baştan Oyna
                </button>
              </div>

              <AnimatePresence>
                {showGift && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      marginTop: 18,
                      background: "#f5f3ff",
                      borderRadius: 20,
                      padding: 18,
                      color: "#5b5566",
                      lineHeight: 1.7,
                    }}
                  >
                    {giftMessages[giftIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{
                position: "fixed",
                left: "50%",
                bottom: 20,
                transform: "translateX(-50%)",
                width: "min(92vw, 620px)",
                background: "#ffffff",
                borderRadius: 24,
                padding: 20,
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                textAlign: "center",
                zIndex: 50,
              }}
            >
              <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                Gizli mesaj açıldı
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6d28d9",
                  fontWeight: 800,
                  fontSize: 18,
                  lineHeight: 1.6,
                }}
              >
                Maymunum, bu siteye üç kere dokununca çıkan şey bile sensin.
                Çünkü aklım hangi satıra dönse sonu yine sana çıkıyor.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}