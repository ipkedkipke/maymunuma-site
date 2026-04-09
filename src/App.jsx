import { useEffect, useState } from "react";

export default function App() {
  const [now, setNow] = useState(new Date());
  const [tapCount, setTapCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const startDate = new Date("2026-03-16");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = now - startDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const terminal = [
    "> whoami",
    "senin maymunun 💜",
    "",
    "> status murat",
    "üzgün olabilir ama yalnız değil",
    "",
    "> where_is_my_mind",
    "always with murat",
    "",
    "> hug murat",
    "error: distance too far",
    "retrying...",
    "retrying...",
    "retrying until I can hold you 💜",
  ];

  useEffect(() => {
    if (tapCount >= 3) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 4000);
      setTapCount(0);
    }
  }, [tapCount]);

  return (
    <div
      onClick={() => setTapCount((p) => p + 1)}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f3ff, #ffffff)",
        padding: "40px",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "40px", color: "#6b21a8" }}>
        Murat’ım İçin 💜
      </h1>

      <p style={{ maxWidth: "500px", margin: "10px auto", color: "#555" }}>
        Maymunum… bu aralar üzgün olduğunu biliyorum.  
        Uzakta olsam da aklım hep sende.
      </p>

      {/* Sayaç */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "20px",
          marginTop: "20px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <p>Seni son gördüğümden beri</p>
        <h2 style={{ color: "#7c3aed" }}>
          {days} gün {hours} saat {minutes} dk {seconds} sn
        </h2>
        <p>çok özledim 💜</p>
      </div>

      {/* Kalp animasyonu */}
      <div style={{ marginTop: "30px", fontSize: "30px" }}>
        💜 💜 💜
      </div>

      <p style={{ color: "#7c3aed", fontWeight: "bold" }}>
        Her atışta aklımdan geçen: Murat
      </p>

      {/* Terminal */}
      <div
        style={{
          marginTop: "40px",
          background: "#0f172a",
          color: "#4ade80",
          padding: "20px",
          borderRadius: "20px",
          textAlign: "left",
          fontFamily: "monospace",
          maxWidth: "500px",
          marginInline: "auto",
        }}
      >
        {terminal.map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
      </div>

      {/* Final mesaj */}
      <div style={{ marginTop: "40px" }}>
        <p style={{ maxWidth: "500px", margin: "auto", color: "#444" }}>
          Seninle güldüğüm zamanları, sana sarılmayı, yanında olmayı çok seviyorum.
          Uzakta olsan da kalbim hep senin yanında.
        </p>
      </div>

      {/* Easter egg */}
      {showSecret && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          💜 Gizli mesaj:
          <br />
          Aklım nereye gitse sonu yine sana çıkıyor.
        </div>
      )}
    </div>
  );
}