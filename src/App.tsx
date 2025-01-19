import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';  // Import Session type
import { Auth } from './components/Auth';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetails } from './components/ProductDetails';
import { RecommendationPopup } from './components/RecommendationPopup';
import { supabase } from './lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);  // Type the session state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => { // Explicitly type _event and session
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">ShopStore</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        ) : (
          <ProductGrid onProductSelect={setSelectedProduct} />
        )}
      </main>

      <RecommendationPopup selectedProduct={selectedProduct} />
    </div>
  );
}

export default App;
