// Mock Supabase Client for Demo Mode
// This allows the app to function without real Supabase credentials.

const mockProducts = [
  {
    id: 1,
    name: "Premium Cotton Deadstock",
    description: "High-quality 100% cotton surplus from a major export factory. Perfect for summer collections.",
    price: 450,
    imageUrls: ["https://picsum.photos/seed/cotton/800/1000"],
    moq: 50,
    stock_type: "bulk",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Recycled Denim Rolls",
    description: "Sustainable denim fabric rolls. Durable and eco-friendly.",
    price: 850,
    imageUrls: ["https://picsum.photos/seed/denim/800/1000"],
    moq: 20,
    stock_type: "semi-bulk",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Linen Blend Surplus",
    description: "Breathable linen-cotton blend. Ideal for independent designers.",
    price: 600,
    imageUrls: ["https://picsum.photos/seed/linen/800/1000"],
    moq: 10,
    stock_type: "semi-bulk",
    created_at: new Date().toISOString()
  }
];

export const createMockSupabase = () => {
  return {
    auth: {
      onAuthStateChanged: (callback: any) => {
        // Simulate no user logged in by default
        callback('SIGNED_OUT', null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async () => ({ data: { user: null }, error: new Error("Auth disabled in Demo Mode") }),
      signUp: async () => ({ data: { user: null }, error: new Error("Auth disabled in Demo Mode") }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        order: () => Promise.resolve({ data: table === 'products' ? mockProducts : [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: Date.now(), subtotal: 0 }, error: null }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://picsum.photos/seed/upload/800/1000" } }),
      }),
    },
    functions: {
      invoke: async () => ({ data: { bkashURL: "#" }, error: null }),
    }
  };
};
