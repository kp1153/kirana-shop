export default function manifest() {
  return {
    name: "Ration Pro — Nishant Software",
    short_name: "Ration Pro",
    description: "राशन दुकान का पूरा हिसाब — बिल, स्टॉक, उधारी एक जगह",
    start_url: "/",
    display: "standalone",
    background_color: "#f0fdf4",
    theme_color: "#ea580c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}