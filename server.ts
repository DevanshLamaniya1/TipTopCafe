import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Table Status Database
// Includes pre-scheduled bookings for a realistic feel
interface Table {
  id: number;
  name: string;
  capacity: number;
  type: "sofa" | "window" | "neon" | "regular";
  position: { x: number; z: number }; // For 3D floor plan layout
  reservations: {
    name: string;
    phone: string;
    time: string;
    guests: number;
  }[];
}

let tables: Table[] = [
  {
    id: 1,
    name: "T-1 (Window Alcove)",
    capacity: 2,
    type: "window",
    position: { x: -3, z: -3 },
    reservations: [
      { name: "Aarav Sharma", phone: "+91 98765 43210", time: "12:00 PM", guests: 2 }
    ]
  },
  {
    id: 2,
    name: "T-2 (Premium Suede Sofa)",
    capacity: 4,
    type: "sofa",
    position: { x: -3, z: 0 },
    reservations: []
  },
  {
    id: 3,
    name: "T-3 (Premium Suede Sofa)",
    capacity: 4,
    type: "sofa",
    position: { x: -3, z: 3 },
    reservations: [
      { name: "Priya Patel", phone: "+91 88888 77777", time: "07:30 PM", guests: 4 }
    ]
  },
  {
    id: 4,
    name: "T-4 (Couples Retreat)",
    capacity: 2,
    type: "regular",
    position: { x: 0, z: -2 },
    reservations: []
  },
  {
    id: 5,
    name: "T-5 (Grande Banquet)",
    capacity: 6,
    type: "regular",
    position: { x: 0, z: 2 },
    reservations: [
      { name: "Verma Family Reunion", phone: "+91 99112 23344", time: "01:00 PM", guests: 6 }
    ]
  },
  {
    id: 6,
    name: "T-6 (Neon Corner Lounge)",
    capacity: 4,
    type: "neon",
    position: { x: 3, z: -3 },
    reservations: []
  },
  {
    id: 7,
    name: "T-7 (Neon Corner Lounge)",
    capacity: 4,
    type: "neon",
    position: { x: 3, z: 0 },
    reservations: []
  },
  {
    id: 8,
    name: "T-8 (Executive Alcove)",
    capacity: 2,
    type: "window",
    position: { x: 3, z: 3 },
    reservations: []
  }
];

// Cafe Menu Data definition
const MENU_ITEMS = [
  // COFFEE & SHAKES
  { id: "c1", category: "Coffee & Shakes", name: "Tip Top Special Cold Coffee", price: 180, rating: 4.9, tags: ["Best Seller", "Signature"], desc: "Rich double-espresso blended with premium vanilla cream, chocolate swirls, and topped with chocolate crumbs. Thick, silky, and energetic." },
  { id: "c2", category: "Coffee & Shakes", name: "Hazelnut Suede Latte", price: 160, rating: 4.8, tags: ["Hot Coffee"], desc: "Steamed velvety milk with single estate espresso and roasted hazelnut syrup, dusted with organic cocoa powder." },
  { id: "c3", category: "Coffee & Shakes", name: "Oreo Mud Cookie Thickshake", price: 190, rating: 5.0, tags: ["Must Try"], desc: "A colossal blend of Oreo cookies, deep cocoa fudge, organic cow milk, and double scoop premium dark vanilla bean ice cream." },
  { id: "c4", category: "Coffee & Shakes", name: "Crimson Watermelon Mojito", price: 150, rating: 4.7, tags: ["Refreshing"], desc: "Fresh watermelon chunks muddled with native mint leaves, dynamic lime juice, and carbonated water over crushed crystalline ice." },

  // APPETIZERS
  { id: "a1", category: "Appetizers & Fusion", name: "Double Cheese Garlic Pull-apart", price: 175, rating: 4.9, tags: ["Best Seller"], desc: "Fresh house-baked sourdough infused with herb butter, pure minced roast garlic, and packed tightly with molten mozzarella." },
  { id: "a2", category: "Appetizers & Fusion", name: "Tip Top Szechuan Paneer Sliders", price: 210, rating: 4.8, tags: ["Spicy"], desc: "Mini crisp buns filled with pan-seared malai paneer cubes tossed in house hot szechuan sauce, spicy raw slaw, and cooling mint mayo." },
  { id: "a3", category: "Appetizers & Fusion", name: "Stuffed Crunchy Mushroom Caps", price: 195, rating: 4.6, tags: ["Chef Special"], desc: "Baked giant field mushrooms stuffed with cheese, fine chopped bell peppers, spinach, and crisp-fried to golden perfection." },

  // PIZZA & PASTA
  { id: "p1", category: "Pizzas & Pastas", name: "Loaded Garden Volcano Pizza (10\")", price: 340, rating: 5.0, tags: ["Signature", "Cheesy"], desc: "Crisp hand-tossed base loaded with molten hot cheese, capsicum, wild corn, red onions, black olives, jalapenos, and a splash of fire sauce." },
  { id: "p2", category: "Pizzas & Pastas", name: "Sautéed Mushroom Pizza (10\")", price: 320, rating: 4.7, tags: ["Classic"], desc: "Earthy sautéed button mushrooms, caramelised brown onions, roasted garlic cloves, premium marinara, and fresh performance mozzarella." },
  { id: "p3", category: "Pizzas & Pastas", name: "Rich White Suede Pasta Alfredo", price: 260, rating: 4.8, tags: ["Italian"], desc: "Al dente penne pasta drenched in thick butter and cream reduction, infused with rich garlic, grated Parmesan, and sautéed green capsicums." },
  { id: "p4", category: "Pizzas & Pastas", name: "Fiery Arabiatta Penne Pasta", price: 240, rating: 4.9, tags: ["Spicy", "Vegan Adaptable"], desc: "Fresh penne tossed in rich spicy red plum tomato marinara, garlic, fresh basil, olive oil, and chilli flakes." },

  // MEALS & SIZZLERS
  { id: "m1", category: "Sizzlers & Meals", name: "Tip Top Shahi Platter", price: 390, rating: 4.9, tags: ["Best Seller"], desc: "Sizzling skillet consisting of Premium Paneer Butter Masala, aromatic saffron jeera rice, butter naan slices, dynamic salad, and roasted papad." },
  { id: "m2", category: "Sizzlers & Meals", name: "Cheesy Baked Lasagna Feast", price: 310, rating: 4.8, tags: ["Indulgent"], desc: "Layered gourmet Italian sheets packed with Mediterranean vegetables, creamy Béchamel sauce, spicy red marinara, and double-crust cheese baked golden." },

  // DESSERTS
  { id: "d1", category: "Divine Desserts", name: "Volcanic Hot Chocolate Lava Cake", price: 160, rating: 5.0, tags: ["Chef Special"], desc: "Warm dense cocoa bundt filled with gooey, oozing chocolate ganache center. Served with a premium fresh mint sprig." },
  { id: "d2", category: "Divine Desserts", name: "Sizzling Velvet Brownie supreme", price: 220, rating: 4.9, tags: ["Must Try"], desc: "Fresh double-fudge walnut brownie served on a piping hot skillet, drenched in rich dark chocolate ganache, topped with cream vanilla scoop." }
];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ------------------- API ROUTES -------------------

