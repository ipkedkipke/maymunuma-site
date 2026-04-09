import { useEffect, useMemo, useRef, useState } from "react";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const quizQuestions = [
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

const terminalScript = [
  "> boot love-system",
  "starting emotional engine...",
  "loading missing-you module...",
  "connected to: murat 💜",
  "",
  "> run status",
  "distance: too far",
  "heart: still connected",
  "thoughts: always with murat",
  "",
  "> decrypt message",
  "access granted",
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro | quiz | memory | decrypt | final
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const [typedLines, setTypedLines] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const [decrypting, setDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [secretVisible, setSecretVisible] = useState(false);

  const [clickHearts, setClickHearts] = useState([]);
  const [burstHearts, setBurstHearts] = useState([]);

  const [holdSecret, setHoldSecret] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimerRef = useRef(null);
  const holdIntervalRef = useRef(null);

  const cards = useMemo(() => {
    const base = [
      { id: 1, emoji: "💜" },
      { id: 2, emoji: "🌙" },
      { id: 3, emoji: "✨" },
      { id: 4, emoji: "💌" },
    ];
    return shuffle(
      [...base, ...base].map((item, i) => ({
        ...item,
        uid: `${item.id}-${i}`,
      }))
    );
  }, []);

  useEffect(() => {
    if (!showTerminal) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedLines((prev) => {
        if (i >= terminalScript.length) return prev;
        const next = [...prev, terminalScript[i]];
        i += 1;
        return next;
      });
      if (i >= terminalScript.length) clearInterval(interval);
    }, 380);
    return () => clearInterval(interval);
  }, [showTerminal]);

  useEffect(() => {
    if (!decrypting) return;
    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          setDecrypting(false);
          setSecretVisible(true);
          setPhase("final");
          return 100;
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [decrypting]);

  const handleBackgroundClick = (e) => {
    const id = Date.now() + Math.random();
    const newHeart = {
      id,
      x: e.clientX,
      y: e.clientY,
      size: 18 + Math.random() * 12,
    };
    setClickHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setClickHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);
  };

  const makeBurst = () => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const pieces = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 24;
      const distance = 90 + Math.random() * 140;
      return {
        id: Date.now() + Math.random() + i,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 18 + Math.random() * 18,
        emoji: i % 5 === 0 ? "✨" : "💜",
      };
    });

    setBurstHearts(pieces);

    setTimeout(() => {
      setBurstHearts([]);
    }, 1600);
  };

  const answerQuestion = (index) => {
    if (selected !== null) return;
    setSelected(index);

    if (index === quizQuestions[quizIndex].correct) {
      setQuizScore((s) => s + 1);
    }

    setTimeout(() => {
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex((q) => q + 1);
        setSelected(null);
      } else {
        setPhase("memory");
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

  const memoryDone = matched.length === 4;

  const restart = () => {
    window.location.reload();
  };

  const startHolding = () => {
    if (holdSecret) return;
    setIsHolding(true);
    setHoldProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + 4;
        return next >= 100 ? 100 : next;
      });
    }, 48);

    holdTimerRef.current = setTimeout(() => {
      setHoldSecret(true);
      setIsHolding(false);
      setHoldProgress(100);
      makeBurst();
    }, 1200);
  };

  const stopHolding = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    setIsHolding(false);
    setHoldProgress((prev) => (prev >= 100 ? 100 : 0));
  };

  const closeHoldSecret = () => {
    setHoldSecret(false);
    setHoldProgress(0);
  };

  const shellButton = {
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(139, 92, 246, 0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.86)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
    animation: "fadeUp 0.6s ease",
  };

  return (
    <div
      onClick={handleBackgroundClick}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f3ff, #fdf4ff, #ffffff)",
        padding: "24px 16px 48px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#2f2a35",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0px) scale(1); opacity: 0.55; }
          50% { transform: translateY(-16px) scale(1.08); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 0.55; }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(139,92,246,0.0); }
          50% { box-shadow: 0 0 24px rgba(139,92,246,0.35); }
          100% { box-shadow: 0 0 0 rgba(139,92,246,0.0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes clickFloat {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -130px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes burstOut {
          0% {
            transform: translate(0px, 0px) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(1.4);
            opacity: 0;
          }
        }

        .floating-heart {
          position: absolute;
          font-size: 28px;
          animation: floatHeart 3.2s ease-in-out infinite;
          pointer-events: none;
          user-select: none;
        }

        .main-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 32px rgba(139, 92, 246, 0.3);
        }

        .choice-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(0,0,0,0.06);
        }

        .memory-card:hover {
          transform: scale(1.04);
        }

        .glow-card {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .shimmer-bar {
          background: linear-gradient(
            90deg,
            #8b5cf6 0%,
            #d946ef 25%,
            #c084fc 50%,
            #d946ef 75%,
            #8b5cf6 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s linear infinite;
        }

        .click-heart {
          position: fixed;
          pointer-events: none;
          animation: clickFloat 1.2s ease forwards;
          z-index: 60;
        }

        .burst-heart {
          position: fixed;
          pointer-events: none;
          animation: burstOut 1.5s ease forwards;
          z-index: 80;
        }
      `}</style>

      <div className="floating-heart" style={{ top: 90, left: 50, animationDelay: "0s" }}>💜</div>
      <div className="floating-heart" style={{ top: 160, right: 70, animationDelay: "0.7s" }}>✨</div>
      <div className="floating-heart" style={{ top: 260, left: 90, animationDelay: "1.3s" }}>💜</div>
      <div className="floating-heart" style={{ top: 360, right: 110, animationDelay: "1.9s" }}>🌙</div>

      {clickHearts.map((h) => (
        <div
          key={h.id}
          className="click-heart"
          style={{
            left: h.x,
            top: h.y,
            fontSize: h.size,
          }}
        >
          💜
        </div>
      ))}

      {burstHearts.map((h) => (
        <div
          key={h.id}
          className="burst-heart"
          style={{
            left: h.x,
            top: h.y,
            fontSize: h.size,
            ["--dx"]: `${h.dx}px`,
            ["--dy"]: `${h.dy}px`,
          }}
        >
          {h.emoji}
        </div>
      ))}

      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.9)",
            padding: "10px 16px",
            borderRadius: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            fontSize: 14,
            marginBottom: 14,
            animation: "fadeUp 0.5s ease",
          }}
        >
          Murat’ım için hazırlandı 💜
        </div>

        <h1
          style={{
            margin: 0,
            color: "#6d28d9",
            fontSize: "clamp(38px, 7vw, 70px)",
            lineHeight: 1.05,
            animation: "fadeUp 0.7s ease",
          }}
        >
          Murat’ım İçin
        </h1>

        <p
          style={{
            maxWidth: 680,
            margin: "14px auto 26px",
            color: "#5f5769",
            fontSize: 18,
            lineHeight: 1.7,
            animation: "fadeUp 0.9s ease",
          }}
        >
          Maymunum… sana bu sefer biraz daha farklı, biraz daha “senlik” bir
          sürpriz hazırladım.
        </p>

        {!started && (
          <div style={{ ...cardStyle, maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ color: "#6d28d9", marginTop: 0 }}>
              LoveOS başlatılmaya hazır
            </h2>
            <p style={{ color: "#645c6d", lineHeight: 1.8 }}>
              Bu sadece tatlı bir sayfa değil. İçinde mini oyunlar, sahte bir
              terminal, sürpriz bir final ve sana özel gizli bir mesaj var.
            </p>
            <button
              className="main-button"
              style={{ ...shellButton, marginTop: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                setStarted(true);
                setShowTerminal(true);
                setPhase("quiz");
              }}
            >
              Oyunu Başlat
            </button>
          </div>
        )}

        {started && (
          <>
            <div
              style={{
                ...cardStyle,
                marginTop: 12,
                marginBottom: 20,
                background: "#0f172a",
                color: "#4ade80",
                textAlign: "left",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
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

              <div style={{ minHeight: 180 }}>
                {typedLines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    style={{
                      color: line.startsWith(">") ? "#c084fc" : "#4ade80",
                      marginBottom: 4,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {line || " "}
                  </div>
                ))}
                <span style={{ color: "#86efac" }}>▋</span>
              </div>
            </div>

            {phase === "quiz" && (
              <div style={cardStyle}>
                <p style={{ color: "#756c80", marginTop: 0, fontSize: 15 }}>
                  Soru {quizIndex + 1} / {quizQuestions.length}
                </p>

                <h2
                  style={{
                    color: "#7c3aed",
                    fontSize: "clamp(28px, 4vw, 44px)",
                    marginTop: 8,
                  }}
                >
                  {quizQuestions[quizIndex].q}
                </h2>

                <div style={{ marginTop: 24 }}>
                  {quizQuestions[quizIndex].a.map((option, i) => {
                    const isCorrect =
                      selected !== null && i === quizQuestions[quizIndex].correct;
                    const isWrong =
                      selected === i && i !== quizQuestions[quizIndex].correct;

                    return (
                      <button
                        key={i}
                        className="choice-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          answerQuestion(i);
                        }}
                        style={{
                          display: "block",
                          margin: "12px auto",
                          padding: "18px 16px",
                          width: "100%",
                          maxWidth: 520,
                          borderRadius: 18,
                          border: "1px solid #ddd6fe",
                          background: isCorrect
                            ? "#dcfce7"
                            : isWrong
                            ? "#fee2e2"
                            : "#ffffff",
                          color: "#2f2a35",
                          fontSize: 17,
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {phase === "memory" && (
              <div>
                <div style={{ ...cardStyle, marginBottom: 18 }}>
                  <h2 style={{ color: "#7c3aed", marginTop: 0 }}>
                    Anılarımızı Eşleştirme Oyunu
                  </h2>
                  <p style={{ color: "#6b6474" }}>
                    Tüm çiftleri bul. Quiz puanın: {quizScore}/{quizQuestions.length}
                  </p>
                </div>

                <div
                  style={{
                    maxWidth: 560,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 14,
                  }}
                >
                  {cards.map((card) => {
                    const open =
                      flipped.includes(card.uid) || matched.includes(card.id);

                    return (
                      <button
                        key={card.uid}
                        className="memory-card"
                        onClick={(e) => {
                          e.stopPropagation();
                          flipCard(card);
                        }}
                        style={{
                          aspectRatio: "1 / 1",
                          border: "none",
                          borderRadius: 22,
                          background: open ? "#ffffff" : "#c4b5fd",
                          color: "#2f2a35",
                          fontSize: 34,
                          cursor: "pointer",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                          transition: "transform 0.2s ease, background 0.2s ease",
                        }}
                      >
                        {open ? card.emoji : "?"}
                      </button>
                    );
                  })}
                </div>

                <p style={{ color: "#6b6474", marginTop: 16 }}>
                  Hamle sayısı: {moves}
                </p>

                {memoryDone && (
                  <button
                    className="main-button"
                    style={{ ...shellButton, marginTop: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhase("decrypt");
                    }}
                  >
                    Gizli Dosyayı Aç
                  </button>
                )}
              </div>
            )}

            {phase === "decrypt" && (
              <div style={{ ...cardStyle, maxWidth: 760, margin: "0 auto" }} className="glow-card">
                <h2 style={{ color: "#7c3aed", marginTop: 0 }}>
                  Şifrelenmiş mesaj bulundu
                </h2>
                <p style={{ color: "#6b6474", lineHeight: 1.8 }}>
                  Son katmana geldin. Şimdi sana sakladığım mesajı çözelim.
                </p>

                {!decrypting && !secretVisible && (
                  <button
                    className="main-button"
                    style={{ ...shellButton, marginTop: 10 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDecryptProgress(0);
                      setDecrypting(true);
                    }}
                  >
                    Decrypt Love Message
                  </button>
                )}

                {(decrypting || secretVisible) && (
                  <div style={{ marginTop: 22 }}>
                    <div
                      style={{
                        height: 14,
                        borderRadius: 999,
                        background: "#ede9fe",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="shimmer-bar"
                        style={{
                          width: `${decryptProgress}%`,
                          height: "100%",
                          transition: "width 0.08s linear",
                        }}
                      />
                    </div>
                    <p style={{ marginTop: 10, color: "#7c3aed", fontWeight: 700 }}>
                      %{decryptProgress} çözüldü
                    </p>
                  </div>
                )}
              </div>
            )}

            {phase === "final" && secretVisible && (
              <div style={{ ...cardStyle, maxWidth: 820, margin: "0 auto" }} className="glow-card">
                <div style={{ fontSize: 54, animation: "floatHeart 2.6s ease-in-out infinite" }}>💜</div>
                <h2 style={{ color: "#7c3aed", fontSize: 36 }}>
                  Erişim tamamlandı: Kalbimin içi
                </h2>

                <p
                  style={{
                    maxWidth: 650,
                    margin: "0 auto",
                    color: "#5e5768",
                    lineHeight: 1.95,
                    fontSize: 18,
                  }}
                >
                  Maymunum, üzgün olsan da yalnız değilsin. Aklımın her an sende
                  olduğunu, seni ne kadar çok özlediğimi ve yanında olmayı ne
                  kadar istediğimi bil. Seninle güldüğüm zamanları, sana
                  sarılmayı, sana dokunmayı çok seviyorum. Uzakta olsan da
                  kalbimin en özel yerindesin.
                </p>

                <p
                  style={{
                    marginTop: 20,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#d946ef",
                    animation: "fadeUp 0.8s ease",
                  }}
                >
                  geçmiş olsun aşkkkk, nane çayı allll 🌿💜
                </p>

                <div style={{ marginTop: 22, maxWidth: 420, marginInline: "auto" }}>
                  <p style={{ color: "#6b6474", marginBottom: 8, fontWeight: 700 }}>
                    Bonus sürpriz için butona uzun bas 💜
                  </p>

                  <div
                    style={{
                      height: 10,
                      borderRadius: 999,
                      background: "#ede9fe",
                      overflow: "hidden",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: `${holdProgress}%`,
                        height: "100%",
                        background: "linear-gradient(to right, #8b5cf6, #d946ef)",
                        transition: isHolding ? "width 0.04s linear" : "width 0.2s ease",
                      }}
                    />
                  </div>

                  <button
                    className="main-button"
                    style={{
                      ...shellButton,
                      transform: isHolding ? "scale(1.04)" : "scale(1)",
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startHolding();
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      stopHolding();
                    }}
                    onMouseLeave={stopHolding}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      startHolding();
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      stopHolding();
                    }}
                  >
                    Uzun Bas
                  </button>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button
                    className="main-button"
                    style={shellButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      restart();
                    }}
                  >
                    Baştan Oyna
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {holdSecret && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 20, 40, 0.62)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 120,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "min(92vw, 520px)",
              background: "white",
              borderRadius: 28,
              padding: 30,
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              animation: "fadeUp 0.4s ease",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 6 }}>💜✨🌿</div>
            <h2 style={{ color: "#7c3aed", marginTop: 0 }}>
              dayanamayıp uzun bastın
            </h2>
            <p style={{ color: "#5b5566", lineHeight: 1.8, fontSize: 17 }}>
              ben de sana daha fazla dayanamadım maymunum 💜
            </p>
            <p
              style={{
                color: "#d946ef",
                fontWeight: 800,
                fontSize: 22,
                marginTop: 14,
              }}
            >
              geçmiş olsun aşkkkk, nane çayı allll 🌿💜
            </p>

            <button
              className="main-button"
              style={{ ...shellButton, marginTop: 18 }}
              onClick={closeHoldSecret}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}