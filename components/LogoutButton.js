"use client";
export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition">
      बाहर जाओ
    </button>
  );
}