// 1. Fetch tables layout and status
app.get("/api/tables", (req, res) => {
  res.json(tables);
});

// 2. Book a table
app.post("/api/tables/book", (req, res) => {
  const { tableId, name, phone, time, guests } = req.body;

  if (!tableId || !name || !phone || !time || !guests) {
    return res.status(400).json({ error: "Missing required fields for reservation" });
  }

  const table = tables.find((t) => t.id === parseInt(tableId));
  if (!table) {
    return res.status(404).json({ error: "Table not found." });
  }

  // Check capacity
  if (guests > table.capacity) {
    return res.status(400).json({
      error: `Guests count exceeds the maximum seating capacity of ${table.capacity} for this table.`
    });
  }

  // Check if same slot is taken by active bookings in memory (to prevent double bookings)
  const isConflict = table.reservations.some(
    (resv) => resv.time.toLowerCase() === time.toLowerCase()
  );

  if (isConflict) {
    return res.status(400).json({
      error: "This table is already reserved for the selected time. Please choose another time or table."
    });
  }

  const newReservation = { name, phone, time, guests: parseInt(guests) };
  table.reservations.push(newReservation);

  res.json({
    success: true,
    message: `Table ${table.id} (${table.name}) reserved successfully for ${name} at ${time}.`,
    table: table
  });
});

// 3. Clear reservations (For Reset / Testing demo purposes)
app.post("/api/tables/reset", (req, res) => {
  tables = tables.map((t) => {
    // Keep initial standard simulated reservations but clear test ones
    if (t.id === 1) {
      t.reservations = [{ name: "Aarav Sharma", phone: "+91 98765 43210", time: "12:00 PM", guests: 2 }];
    } else if (t.id === 3) {
      t.reservations = [{ name: "Priya Patel", phone: "+91 88888 77777", time: "07:30 PM", guests: 4 }];
    } else if (t.id === 5) {
      t.reservations = [{ name: "Verma Family Reunion", phone: "+91 99112 23344", time: "01:00 PM", guests: 6 }];
    } else {
      t.reservations = [];
    }
    return t;
  });
  res.json({ success: true, message: "Demo tables reset successfully", tables });
});

