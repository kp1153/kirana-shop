"use client";

const RATION_EXE_URL = "https://pub-f7a0759dcf83428bad5a877e80483613.r2.dev/Kirana%20Shop%20Setup%200.1.0.exe";

const painPoints = [
  {
    icon: "😤",
    pain: "उधारी याद नहीं रहती?",
    fix: "हर ग्राहक का उधार — नाम के साथ, पैसे कब मिले — सब दर्ज",
  },
  {
    icon: "📦",
    pain: "माल खत्म होने का पता नहीं चलता?",
    fix: "जैसे ही stock कम हो — अपने आप alert आएगा",
  },
  {
    icon: "🧮",
    pain: "महीने के अंत में हिसाब नहीं मिलता?",
    fix: "एक click में पूरे महीने की बिक्री, खर्च और मुनाफा",
  },
  {
    icon: "📝",
    pain: "supplier का हिसाब अलग-अलग कॉपी में?",
    fix: "हर supplier का हिसाब — कितना लिया, कितना देना बाकी",
  },
];

const features = [
  {
    icon: "🧾",
    title: "तेज़ बिलिंग",
    titleEn: "Fast Billing",
    desc: "सामान का नाम type करो — bill 30 seconds में तैयार। Cash, UPI या उधार — सब accept करो।",
    detail:
      "बिल बनाते वक्त सामान का नाम लिखते ही वो खुद ही आ जाता है। मात्रा डालो — बिल तैयार। Print करो या WhatsApp पर भेजो।",
  },
  {
    icon: "📦",
    title: "Stock की पूरी जानकारी",
    titleEn: "Complete Stock Management",
    desc: "आटा, चावल, दाल, तेल, चीनी — हर सामान का stock real-time में।",
    detail:
      "जब भी कोई सामान बेचो — stock अपने आप घटता है। जब खरीदो — बढ़ता है। जब कम हो — alert आता है। कभी माल खत्म नहीं होगा।",
  },
  {
    icon: "💰",
    title: "उधारी का हिसाब",
    titleEn: "Credit/Udhar Tracking",
    desc: "राम का ₹450, श्याम का ₹1,200 — हर ग्राहक का उधार अलग-अलग।",
    detail:
      "हर ग्राहक का उधार कितना है एक नज़र में दिखता है। WhatsApp से reminder भेजो। जब पैसे मिलें — एक click में काट दो।",
  },
  {
    icon: "📊",
    title: "Daily और Monthly Report",
    titleEn: "Sales Reports",
    desc: "आज कितना बिका, इस महीने कितना — सब एक जगह।",
    detail:
      "सुबह दुकान खोलते ही देखो — कल कितना बिका। महीने के अंत में देखो — पूरे महीने का हिसाब। कौन सा सामान सबसे ज़्यादा बिका।",
  },
  {
    icon: "🚚",
    title: "Purchase Entry",
    titleEn: "Purchase Management",
    desc: "कब माल आया, कहाँ से, कितने में — सब दर्ज।",
    detail:
      "Supplier से माल आने पर entry करो। Stock अपने आप बढ़ जाएगा। हर supplier का हिसाब अलग — किसका कितना बाकी है।",
  },
  {
    icon: "⚠️",
    title: "Low Stock Alert",
    titleEn: "Stock Alerts",
    desc: "आटा 10 kg बचा है — alert आ गया। कभी माल खत्म नहीं होगा।",
    detail:
      "हर सामान के लिए minimum stock set करो। जैसे ही उससे कम हो — dashboard पर बड़ा alert दिखेगा। अभी order करो।",
  },
  {
    icon: "👥",
    title: "ग्राहकों की list",
    titleEn: "Customer Management",
    desc: "नाम, नंबर, पता और उधार — हर ग्राहक की पूरी जानकारी।",
    detail:
      "ग्राहक का नाम save करो। बिल बनाते वक्त नाम search करो — पुराना उधार भी दिखेगा। सब linked।",
  },
  {
    icon: "📱",
    title: "Mobile पर चलता है",
    titleEn: "Mobile PWA + Windows App",
    desc: "Android mobile पर app की तरह install करो। Windows PC पर भी चलता है।",
    detail:
      "कोई Play Store नहीं, कोई App Store नहीं। Chrome में खोलो — install करो। काउंटर पर mobile रखो, बिल बनाओ।",
  },
];

