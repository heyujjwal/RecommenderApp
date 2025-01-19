import { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Discount } from '../types';

interface RecommendationPopupProps {
  onProductSelect: (product: Product) => void;
}

export const RecommendationPopup = ({ onProductSelect }: RecommendationPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDiscount = async (productId: string) => {
    if (!productId) return;

    try {
      const { data: discountData, error } = await supabase
        .from('discounts')
        .select('discount_percent')
        .eq('product_id', productId)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error loading discount:', error);
        setDiscount(null);
      } else {
        setDiscount(discountData);
      }
    } catch (err) {
      console.error('Error in loadDiscount:', err);
      setDiscount(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let rotationInterval: NodeJS.Timeout;

    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        let finalProducts: Product[] = [];

        if (user) {
          const { data: recommendations, error: recommendationsError } = await supabase
            .from('recommendations')
            .select('product_id')
            .eq('user_id', user.id)
            .order('score', { ascending: false })
            .limit(5);

          if (!recommendationsError && recommendations?.length) {
            const productIds = recommendations.map((r: { product_id: string }) => r.product_id);
            const { data: recommendedProducts, error: productsError } = await supabase
              .from('products')
              .select('*')
              .in('id', productIds);

            if (!productsError && recommendedProducts?.length) {
              finalProducts = recommendedProducts;
            }
          }
        }

        if (!finalProducts.length) {
          const { data: randomProducts, error: randomProductsError } = await supabase
            .from('products')
            .select('*')
            .limit(5);

          if (randomProductsError) {
            throw new Error('Failed to fetch random products');
          }

          if (randomProducts?.length) {
            finalProducts = randomProducts;
          }
        }

        if (isMounted && finalProducts.length > 0) {
          setProducts(finalProducts);
          loadDiscount(finalProducts[0].id);
        } else {
          setError('No products available');
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRecommendations();

    if (products.length > 0) {
      rotationInterval = setInterval(() => {
        setCurrentIndex(current => {
          const nextIndex = (current + 1) % products.length;
          const nextProduct = products[nextIndex];
          if (nextProduct?.id) {
            loadDiscount(nextProduct.id);
          }
          return nextIndex;
        });
      }, 5000);
    }

    return () => {
      isMounted = false;
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [products.length]);

  if (!isVisible) return null;
  if (isLoading) return null;
  if (error) return null;

  const currentProduct = products[currentIndex];
  if (!currentProduct) return null;

  return (
    <div 
      className="fixed lg:bottom-8 lg:right-8 md:bottom-6 md:right-6 bottom-4 right-4 w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl p-6 animate-slide-up z-50"
      onClick={(e) => {
        e.preventDefault();
        onProductSelect(currentProduct);
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close recommendations"
      >
        <X size={20} />
      </button>

      <div className="space-y-4 cursor-pointer">
        <div className="relative aspect-video">
          <img
            src={currentProduct.image_url || '/placeholder-product.jpg'}
            alt={currentProduct.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder-product.jpg';
            }}
          />
          {currentProduct.category && (
            <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {currentProduct.category}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">{currentProduct.name}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{currentProduct.description}</p>
        </div>

        {discount && (
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
            <ShoppingBag className="h-4 w-4 mr-1" />
            {discount.discount_percent}% OFF
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            ${currentProduct.price.toFixed(2)}
          </span>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onProductSelect(currentProduct);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            View Details
          </button>
        </div>

        <div className="flex justify-center space-x-2 pt-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                if (products[index]?.id) {
                  loadDiscount(products[index].id);
                }
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`View product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};