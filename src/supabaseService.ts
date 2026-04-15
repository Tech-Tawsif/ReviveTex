import { supabase, initError } from './supabaseClient';
import type { Product, CartItem, Order, NewOrderResponse, BusinessProfile } from './types';

const checkSupabase = () => {
    if (initError) throw new Error(`Supabase initialization error: ${initError}`);
    if (!supabase) throw new Error("Supabase is not initialized correctly. Please check your configuration in supabaseClient.ts.");
}

// Helper to upload images and get their public URLs
const uploadImages = async (files: File[]): Promise<string[]> => {
    checkSupabase();
    const urls: string[] = [];
    for (const file of files) {
        // Use a more robust naming convention to avoid collisions
        const filePath = `public/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images') // Assumes a bucket named 'product-images'
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error(`Image upload failed: ${uploadError.message}. Ensure your bucket 'product-images' is public and policies are set correctly.`);
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
        
        urls.push(data.publicUrl);
    }
    return urls;
};


// Get all products, sorted by creation date
export const getProducts = async (): Promise<Product[]> => {
    checkSupabase();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Failed to fetch products: ${error.message}. Check your table name and RLS policies.`);
    }
    // Map Supabase's snake_case to our camelCase and ensure types are correct
    return data.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        imageUrls: Array.isArray(p.imageurls) ? p.imageurls : [],
        moq: p.moq || 1,
        stockType: p.stock_type || 'semi-bulk',
        createdAt: p.created_at,
    })) as Product[];
};

// Add a new product
export const addProduct = async (productData: Omit<Product, 'id'>, images: File[]): Promise<void> => {
    checkSupabase();
    const imageUrls = await uploadImages(images);
    
    // Destructure to remove camelCase fields that don't exist in the DB
    const { stockType, imageUrls: _, ...rest } = productData;

    const payload = { 
        ...rest, 
        imageurls: imageUrls,
        stock_type: stockType 
    };

    console.log('Attempting to insert product:', payload);

    const { error } = await supabase
        .from('products')
        .insert([payload]);
    
    if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error(`Failed to add product: ${error.message}. Details: ${JSON.stringify(error)}`);
    }
};

// Update an existing product
export const updateProduct = async (updatedProduct: Product, newImages: File[]): Promise<void> => {
    checkSupabase();
    const newImageUrls = newImages.length > 0 ? await uploadImages(newImages) : [];

    const { id, createdAt, stockType, imageUrls: _, ...rest } = updatedProduct;

    const payload = { 
        ...rest, 
        stock_type: stockType,
        imageurls: [...updatedProduct.imageUrls, ...newImageUrls] 
    };

    const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        throw new Error(`Failed to update product: ${error.message}. Details: ${JSON.stringify(error)}`);
    }
};

// Delete a product
export const deleteProduct = async (productId: string | number): Promise<void> => {
    checkSupabase();
    // Note: You might want to delete associated images from storage here as well.
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
    
    if (error) {
        console.error('Error deleting product:', error);
        throw new Error(`Failed to delete product: ${error.message}.`);
    }
};

// Place an order
export const placeOrder = async (
    customerDetails: { name: string, phone: string, address: string, paymentMethod: string },
    cartItems: CartItem[]
): Promise<NewOrderResponse> => {
    checkSupabase();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Align with DB column name 'paymentmethod'
    const { paymentMethod, ...restDetails } = customerDetails;
    
    const orderData = {
        ...restDetails,
        paymentmethod: paymentMethod,
        items: cartItems, // Storing full cart item details in jsonb
        subtotal: subtotal,
        status: 'pending', // Default status
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select('id, subtotal').single();
    
    if (error) {
        console.error('Error placing order:', error);
        throw new Error(`Failed to place order: ${error.message}. Ensure the 'orders' table exists and RLS policies are permissive for inserts.`);
    }

    return data;
};


// Get all orders
export const getOrders = async (): Promise<Order[]> => {
    checkSupabase();
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(`Failed to fetch orders: ${error.message}. Check your 'orders' table RLS policies.`);
    }
    
    return data.map(o => ({
        id: o.id,
        createdAt: o.created_at,
        businessId: o.business_id,
        name: o.name,
        phone: o.phone,
        address: o.address,
        paymentMethod: o.paymentmethod,
        items: o.items,
        subtotal: o.subtotal,
        status: o.status,
    })) as Order[];
};

// --- Business Profile Logic ---

export const getBusinessProfile = async (userId: string): Promise<BusinessProfile | null> => {
    checkSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching business profile:', error);
        throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return {
        id: data.id,
        businessName: data.business_name,
        ownerName: data.owner_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        location: data.location,
        businessType: data.business_type,
        isVerified: data.is_verified,
        createdAt: data.created_at,
    };
};

export const createBusinessProfile = async (profile: Omit<BusinessProfile, 'createdAt' | 'isVerified'>): Promise<void> => {
    checkSupabase();
    const { error } = await supabase
        .from('profiles')
        .insert([{
            id: profile.id,
            business_name: profile.businessName,
            owner_name: profile.ownerName,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            location: profile.location,
            business_type: profile.businessType,
            is_verified: false
        }]);

    if (error) {
        console.error('Error creating business profile:', error);
        throw new Error(`Failed to create profile: ${error.message}`);
    }
};
