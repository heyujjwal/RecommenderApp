import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetails } from './components/ProductDetails';
import { RecommendationPopup } from './components/RecommendationPopup';
import { supabase } from './lib/supabase';
import { Product } from './types/index';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProductSelect = async (product: Product) => {
    setIsLoading(true);
    // Simulate loading to ensure smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    setSelectedProduct(product);
    setShowDetails(true);
    setIsLoading(false);
  };

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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : showDetails && selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onClose={() => {
              setShowDetails(false);
              setSelectedProduct(null);
            }} 
          />
        ) : (
          <ProductGrid onProductSelect={handleProductSelect} />
        )}
      </main>

      <RecommendationPopup onProductSelect={handleProductSelect} />
    </div>
  );
}

export default App;