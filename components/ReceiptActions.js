"use client";
import { useRouter } from "next/navigation";

export default function ReceiptActions({ billNo, shopName, customerName, customerPhone, total, paid, balance, items, upiLink }) {
  const router = useRouter();

  function buildWhatsAppText() {
    const lines = [];
    lines.push(`*${shopName}*`);
    lines.push(`बिल नं: ${billNo}`);
    lines.push(`ग्राहक: ${customerName}`);
    lines.push("");
    lines.push("*सामान:*");
    items.forEach(it => {
      lines.push(`• ${it.name} — ${it.qty}${it.unit ? " " + it.unit : ""} = ₹${it.amount.toLocaleString("hi-IN")}`);
    });
    lines.push("");
    lines.push(`कुल: ₹${total.toLocaleString("hi-IN")}`);
    lines.push(`भुगतान: ₹${paid.toLocaleString("hi-IN")}`);
    if (balance > 0) {
      lines.push(`*उधार बाकी: ₹${balance.toLocaleString("hi-IN")}*`);
      if (upiLink) {
        lines.push("");
        lines.push("UPI से pay करें:");
        lines.push(upiLink);
      }
    }
    lines.push("");
    lines.push("धन्यवाद! 🙏");
    return lines.join("\n");
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(buildWhatsAppText());
    let phone = (customerPhone || "").replace(/\D/g, "");
    if (phone.length === 10) phone = "91" + phone;
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  function handleNewBill() {
    router.push("/billing");
  }

  return (
    <div className="actions-bar no-print">
      <button className="btn btn-print" onClick={handlePrint}>🖨️ प्रिंट</button>
      <button className="btn btn-wa" onClick={handleWhatsApp}>💬 WhatsApp</button>
      <button className="btn btn-new" onClick={handleNewBill}>+ नया बिल</button>
    </div>
  );
}