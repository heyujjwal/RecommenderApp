import  { useEffect, useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

interface Discount {
  discount_percent: number;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [discount, setDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      // Track detailed view
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_activities').insert({
          user_id: user.id,
          product_id: product.id,
          activity_type: 'detailed_view'
        });
      }

      // Load related products
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(3);

      if (related) setRelatedProducts(related);

      // Load discount
      const { data: discountData } = await supabase
        .from('discounts')
        .select('discount_percent')
        .eq('product_id', product.id)
        .eq('active', true)
        .single();

      if (discountData) setDiscount(discountData);
    };

    loadRelatedProducts();
  }, [product]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-gray-600">{product.description}</p>
          
          <div className="mt-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {discount && (
                <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {discount.discount_percent}% OFF
                </span>
              )}
            </div>
            <span className="mt-2 block text-sm text-gray-500">
              Category: {product.category}
            </span>
          </div>

          <button className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  window.scrollTo(0, 0);
                  onClose();
                  setTimeout(() => {
                    window.location.href = `#product-${relatedProduct.id}`;
                  }, 100);
                }}
              >
                <img
                  src={relatedProduct.image_url}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h3 className="mt-4 text-lg font-semibold">{relatedProduct.name}</h3>
                <p className="mt-2 text-gray-600">${relatedProduct.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}