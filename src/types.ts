export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  rating: number;
  tags: string[];
  desc: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface TableReservation {
  name: string;
  phone: string;
  time: string;
  guests: number;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  type: "sofa" | "window" | "neon" | "regular";
  position: { x: number; z: number };
  reservations: TableReservation[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