// 4. API for Gemini Conversational Support
app.post("/api/chat", async (req, res) => {
  const { messages, currentCart, selectedTableId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  if (!ai) {
    return res.status(500).json({
      error: "Gemini API Client is not configured. Please add GEMINI_API_KEY."
    });
  }

  // Construct a robust prompt explaining Gadarwara context, menu, tables, and rules.
  const tablesDump = tables.map(t => {
    const rNames = t.reservations.map(r => `${r.name} at ${r.time} (${r.guests} guests)`).join(", ");
    return `- Table ${t.id} (${t.name}): Capacity=${t.capacity}, Type=${t.type}. Booked: [${rNames || "Available"}]`;
  }).join("\n");

  const menuDump = MENU_ITEMS.map(i => {
    return `- [${i.category}] ${i.name} [ID:${i.id}] - ₹${i.price} (Rating: ${i.rating}): ${i.desc}`;
  }).join("\n");

  const systemInstruction = `You are "Tip Top AI", the extremely warm, hospitable, and highly intelligent digital concierge of "TIP TOP CAFE" in Gadarwara, Patlon, Madhya Pradesh, India.
Your mission is to provide an immersive, premium, and welcoming booking and dining counseling experience. Speak with genuine enthusiasm, elegance, and stellar customer service. Avoid robotic or dry language.

RESTAURANT KNOWLEDGE:
- Name: TIP TOP CAFE
- Rating: 5.0 (26 Reviews of pure customer satisfaction!)
- Price Range: ₹600-800 for two people - very premium but accessible.
- Opening Hours: Closed now, Opens 11:00 AM. Daily: 11:00 AM to 11:00 PM.
- Address: Hospital road, in front of hotel comfort, Gadarwara, Patlon, Madhya Pradesh 487551. (Local landmarks: "Opposite Comfort Hotel" or "Near Hospital Road").
- Contact Number: 079749 69007 (WhatsApp/Call).
- Authentic Reviews:
  * "Very nice food and very nice service"
  * "Best food in gadarwara Come and visit to this place in front of comfort hotel"
  * "Nice Food and nice ambience"
- Atmosphere: Dark velvet dining chairs, premium suede seating, wooden cozy panel design, marble white gloss tables with black accent framing, gorgeous modern branching chandelier lights, and warm custom neon branding signs. It's the ultimate visual landmark Cafe in Gadarwara.

CAFE MENU:
${menuDump}

REAL-TIME FLOOR LAYOUT & BOOKINGS (CURRENT STATE IN OUR DATABASE):
${tablesDump}

GUIDELINES FOR CHATTING / SUPPORT:
1. RECOMMEND dishes with culinary interest! (Describe ingredients, sensory tastes - like the sizzling hot skillet of Sizzling Velvet Brownie or the thick Oreo cookie chunks).
2. HELP WITH TABLE BOOKINGS: If the user asks if a table is available, check the live floor state above. Recommend the perfect table based on guest size!
   - Under 2 guests: Table 1 (window cozy view), Table 4 (couples retreat), Table 8 (executive corner).
   - Under 4 guests: Table 2 or 3 (premium plush suede sofas), Table 6 or 7 (neon corner views).
   - Groups up to 6 guests: Table 5 (Grande Banquet).
3. If they want to reserve, tell them they can easily click on the interactive 3D table layout in the "Book Table" section on this website, or ask you to book it.
4. ORDERING: They have a live cart. If they ask about orders or placing an order, tell them they can add menu items to their cart on this website and click "Order via WhatsApp" to send their finalized list to the kitchen instantly.
5. KEEP IT COMPACT: Keep your responses highly conversational, friendly, and readable. Use brief paragraphs, clean bold tags, and bullet points.
6. CONTACT PREPARATION: If they need direct human support, present the contact details beautifully. Let them know they can click the floating support/reservation button to launch WhatsApp or a reserve link easily.`;

  try {
    // Map existing message format to Gemini's expected contents structure
    // We can use a simple general generating task, but let's send previous chat history
    // mapped to { role, parts: [{ text }] }
    // Gemini API format for roles is "user" or "model" (Note: "assistant" is mapped to "model")
    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role: role,
        parts: [{ text: m.content }]
      };
    });

    // Append context of current cart and selection if relevant
    const contextAddendum = `[System Information for Context: The user is currently browsing. Selected Table currently: ${
      selectedTableId ? `Table ${selectedTableId}` : "None"
    }. Items currently in their shopping cart: ${
      currentCart && currentCart.length > 0
        ? currentCart.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(", ")
        : "Empty"
    }]. Please address the user naturally without explicitly saying "Based on the system information context". Use it only as contextual awareness.`;

    // Put context addendum into user's very last message or as a clean model primer
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents[contents.length - 1].parts[0].text += `\n\n${contextAddendum}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({
      reply: response.text || "Hello! How can I assist you with Gadarwara's Tip Top Cafe today?"
    });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({
      error: "Failed to generate AI response.",
      details: error.message
    });
  }
});

// Serve frontend assets & Boot Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tip Top Cafe Server] Server booted on http://localhost:${PORT}`);
  });
}

startServer();
