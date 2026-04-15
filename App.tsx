import React, { useState, useMemo, useEffect } from 'react';
import Auth from './components/Auth';
import type { Product, CartItem, BusinessProfile } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import { Logo } from './components/icons/Logo';
import About from './components/About';
import AdminApp from './components/admin/AdminApp';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import { Spinner } from './components/icons/Spinner';
import * as SupabaseService from './supabaseService';
import PaymentStatusPage from './components/PaymentStatusPage';
import { supabase, initError, isDemoMode } from './supabaseClient';


import BusinessProfileView from './components/BusinessProfileView';

export type View = 'products' | 'checkout' | 'about' | 'payment-status' | 'business-auth' | 'business-profile';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('products');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [paymentStatusParams, setPaymentStatusParams] = useState<{ paymentID: string; status: string } | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    console.log("User state updated:", user?.email);
  }, [user]);

  useEffect(() => {
    // Check for bKash redirect parameters on initial load
    const params = new URLSearchParams(window.location.search);
    const paymentID = params.get('paymentID');
    const status = params.get('status');

    if (paymentID && status) {
      setPaymentStatusParams({ paymentID, status });
      setCurrentView('payment-status');
      // Clean the URL
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      fetchProducts();
    }

    // Auth Listener - Guarded
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (supabase && !initError && supabase.auth && typeof supabase.auth.onAuthStateChanged === 'function') {
      try {
        console.log("Setting up auth listener...");
        
        // Initial session check
        if (typeof supabase.auth.getSession === 'function') {
          supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("Initial session check result:", session?.user?.email);
            if (session?.user) {
              setUser(session.user);
              SupabaseService.getBusinessProfile(session.user.id).then(profile => {
                console.log("Initial profile fetch result:", profile?.businessName);
                setBusinessProfile(profile);
              });
            }
          });
        }

        const { data } = supabase.auth.onAuthStateChanged(async (event, session) => {
          console.log("Auth event fired:", event, "User:", session?.user?.email);
          if (session?.user) {
            setUser(session.user);
            const profile = await SupabaseService.getBusinessProfile(session.user.id);
            console.log("Profile updated from event:", profile?.businessName);
            setBusinessProfile(profile);
          } else {
            console.log("No user in auth event, clearing state");
            setUser(null);
            setBusinessProfile(null);
          }
        });
        subscription = data?.subscription;
      } catch (err) {
        console.error("Failed to set up auth listener:", err);
      }
    } else {
      console.warn("Auth listener skipped. Supabase:", !!supabase, "initError:", initError);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await SupabaseService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products.';
      console.error(err);
      setError(`Error: ${errorMessage}. Please check your Supabase configuration and database table.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (newProductData: Omit<Product, 'id'>, images: File[]) => {
    try {
      await SupabaseService.addProduct(newProductData, images);
      await fetchProducts(); // Refetch to show the new product
    } catch (err) {
      alert(`Failed to add product: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product, newImages: File[]) => {
    try {
      await SupabaseService.updateProduct(updatedProduct, newImages);
      await fetchProducts(); // Refetch
    } catch (err) {
      alert(`Failed to update product: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteProduct = async (productId: number | string) => {
    try {
      await SupabaseService.deleteProduct(productId);
      await fetchProducts(); // Refetch
    } catch (err) {
      alert(`Failed to delete product: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item.id === product.id);
      if (exist) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number | string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };
  
  const handleBackToProducts = () => {
    setCurrentView('products');
  }

  const handleOrderPlaced = async (customerDetails: { name: string, phone: string, address: string, paymentMethod: string }) => {
    const newOrder = await SupabaseService.placeOrder(customerDetails, cartItems);
    console.log("Order Placed, ID:", newOrder.id);
    return newOrder;
  }
  
  const handlePaymentSuccess = () => {
      setIsOrderConfirmed(true);
  }

  const handleCloseConfirmation = () => {
    setIsOrderConfirmed(false);
    setCartItems([]);
    setCurrentView('products');
  }

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  }

  const refreshAuth = async () => {
    console.log("Manually refreshing auth state...");
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (freshUser) {
      console.log("Manual refresh found user:", freshUser.email);
      setUser(freshUser);
      const profile = await SupabaseService.getBusinessProfile(freshUser.id);
      setBusinessProfile(profile);
    } else {
      console.log("Manual refresh found no user");
      setUser(null);
      setBusinessProfile(null);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      setCurrentView('business-profile');
    } else {
      setCurrentView('business-auth');
    }
  };
  
  const heroPattern = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3e%3cpath d='M20 0c-10 10-10 30 0 40s30 30 40 40M60 0c-10 10-10 30 0 40s30 30 40 40M0 20c10-10 30-10 40 0s30 30 40 40M0 60c10-10 30-10 40 0s30 30 40 40' stroke-width='1.5' stroke='%23B8860B' fill='none'/%3e%3c/svg%3e")`;


  if (showAdmin) {
    return (
      <AdminApp 
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onExitAdmin={() => setShowAdmin(false)} 
        isLoading={isLoading}
      />
    );
  }

  const renderContent = () => {
    if (isLoading && products.length === 0 && currentView !== 'payment-status') {
      return <Spinner />;
    }

    if (error) {
       return (
        <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Something went wrong! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }

    switch (currentView) {
      case 'products':
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-8">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onViewProduct={() => setSelectedProduct(product)}
                />
              ))}
            </div>
        );
      case 'checkout':
        return (
          <Checkout 
            cartItems={cartItems} 
            onBack={handleBackToProducts}
            onPlaceOrder={handleOrderPlaced}
            onPaymentSuccess={handlePaymentSuccess}
            businessProfile={businessProfile}
          />
        );
      case 'about':
        return <About />;
      case 'business-auth':
        return (
          <Auth 
            onAuthSuccess={async () => {
              await refreshAuth();
              setCurrentView('products');
            }} 
            onBack={() => setCurrentView('products')} 
          />
        );
      case 'business-profile':
        return user ? (
          <BusinessProfileView 
            profile={businessProfile} 
            user={user}
            onLogout={() => {
              setUser(null);
              setBusinessProfile(null);
              setCurrentView('products');
            }} 
            onBack={handleBackToProducts} 
          />
        ) : null;
      case 'payment-status':
        if (!paymentStatusParams) return <Spinner />;
        return (
          <PaymentStatusPage
            paymentID={paymentStatusParams.paymentID}
            status={paymentStatusParams.status}
            onSuccess={handlePaymentSuccess}
            onDone={handleCloseConfirmation}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen antialiased relative flex flex-col">
      {isDemoMode && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold animate-pulse sticky top-0 z-50">
          Demo Mode: Supabase credentials missing. <span className="underline cursor-pointer" onClick={() => alert("To use real data, go to Settings and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See supabase-schema.sql for the database setup.")}>How to fix?</span>
        </div>
      )}
      <Header 
        cartItemCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
        isLoggedIn={!!user}
        onAuthClick={handleAuthClick}
      />
      
      {currentView === 'products' && (
         <div 
            className="w-full h-[50vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden bg-slate-900"
         >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
                 <div className="max-w-md mx-auto mb-8">
                   <Logo />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight">
                    The Future of Sustainable <span className="text-emerald-400">B2B Sourcing</span>
                 </h2>
                 <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                    Connecting large manufacturing factories with independent designers and small clothing brands.
                 </p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                   {!user && (
                     <button 
                      onClick={() => setCurrentView('business-auth')}
                      className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                     >
                       Register Your Business
                     </button>
                   )}
                   <button 
                    onClick={() => setCurrentView('about')}
                    className={`px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm ${!user ? '' : 'w-full sm:w-auto'}`}
                   >
                     Learn Our Model
                   </button>
                 </div>
            </div>
         </div>
      )}
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <Footer onGoToAdmin={() => setShowAdmin(true)} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {
            addToCart(selectedProduct);
            setSelectedProduct(null);
          }}
        />
      )}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      {isOrderConfirmed && (
        <OrderConfirmationModal onClose={handleCloseConfirmation} />
      )}

      {/* Debug Overlay - Visible only for troubleshooting */}
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-white p-4 rounded-2xl text-[10px] font-mono pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
        <div>User: {user?.email || 'null'}</div>
        <div>Profile: {businessProfile?.businessName || 'null'}</div>
        <div>View: {currentView}</div>
        <div>Demo: {isDemoMode ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}

export default App;