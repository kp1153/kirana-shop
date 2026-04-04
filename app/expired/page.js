import Link from "next/link";

export default function ExpiredPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; }
        .card { background: #fff; border-radius: 24px; padding: 40px 32px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .btn-green { display: block; width: 100%; padding: 14px; background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; font-size: 16px; font-weight: 700; border-radius: 14px; text-decoration: none; margin-bottom: 12px; transition: all 0.2s; }
        .btn-green:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(22,163,74,0.3); }
        .btn-wa { display: block; width: 100%; padding: 14px; background: #25d366; color: #fff; font-size: 16px; font-weight: 700; border-radius: 14px; text-decoration: none; margin-bottom: 20px; }
      `}</style>
      <div className="card">
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>⏰</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#14532d", marginBottom: "8px" }}>Trial खत्म हो गया</h1>
        <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "24px" }}>आपका 7 दिन का मुफ्त trial समाप्त हो गया है। License लें और दुकान चलाते रहें।</p>
        <div style={{ background: "#f0fdf4", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 4px" }}>Ration Pro License</p>
          <p style={{ fontSize: "36px", fontWeight: "800", color: "#15803d", margin: "0 0 4px" }}>₹3,999 <span style={{ fontSize: "14px", fontWeight: "400", color: "#9ca3af" }}>/साल</span></p>
          <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>Renewal: ₹1,499/साल</p>
        </div>
        <a href="https://www.web-developer-kp.com/payment?software=ration" className="btn-green">License खरीदें — ₹3,999</a>
        <a href="https://wa.me/919996865069" target="_blank" rel="noopener noreferrer" className="btn-wa">💬 WhatsApp पर बात करें</a>
        <Link href="/login" style={{ color: "#9ca3af", fontSize: "13px" }}>Login page पर जाएं</Link>
      </div>
    </main>
  );
}