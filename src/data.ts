import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
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
  { id: "p4", category: "Pizzas & Pastas", name: "Fiery Arabiatta Penne Pasta", price: 240, rating: 4.9, tags: ["Spicy", "Vegan"], desc: "Fresh penne tossed in rich spicy red plum tomato marinara, garlic, fresh basil, olive oil, and chilli flakes." },

  // MEALS & SIZZLERS
  { id: "m1", category: "Sizzlers & Meals", name: "Tip Top Shahi Platter", price: 390, rating: 4.9, tags: ["Best Seller"], desc: "Sizzling skillet consisting of Premium Paneer Butter Masala, aromatic saffron jeera rice, butter naan slices, dynamic salad, and roasted papad." },
  { id: "m2", category: "Sizzlers & Meals", name: "Cheesy Baked Lasagna Feast", price: 310, rating: 4.8, tags: ["Indulgent"], desc: "Layered gourmet Italian sheets packed with Mediterranean vegetables, creamy Béchamel sauce, spicy red marinara, and double-crust cheese baked golden." },

  // DESSERTS
  { id: "d1", category: "Divine Desserts", name: "Volcanic Hot Chocolate Lava Cake", price: 160, rating: 5.0, tags: ["Chef Special"], desc: "Warm dense cocoa bundt filled with gooey, oozing chocolate ganache center. Served with a premium fresh mint sprig." },
  { id: "d2", category: "Divine Desserts", name: "Sizzling Velvet Brownie supreme", price: 220, rating: 4.9, tags: ["Must Try"], desc: "Fresh double-fudge walnut brownie served on a piping hot skillet, drenched in rich dark chocolate ganache, topped with cream vanilla scoop." }
];

export const CATEGORIES = [
  "All Dishes",
  "Coffee & Shakes",
  "Appetizers & Fusion",
  "Pizzas & Pastas",
  "Sizzlers & Meals",
  "Divine Desserts"
];

export const CAFE_GALLERY = [
  {
    title: "Plush Velvet Lounges",
    desc: "Cozy suede sofas under warm ambient starburst light fixtures.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Chic Neon Branding",
    desc: "Neon highlights reading 'It Happens Over' cozy coffee tables",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Artisanal Brew Station",
    desc: "Where Gadarwara's finest beans meet professional baristas.",
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
  }
];

export const AUTHENTIC_REVIEWS = [
  {
    id: 1,
    name: "Aman Agarwal",
    rating: 5,
    text: "Best food in gadarwara Come and visit to this place in front of comfort hotel. The Oreoshake is out of this world and table service is incredibly quick!",
    date: "2 days ago",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aman&backgroundColor=0e7490"
  },
  {
    id: 2,
    name: "Shruti Dubey",
    rating: 5,
    text: "Very nice food and very nice service. The loaded pizza and hot sizzling brownie had us speechless. Ambience is super perfect for couples and family.",
    date: "1 week ago",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Shruti&backgroundColor=ec4899"
  },
  {
    id: 3,
    name: "Vikram Bundela",
    rating: 5,
    text: "Nice Food and nice ambience. Hands down the highest quality hangout cafe in Gadarwara Patlon area near Hospital Road. Totally recommend their garlic pull-apart bread!",
    date: "3 weeks ago",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Vikram&backgroundColor=e11d48"
  },
  {
    id: 4,
    name: "Devansh Lamaniya",
    rating: 5,
    text: "Outstanding premium decor, beautiful custom lighting, and absolute 10/10 service. Perfect place to celebrate birthdays. Love the Szechuan paneer sliders!",
    date: "1 month ago",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Devansh&backgroundColor=84cc16"
  }
];

export const HERO_HIGHLIGHTS = [
  {
    title: "5.0 Rating Gold Standard",
    desc: "A perfect 5.0 star average rating on Google reflecting premium taste and service."
  },
  {
    title: "Midnight Velvet Decor",
    desc: "Elegant deep dark ceilings, chic teal-tint suede chairs, and warm neon glows."
  },
  {
    title: "₹600–800 Dining Luxury",
    desc: "A highly premium culinary experience tailored with generous portions and budget value."
  }
];