const howTo = [
  {
    step: "01",
    icon: "🔐",
    title: "Google से Login करो",
    desc: "App खोलो — 'Google से Login करो' button दबाओ। अपना Gmail account से login हो जाओगे। कोई नया password नहीं बनाना।",
    tip: "💡 वही Gmail use करो जो हमेशा mobile में हो",
  },
  {
    step: "02",
    icon: "⚙️",
    title: "दुकान की जानकारी भरो",
    desc: "Settings में जाओ — दुकान का नाम, मालिक का नाम, पता, फोन नंबर और UPI ID डालो। यह बिल पर छपेगा।",
    tip: "💡 GSTIN भी डाल सकते हो अगर GST registered हो",
  },
  {
    step: "03",
    icon: "📦",
    title: "सामान की list बनाओ",
    desc: "सामान → नया सामान में जाओ। आटा, चावल, दाल, तेल — हर सामान का नाम, भाव और अभी कितना stock है वो डालो। एक बार करना है — बस।",
    tip: "💡 हिंदी नाम भी डाल सकते हो — जैसे 'आटा 5 किलो'",
  },
  {
    step: "04",
    icon: "👥",
    title: "ग्राहकों को add करो",
    desc: "जो ग्राहक उधार लेते हैं उनका नाम और नंबर save करो। बिल बनाते वक्त नाम select करो — उधार अपने आप उनके खाते में जाएगा।",
    tip: "💡 नकद ग्राहकों के लिए कुछ नहीं करना",
  },
  {
    step: "05",
    icon: "🧾",
    title: "बिल बनाओ — रोज़ाना",
    desc: "बिल बनाओ पर click करो। सामान का नाम type करो — आ जाएगा। मात्रा डालो। Cash/UPI/उधार select करो। बिल तैयार।",
    tip: "💡 बिल बनाते ही stock अपने आप घटेगा",
  },
  {
    step: "06",
    icon: "🚚",
    title: "माल आने पर Purchase Entry",
    desc: "जब Supplier से माल आए — खरीद में जाओ। सामान select करो, मात्रा और भाव डालो। Stock अपने आप बढ़ जाएगा।",
    tip: "💡 Supplier का नाम और bill number भी save कर सकते हो",
  },
  {
    step: "07",
    icon: "💰",
    title: "उधार का हिसाब करो",
    desc: "उधारी में जाओ — देखो किसका कितना बाकी है। जब पैसे मिलें — 'पैसे मिले' button दबाओ। WhatsApp से reminder भी भेज सकते हो।",
    tip: "💡 WhatsApp Reminder एक click में — 'राम जी, आपका ₹500 बाकी है'",
  },
  {
    step: "08",
    icon: "📊",
    title: "Report देखो",
    desc: "Report में जाओ — आज कितना बिका, इस महीने कितना, कौन सा सामान सबसे ज़्यादा बिका। सब एक जगह।",
    tip: "💡 हर रात 2 मिनट में पूरे दिन का हिसाब",
  },
];

const categories = [
  {
    icon: "🌾",
    name: "अनाज/दालें",
    items: "चावल, गेहूँ, आटा, बेसन, मूंग, अरहर, चना, मसूर",
  },
  { icon: "🫙", name: "तेल/घी", items: "सरसों तेल, रिफाइंड, देसी घी, वनस्पति" },
  {
    icon: "🌶️",
    name: "मसाले",
    items: "हल्दी, मिर्च, धनिया, जीरा, नमक, गरम मसाला",
  },
  { icon: "🍬", name: "चीनी/गुड़", items: "चीनी, गुड़, शक्कर, बूरा" },
  {
    icon: "🧴",
    name: "साबुन/डिटर्जेंट",
    items: "सर्फ, विम, हार्पिक, डेटॉल, लाइफबॉय",
  },
  {
    icon: "☕",
    name: "चाय/कॉफी",
    items: "चाय पत्ती, इंस्टेंट कॉफी, बोर्नविटा",
  },
  {
    icon: "🍪",
    name: "पैकेज्ड फूड",
    items: "बिस्किट, नमकीन, मैगी, चिप्स, पापड़",
  },
  { icon: "🧃", name: "पेय/Drinks", items: "कोल्ड ड्रिंक, जूस, पानी की बोतल" },
];

