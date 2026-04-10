import { db } from "@/lib/db";
import { items } from "@/lib/schema";

const SEED_ITEMS = [
  // ───────────────────────────────
  // अनाज / दालें
  // ───────────────────────────────
  { hindiName: "चावल", name: "Chawal", category: "अनाज/दालें", unit: "किलो", mrp: 60, purchasePrice: 50, stock: 0, minStock: 10, gst: 5 },
  { hindiName: "बासमती चावल", name: "Basmati Chawal", category: "अनाज/दालें", unit: "किलो", mrp: 120, purchasePrice: 100, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "आटा (गेहूँ)", name: "Aata Gehun", category: "अनाज/दालें", unit: "किलो", mrp: 45, purchasePrice: 38, stock: 0, minStock: 20, gst: 5 },
  { hindiName: "मैदा", name: "Maida", category: "अनाज/दालें", unit: "किलो", mrp: 40, purchasePrice: 33, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "बेसन", name: "Besan", category: "अनाज/दालें", unit: "किलो", mrp: 80, purchasePrice: 68, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "सूजी / रवा", name: "Suji Rava", category: "अनाज/दालें", unit: "किलो", mrp: 45, purchasePrice: 38, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "मक्का आटा", name: "Makka Aata", category: "अनाज/दालें", unit: "किलो", mrp: 35, purchasePrice: 28, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "अरहर दाल", name: "Arhar Dal", category: "अनाज/दालें", unit: "किलो", mrp: 140, purchasePrice: 120, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "मूंग दाल", name: "Moong Dal", category: "अनाज/दालें", unit: "किलो", mrp: 120, purchasePrice: 100, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "मसूर दाल", name: "Masoor Dal", category: "अनाज/दालें", unit: "किलो", mrp: 100, purchasePrice: 85, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "चना दाल", name: "Chana Dal", category: "अनाज/दालें", unit: "किलो", mrp: 90, purchasePrice: 75, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "उड़द दाल", name: "Urad Dal", category: "अनाज/दालें", unit: "किलो", mrp: 130, purchasePrice: 110, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "राजमा", name: "Rajma", category: "अनाज/दालें", unit: "किलो", mrp: 150, purchasePrice: 125, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "काबुली चना", name: "Kabuli Chana", category: "अनाज/दालें", unit: "किलो", mrp: 120, purchasePrice: 100, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "पोहा", name: "Poha", category: "अनाज/दालें", unit: "किलो", mrp: 55, purchasePrice: 45, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "साबूदाना", name: "Sabudana", category: "अनाज/दालें", unit: "किलो", mrp: 80, purchasePrice: 65, stock: 0, minStock: 3, gst: 5 },

  // ───────────────────────────────
  // तेल / घी
  // ───────────────────────────────
  { hindiName: "सरसों तेल 1L", name: "Sarson Tel 1L", category: "तेल/घी", unit: "नग", mrp: 180, purchasePrice: 155, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "सरसों तेल 5L", name: "Sarson Tel 5L", category: "तेल/घी", unit: "नग", mrp: 850, purchasePrice: 720, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "रिफाइंड तेल 1L", name: "Refined Tel 1L", category: "तेल/घी", unit: "नग", mrp: 160, purchasePrice: 135, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "रिफाइंड तेल 5L", name: "Refined Tel 5L", category: "तेल/घी", unit: "नग", mrp: 750, purchasePrice: 630, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "देसी घी 500ml", name: "Desi Ghee 500ml", category: "तेल/घी", unit: "नग", mrp: 350, purchasePrice: 300, stock: 0, minStock: 3, gst: 12 },
  { hindiName: "देसी घी 1kg", name: "Desi Ghee 1kg", category: "तेल/घी", unit: "नग", mrp: 680, purchasePrice: 580, stock: 0, minStock: 3, gst: 12 },
  { hindiName: "वनस्पति घी 1kg", name: "Vanaspati Ghee 1kg", category: "तेल/घी", unit: "नग", mrp: 220, purchasePrice: 185, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "नारियल तेल 500ml", name: "Nariyal Tel 500ml", category: "तेल/घी", unit: "नग", mrp: 180, purchasePrice: 150, stock: 0, minStock: 3, gst: 5 },

  // ───────────────────────────────
  // मसाले
  // ───────────────────────────────
  { hindiName: "नमक 1kg", name: "Namak 1kg", category: "मसाले", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 0 },
  { hindiName: "हल्दी पाउडर 100g", name: "Haldi Powder 100g", category: "मसाले", unit: "नग", mrp: 30, purchasePrice: 22, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "हल्दी पाउडर 500g", name: "Haldi Powder 500g", category: "मसाले", unit: "नग", mrp: 130, purchasePrice: 105, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "लाल मिर्च पाउडर 100g", name: "Lal Mirch 100g", category: "मसाले", unit: "नग", mrp: 35, purchasePrice: 28, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "धनिया पाउडर 100g", name: "Dhaniya Powder 100g", category: "मसाले", unit: "नग", mrp: 30, purchasePrice: 22, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "जीरा 100g", name: "Jeera 100g", category: "मसाले", unit: "नग", mrp: 50, purchasePrice: 40, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "गरम मसाला 100g", name: "Garam Masala 100g", category: "मसाले", unit: "नग", mrp: 55, purchasePrice: 44, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "काली मिर्च 50g", name: "Kali Mirch 50g", category: "मसाले", unit: "नग", mrp: 45, purchasePrice: 35, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "अजवाइन 100g", name: "Ajwain 100g", category: "मसाले", unit: "नग", mrp: 30, purchasePrice: 22, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "सौंफ 100g", name: "Saunf 100g", category: "मसाले", unit: "नग", mrp: 30, purchasePrice: 22, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "राई 100g", name: "Rai 100g", category: "मसाले", unit: "नग", mrp: 20, purchasePrice: 14, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "इमली 200g", name: "Imli 200g", category: "मसाले", unit: "नग", mrp: 30, purchasePrice: 22, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "सब्ज़ी मसाला 100g", name: "Sabzi Masala 100g", category: "मसाले", unit: "नग", mrp: 45, purchasePrice: 35, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "चाट मसाला 100g", name: "Chaat Masala 100g", category: "मसाले", unit: "नग", mrp: 35, purchasePrice: 26, stock: 0, minStock: 3, gst: 5 },

  // ───────────────────────────────
  // चीनी / गुड़
  // ───────────────────────────────
  { hindiName: "चीनी 1kg", name: "Cheeni 1kg", category: "चीनी/गुड़", unit: "नग", mrp: 45, purchasePrice: 38, stock: 0, minStock: 10, gst: 5 },
  { hindiName: "चीनी 5kg", name: "Cheeni 5kg", category: "चीनी/गुड़", unit: "नग", mrp: 210, purchasePrice: 178, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "गुड़ 1kg", name: "Gud 1kg", category: "चीनी/गुड़", unit: "नग", mrp: 60, purchasePrice: 50, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "शक्कर 1kg", name: "Shakkar 1kg", category: "चीनी/गुड़", unit: "नग", mrp: 50, purchasePrice: 42, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "बूरा 500g", name: "Boora 500g", category: "चीनी/गुड़", unit: "नग", mrp: 35, purchasePrice: 28, stock: 0, minStock: 3, gst: 5 },

  // ───────────────────────────────
  // चाय / कॉफी
  // ───────────────────────────────
  { hindiName: "चाय पत्ती 250g", name: "Chai Patti 250g", category: "चाय/कॉफी", unit: "नग", mrp: 80, purchasePrice: 65, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "चाय पत्ती 500g", name: "Chai Patti 500g", category: "चाय/कॉफी", unit: "नग", mrp: 150, purchasePrice: 125, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "चाय पत्ती 1kg", name: "Chai Patti 1kg", category: "चाय/कॉफी", unit: "नग", mrp: 290, purchasePrice: 240, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "इलायची चाय 250g", name: "Elaichi Chai 250g", category: "चाय/कॉफी", unit: "नग", mrp: 100, purchasePrice: 82, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "नेस्कैफे 50g", name: "Nescafe 50g", category: "चाय/कॉफी", unit: "नग", mrp: 150, purchasePrice: 125, stock: 0, minStock: 3, gst: 12 },
  { hindiName: "बॉर्नविटा 500g", name: "Bournvita 500g", category: "चाय/कॉफी", unit: "नग", mrp: 280, purchasePrice: 240, stock: 0, minStock: 3, gst: 18 },
  { hindiName: "हॉर्लिक्स 500g", name: "Horlicks 500g", category: "चाय/कॉफी", unit: "नग", mrp: 290, purchasePrice: 248, stock: 0, minStock: 3, gst: 18 },

  // ───────────────────────────────
  // डेयरी
  // ───────────────────────────────
  { hindiName: "दूध पाउडर 500g", name: "Doodh Powder 500g", category: "डेयरी", unit: "नग", mrp: 220, purchasePrice: 185, stock: 0, minStock: 3, gst: 5 },
  { hindiName: "अमूल बटर 100g", name: "Amul Butter 100g", category: "डेयरी", unit: "नग", mrp: 60, purchasePrice: 52, stock: 0, minStock: 5, gst: 12 },
  { hindiName: "अमूल बटर 500g", name: "Amul Butter 500g", category: "डेयरी", unit: "नग", mrp: 280, purchasePrice: 240, stock: 0, minStock: 3, gst: 12 },
  { hindiName: "पनीर 200g", name: "Paneer 200g", category: "डेयरी", unit: "नग", mrp: 90, purchasePrice: 75, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "दही 400g", name: "Dahi 400g", category: "डेयरी", unit: "नग", mrp: 45, purchasePrice: 38, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "छाछ 200ml", name: "Chaach 200ml", category: "डेयरी", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 5, gst: 5 },

  // ───────────────────────────────
  // पैकेज्ड फूड
  // ───────────────────────────────
  { hindiName: "मैगी 70g", name: "Maggi 70g", category: "पैकेज्ड फूड", unit: "नग", mrp: 14, purchasePrice: 11, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "मैगी 12पैक", name: "Maggi 12pack", category: "पैकेज्ड फूड", unit: "नग", mrp: 156, purchasePrice: 128, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "पार्ले-जी बिस्किट", name: "Parle-G Biscuit", category: "पैकेज्ड फूड", unit: "नग", mrp: 10, purchasePrice: 8, stock: 0, minStock: 20, gst: 18 },
  { hindiName: "मैरी बिस्किट", name: "Marie Biscuit", category: "पैकेज्ड फूड", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "कुरकुरे 26g", name: "Kurkure 26g", category: "पैकेज्ड फूड", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "लेज़ चिप्स 26g", name: "Lays Chips 26g", category: "पैकेज्ड फूड", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "हल्दीराम नमकीन 200g", name: "Haldiram Namkeen 200g", category: "पैकेज्ड फूड", unit: "नग", mrp: 50, purchasePrice: 40, stock: 0, minStock: 5, gst: 12 },
  { hindiName: "पापड़ 200g", name: "Papad 200g", category: "पैकेज्ड फूड", unit: "नग", mrp: 40, purchasePrice: 32, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "आचार 400g", name: "Achar 400g", category: "पैकेज्ड फूड", unit: "नग", mrp: 80, purchasePrice: 65, stock: 0, minStock: 3, gst: 12 },
  { hindiName: "सत्तू 500g", name: "Sattu 500g", category: "पैकेज्ड फूड", unit: "नग", mrp: 60, purchasePrice: 48, stock: 0, minStock: 3, gst: 5 },

  // ───────────────────────────────
  // साबुन / डिटर्जेंट
  // ───────────────────────────────
  { hindiName: "सर्फ एक्सेल 500g", name: "Surf Excel 500g", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 100, purchasePrice: 84, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "सर्फ एक्सेल 1kg", name: "Surf Excel 1kg", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 190, purchasePrice: 160, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "व्हील पाउडर 1kg", name: "Wheel Powder 1kg", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 60, purchasePrice: 50, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "निरमा 1kg", name: "Nirma 1kg", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 55, purchasePrice: 45, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "विम बार 200g", name: "Vim Bar 200g", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 30, purchasePrice: 24, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "विम लिक्विड 500ml", name: "Vim Liquid 500ml", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 90, purchasePrice: 75, stock: 0, minStock: 3, gst: 18 },
  { hindiName: "लाइफबॉय साबुन 100g", name: "Lifebuoy Soap 100g", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 35, purchasePrice: 28, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "लक्स साबुन 100g", name: "Lux Soap 100g", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 40, purchasePrice: 32, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "डेटॉल साबुन 100g", name: "Dettol Soap 100g", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 55, purchasePrice: 44, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "हार्पिक 500ml", name: "Harpic 500ml", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 90, purchasePrice: 75, stock: 0, minStock: 3, gst: 18 },
  { hindiName: "कॉलिन 500ml", name: "Colin 500ml", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 100, purchasePrice: 83, stock: 0, minStock: 3, gst: 18 },
  { hindiName: "फिनाइल 500ml", name: "Phenyl 500ml", category: "साबुन/डिटर्जेंट", unit: "नग", mrp: 40, purchasePrice: 32, stock: 0, minStock: 3, gst: 18 },

  // ───────────────────────────────
  // पर्सनल केयर
  // ───────────────────────────────
  { hindiName: "कोलगेट 100g", name: "Colgate 100g", category: "पर्सनल केयर", unit: "नग", mrp: 55, purchasePrice: 45, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "पतंजलि दंत क्रीम 100g", name: "Patanjali Dant Cream 100g", category: "पर्सनल केयर", unit: "नग", mrp: 45, purchasePrice: 36, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "टूथब्रश", name: "Toothbrush", category: "पर्सनल केयर", unit: "नग", mrp: 25, purchasePrice: 18, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "शैम्पू 180ml", name: "Shampoo 180ml", category: "पर्सनल केयर", unit: "नग", mrp: 90, purchasePrice: 75, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "नारियल तेल बालों का 100ml", name: "Nariyal Tel Hair 100ml", category: "पर्सनल केयर", unit: "नग", mrp: 60, purchasePrice: 50, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "वैसलीन 100ml", name: "Vaseline 100ml", category: "पर्सनल केयर", unit: "नग", mrp: 65, purchasePrice: 54, stock: 0, minStock: 3, gst: 18 },
  { hindiName: "सेनेटरी पैड", name: "Sanitary Pad", category: "पर्सनल केयर", unit: "नग", mrp: 40, purchasePrice: 32, stock: 0, minStock: 5, gst: 0 },
  { hindiName: "रेज़र", name: "Razor", category: "पर्सनल केयर", unit: "नग", mrp: 15, purchasePrice: 10, stock: 0, minStock: 5, gst: 18 },

  // ───────────────────────────────
  // पेय / Drinks
  // ───────────────────────────────
  { hindiName: "पानी की बोतल 1L", name: "Pani Bottle 1L", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 14, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "पानी की बोतल 500ml", name: "Pani Bottle 500ml", category: "पेय", unit: "नग", mrp: 10, purchasePrice: 7, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "थम्स अप 300ml", name: "Thums Up 300ml", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 28 },
  { hindiName: "कोका कोला 300ml", name: "Coca Cola 300ml", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 28 },
  { hindiName: "स्प्राइट 300ml", name: "Sprite 300ml", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 28 },
  { hindiName: "लिम्का 300ml", name: "Limca 300ml", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 28 },
  { hindiName: "माज़ा 200ml", name: "Maaza 200ml", category: "पेय", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 10, gst: 28 },
  { hindiName: "फ्रूटी 200ml", name: "Frooti 200ml", category: "पेय", unit: "नग", mrp: 15, purchasePrice: 11, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "रियल जूस 1L", name: "Real Juice 1L", category: "पेय", unit: "नग", mrp: 120, purchasePrice: 100, stock: 0, minStock: 5, gst: 18 },
  { hindiName: "लस्सी 200ml", name: "Lassi 200ml", category: "पेय", unit: "नग", mrp: 25, purchasePrice: 18, stock: 0, minStock: 5, gst: 12 },

  // ───────────────────────────────
  // स्नैक्स
  // ───────────────────────────────
  { hindiName: "बिस्लेरी मिनरल वाटर 1L", name: "Bisleri 1L", category: "स्नैक्स", unit: "नग", mrp: 20, purchasePrice: 14, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "डेयरी मिल्क 13g", name: "Dairy Milk 13g", category: "स्नैक्स", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "किटकैट", name: "KitKat", category: "स्नैक्स", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "5 स्टार चॉकलेट", name: "5 Star Chocolate", category: "स्नैक्स", unit: "नग", mrp: 20, purchasePrice: 16, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "मैंगो बाइट", name: "Mango Bite", category: "स्नैक्स", unit: "नग", mrp: 1, purchasePrice: 0.7, stock: 0, minStock: 50, gst: 18 },
  { hindiName: "एक्लेयर्स टॉफी", name: "Eclairs Toffee", category: "स्नैक्स", unit: "नग", mrp: 1, purchasePrice: 0.7, stock: 0, minStock: 50, gst: 18 },
  { hindiName: "रस्क 400g", name: "Rusk 400g", category: "स्नैक्स", unit: "नग", mrp: 50, purchasePrice: 40, stock: 0, minStock: 5, gst: 5 },
  { hindiName: "ब्रेड", name: "Bread", category: "स्नैक्स", unit: "नग", mrp: 40, purchasePrice: 32, stock: 0, minStock: 5, gst: 0 },

  // ───────────────────────────────
  // अन्य ज़रूरी सामान
  // ───────────────────────────────
  { hindiName: "माचिस", name: "Matchbox", category: "अन्य", unit: "नग", mrp: 2, purchasePrice: 1.5, stock: 0, minStock: 20, gst: 18 },
  { hindiName: "अगरबत्ती", name: "Agarbatti", category: "अन्य", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 5, gst: 12 },
  { hindiName: "मोमबत्ती", name: "Mombatti", category: "अन्य", unit: "नग", mrp: 20, purchasePrice: 15, stock: 0, minStock: 5, gst: 12 },
  { hindiName: "पॉलीथीन बैग", name: "Polythene Bag", category: "अन्य", unit: "नग", mrp: 10, purchasePrice: 7, stock: 0, minStock: 10, gst: 18 },
  { hindiName: "बाल्टी 10L", name: "Balti 10L", category: "अन्य", unit: "नग", mrp: 120, purchasePrice: 95, stock: 0, minStock: 2, gst: 18 },
  { hindiName: "सेल बैटरी AA", name: "Battery AA", category: "अन्य", unit: "नग", mrp: 15, purchasePrice: 10, stock: 0, minStock: 5, gst: 28 },
];

export async function seedItemsForUser(userId) {
  const toInsert = SEED_ITEMS.map((item) => ({
    userId,
    name: item.name,
    hindiName: item.hindiName,
    category: item.category,
    brand: item.brand || null,
    unit: item.unit,
    mrp: item.mrp,
    purchasePrice: item.purchasePrice,
    stock: 0,
    minStock: item.minStock,
    barcode: null,
    gst: item.gst,
    hsn: null,
    expiry: null,
    active: 1,
  }));

  await db.insert(items).values(toInsert);
}