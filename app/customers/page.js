export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function CustomersPage() {
  const session = await requireAccess();
  const all = await db.select().from(customers).where(eq(customers.userId, session.userId));
  const totalUdhar = all.reduce((s, c) => s + (c.udhar || 0), 0);

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap'); * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }`}</style>

      <div style={{ background: "#14532d", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
          <span style={{ fontSize: "18px", fontWeight: "800" }}>👥 ग्राहक ({all.length})</span>
        </div>
        <Link href="/customers/new" style={{ background: "#fff", color: "#14532d", padding: "8px 16px", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>+ नया</Link>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
        {totalUdhar > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "#dc2626", fontSize: "15px" }}>कुल उधारी</span>
            <span style={{ fontWeight: "800", fontSize: "22px", color: "#dc2626" }}>₹{totalUdhar.toLocaleString("hi-IN")}</span>
          </div>
        )}

        {all.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>👥</div>
            <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "16px" }}>अभी कोई ग्राहक नहीं है</p>
            <Link href="/customers/new" style={{ background: "#16a34a", color: "#fff", padding: "12px 28px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>पहला ग्राहक जोड़ो</Link>
          </div>
        ) : (
          all.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: "14px", padding: "14px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>{c.name}</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>{c.phone || "नंबर नहीं"} · {c.address || ""}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {c.udhar > 0 && <div style={{ fontWeight: "800", color: "#dc2626", fontSize: "16px" }}>₹{c.udhar.toLocaleString("hi-IN")}</div>}
                {c.udhar > 0 && <div style={{ fontSize: "11px", color: "#6b7280" }}>उधार</div>}
                {c.phone && (
                  <a href={`https://wa.me/91${c.phone}?text=नमस्ते ${c.name} जी, आपका ₹${c.udhar} उधार बाकी है।`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "11px", color: "#16a34a", textDecoration: "none" }}>
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}