export default function RationPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Baloo 2', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .orange { color: #ea580c; }
        .orange-bg { background: #ea580c; }
        .card { background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); border: 1px solid #fed7aa; }
        .btn-primary { display: inline-block; background: linear-gradient(135deg, #ea580c, #c2410c); color: #fff; font-weight: 900; font-size: 18px; padding: 16px 36px; border-radius: 16px; text-decoration: none; box-shadow: 0 4px 24px rgba(234,88,12,0.35); transition: transform 0.15s; }
        .btn-primary:hover { transform: scale(1.04); }
        .btn-secondary { display: inline-block; background: #fff; color: #ea580c; font-weight: 800; font-size: 16px; padding: 14px 28px; border-radius: 16px; text-decoration: none; border: 2.5px solid #ea580c; transition: transform 0.15s; }
        .btn-secondary:hover { transform: scale(1.04); }
        .section-title { font-size: 32px; font-weight: 900; color: #1c1917; text-align: center; margin-bottom: 8px; }
        .section-sub { text-align: center; color: #78716c; font-size: 16px; margin-bottom: 40px; font-weight: 600; }
        .cat-card { background: #fff; border-radius: 16px; padding: 20px; border: 1.5px solid #fed7aa; text-align: center; transition: border-color 0.2s; }
        .cat-card:hover { border-color: #ea580c; }
        .step-card { background: #fff; border-radius: 20px; padding: 28px; border: 1.5px solid #e7e5e4; position: relative; overflow: hidden; }
        .step-num { position: absolute; top: -10px; right: 16px; font-size: 72px; font-weight: 900; color: rgba(234,88,12,0.07); line-height: 1; }
        .tip { background: #fff7ed; border-left: 3px solid #ea580c; padding: 8px 12px; border-radius: 0 8px 8px 0; font-size: 13px; font-weight: 600; color: #9a3412; }
        .divider { height: 4px; background: linear-gradient(90deg, #ea580c, #fb923c, #fbbf24); }
        .hero-badge { display: inline-block; background: #fff7ed; color: #ea580c; font-weight: 800; font-size: 14px; padding: 6px 18px; border-radius: 999px; border: 1.5px solid #fed7aa; margin-bottom: 20px; }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          padding: "72px 20px 64px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div className="hero-badge">
            🏪 राशन दुकानदारों के लिए बना software
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 60px)",
              fontWeight: "900",
              color: "#1c1917",
              lineHeight: 1.15,
              marginBottom: "20px",
            }}
          >
            दुकान का पूरा हिसाब —<br />
            <span style={{ color: "#ea580c" }}>एक जगह, हिंदी में</span>
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#44403c",
              fontWeight: "600",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            बिलिंग · Stock · उधारी · Purchase · Reports
            <br />
            सब कुछ — mobile और computer दोनों पर
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <a href="/login" className="btn-primary">
              🏪 Free Trial शुरू करो — 7 दिन
            </a>
            <a href={RATION_EXE_URL} className="btn-secondary">
              💻 Windows App Download
            </a>
          </div>
          <p style={{ color: "#78716c", fontSize: "14px", fontWeight: "600" }}>
            ✅ कोई card नहीं &nbsp;·&nbsp; ✅ कोई commitment नहीं &nbsp;·&nbsp;
            ✅ हिंदी में support
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* Pain Points */}
      <section style={{ padding: "64px 20px", background: "#fafaf9" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="section-title">
            क्या यही <span className="orange">परेशानी है?</span>
          </h2>
          <p className="section-sub">
            हर राशन दुकानदार की यही तकलीफ है — हमने solution बना दिया
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {painPoints.map((p, i) => (
              <div
                key={i}
                className="card"
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: "36px", flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div
                    style={{
                      fontWeight: "800",
                      fontSize: "17px",
                      color: "#dc2626",
                      marginBottom: "4px",
                    }}
                  >
                    {p.pain}
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      color: "#374151",
                    }}
                  >
                    ✅ {p.fix}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Features */}
      <section style={{ padding: "64px 20px", background: "#1c1917" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#fb923c",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            क्या-क्या मिलता है?
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#a8a29e",
              fontSize: "16px",
              marginBottom: "40px",
            }}
          >
            एक software — पूरी दुकान का हिसाब
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#292524",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(234,88,12,0.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#ea580c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(234,88,12,0.2)")
                }
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                  {f.icon}
                </div>
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "18px",
                    color: "#fb923c",
                    marginBottom: "4px",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "8px",
                  }}
                >
                  {f.desc}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#a8a29e",
                    lineHeight: 1.6,
                  }}
                >
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Categories */}
      <section style={{ padding: "64px 20px", background: "#fff7ed" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="section-title">
            किस सामान का <span className="orange">हिसाब रखेगा?</span>
          </h2>
          <p className="section-sub">
            राशन दुकान का हर सामान — सब categories में organized
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            {categories.map((cat, i) => (
              <div key={i} className="cat-card">
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                  {cat.icon}
                </div>
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "16px",
                    color: "#1c1917",
                    marginBottom: "6px",
                  }}
                >
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#78716c",
                    lineHeight: 1.5,
                  }}
                >
                  {cat.items}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* How To */}
      <section style={{ padding: "64px 20px", background: "#fafaf9" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="section-title">
            कैसे <span className="orange">use करें?</span>
          </h2>
          <p className="section-sub">8 आसान steps — पहले दिन से शुरू करो</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "20px",
            }}
          >
            {howTo.map((h) => (
              <div key={h.step} className="step-card">
                <div className="step-num">{h.step}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: "36px" }}>{h.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "900",
                        fontSize: "20px",
                        color: "#1c1917",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ color: "#ea580c" }}>Step {h.step}:</span>{" "}
                      {h.title}
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "#44403c",
                        lineHeight: 1.6,
                        marginBottom: "8px",
                      }}
                    >
                      {h.desc}
                    </div>
                    <div className="tip">{h.tip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Pricing */}
      <section style={{ padding: "64px 20px", background: "#1c1917" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#fb923c",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            कीमत
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#a8a29e",
              fontSize: "16px",
              marginBottom: "40px",
            }}
          >
            एक बार खरीदो — पूरा साल चलाओ। कोई monthly charge नहीं।
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "#292524",
                borderRadius: "24px",
                padding: "32px 24px",
                textAlign: "center",
                border: "2.5px solid #ea580c",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#ea580c",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "13px",
                  padding: "6px 20px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}
              >
                नया Account
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#d6d3d1",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              >
                पहली बार
              </div>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "900",
                  color: "#fb923c",
                  lineHeight: 1,
                }}
              >
                ₹3,999
              </div>
              <div
                style={{
                  color: "#a8a29e",
                  fontSize: "14px",
                  margin: "8px 0 4px",
                }}
              >
                एक बार · 1 साल included
              </div>
              <div
                style={{
                  color: "#86efac",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "24px",
                }}
              >
                7 दिन free trial — कोई card नहीं
              </div>
              <a
                href="/login"
                style={{
                  display: "block",
                  background: "linear-gradient(135deg, #ea580c, #c2410c)",
                  color: "#fff",
                  fontWeight: "900",
                  fontSize: "16px",
                  padding: "14px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  marginBottom: "10px",
                }}
              >
                Free Trial शुरू करो
              </a>
              <a
                href="/payment?software=ration"
                style={{
                  display: "block",
                  background: "transparent",
                  color: "#fb923c",
                  fontWeight: "800",
                  fontSize: "14px",
                  padding: "12px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  border: "2px solid #ea580c",
                }}
              >
                Buy Now — ₹3,999
              </a>
            </div>
            <div
              style={{
                background: "#292524",
                borderRadius: "24px",
                padding: "32px 24px",
                textAlign: "center",
                border: "2px solid #44403c",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#d6d3d1",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              >
                Renewal
              </div>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "900",
                  color: "#fb923c",
                  lineHeight: 1,
                }}
              >
                ₹1,499
              </div>
              <div
                style={{
                  color: "#a8a29e",
                  fontSize: "14px",
                  margin: "8px 0 24px",
                }}
              >
                प्रति वर्ष · सभी features
              </div>
              <a
                href="/payment?software=ration&plan=renewal"
                style={{
                  display: "block",
                  background: "linear-gradient(135deg, #ea580c, #c2410c)",
                  color: "#fff",
                  fontWeight: "900",
                  fontSize: "16px",
                  padding: "14px",
                  borderRadius: "14px",
                  textDecoration: "none",
                }}
              >
                Renew Now — ₹1,499
              </a>
            </div>
          </div>
          <div
            style={{
              background: "#292524",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <p style={{ color: "#a8a29e", fontSize: "15px", margin: 0 }}>
              💬 <strong style={{ color: "#fff" }}>Demo देखना है?</strong> —
              WhatsApp करो, live दिखाएंगे ·
              <a
                href="https://wa.me/919996865069"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fb923c", marginLeft: "6px" }}
              >
                wa.me/919996865069
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #7c2d12, #c2410c)",
          padding: "72px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: "900",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            आज से शुरू करो —<br />
            <span style={{ color: "#fef08a" }}>7 दिन बिल्कुल मुफ्त</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "17px",
              marginBottom: "36px",
              fontWeight: "600",
            }}
          >
            कोई card नहीं · कोई commitment नहीं · हिंदी में · WhatsApp support
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/login"
              className="btn-primary"
              style={{ fontSize: "20px", padding: "18px 40px" }}
            >
              🏪 App खोलो — Free है
            </a>
            <a
              href={RATION_EXE_URL}
              className="btn-secondary"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "2.5px solid rgba(255,255,255,0.5)",
                fontSize: "16px",
              }}
            >
              💻 Windows App Download
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0c0a09",
          padding: "20px",
          textAlign: "center",
          color: "#57534e",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        © 2026 Nishant Softwares · भारत के लिए बना ·
        <a
          href="tel:+919996865069"
          style={{ color: "#fb923c", marginLeft: "6px" }}
        >
          9996865069
        </a>
      </footer>
    </main>
  );
}
