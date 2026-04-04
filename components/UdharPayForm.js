"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UdharPayForm({ customerId, customerName }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    await fetch("/api/udhar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, amount: parseFloat(amount), note: "नकद मिला" }),
    });
    setAmount("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input type="number" placeholder="मिली रकम ₹" value={amount} onChange={e => setAmount(e.target.value)}
        style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", fontFamily: "'Baloo 2', sans-serif" }} />
      <button onClick={handlePay} disabled={loading}
        style={{ background: "#16a34a", color: "#fff", padding: "10px 18px", borderRadius: "10px", border: "none", fontWeight: "700", fontSize: "14px", cursor: "pointer", opacity: loading ? 0.6 : 1, fontFamily: "'Baloo 2', sans-serif" }}>
        {loading ? "..." : "पैसे मिले ✓"}
      </button>
    </div>
  );
}