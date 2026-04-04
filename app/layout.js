import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Ration Pro — Nishant Software",
  description: "राशन दुकान का पूरा हिसाब — बिल, स्टॉक, उधारी एक जगह",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Baloo 2', sans-serif", background: "#f0fdf4", margin: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}