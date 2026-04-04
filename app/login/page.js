export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; }
        .card { background: #fff; border-radius: 24px; padding: 40px 32px; width: 100%; max-width: 360px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .google-btn { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; padding: 14px 20px; background: #fff; border: 2px solid #e5e7eb; border-radius: 14px; font-size: 16px; font-weight: 600; color: #1f2937; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .google-btn:hover { background: #f9fafb; border-color: #16a34a; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(22,163,74,0.2); }
        .badge { background: #dcfce7; color: #15803d; font-size: 13px; font-weight: 600; padding: 4px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px; }
      `}</style>
      <div className="card">
        <div style={{ fontSize: "52px", marginBottom: "8px" }}>🛒</div>
        <div className="badge">7 दिन बिल्कुल मुफ्त</div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#14532d", margin: "0 0 4px" }}>Ration Pro</h1>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>Nishant Software — राशन दुकान का सॉफ्टवेयर</p>
        <a href="/api/auth/google" className="google-btn">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google से Login करो
        </a>
        <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "20px" }}>कोई password नहीं · सीधे Google account से</p>
      </div>
    </main>
  );
}