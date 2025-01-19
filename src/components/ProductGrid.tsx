import { useEffect, useState } from 'react';
import { TrackingPixel } from './TrackingPixel';
import { supabase } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      let query = supabase.from('products').select('*');
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setProducts(data as Product[]);
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category))) as string[];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    // Trigger the click event on product interaction
    trackActivity('click', product.id);
  };

  const handleHover = (productId: string) => {
    trackActivity('hover', productId);
  };

  const trackActivity = async (type: 'view' | 'hover' | 'click', productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_activities').insert({
        user_id: user.id,
        product_id: productId,
        activity_type: type
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${!selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
            onClick={() => handleProductClick(product)}
            onMouseEnter={() => handleHover(product.id)}
            onMouseLeave={() => handleHover(product.id)}
          >
            <TrackingPixel productId={product.id} />
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                {product.category}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <div className="flex items-center text-sm text-gray-500">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  View Details
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
