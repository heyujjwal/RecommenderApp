import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface TrackingPixelProps {
  productId: string;
}

export const TrackingPixel = ({ productId }: TrackingPixelProps) => {
  const trackActivity = useCallback(async (type: 'view' | 'hover' | 'click') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_activities').insert({
          user_id: user.id,
          product_id: productId,
          activity_type: type
        });

        // Update recommendations based on user activity
        const { data: existingRecommendation } = await supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single();

        if (existingRecommendation) {
          // Increase score for existing recommendation
          await supabase
            .from('recommendations')
            .update({ 
              score: existingRecommendation.score + getActivityScore(type),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingRecommendation.id);
        } else {
          // Create new recommendation
          await supabase
            .from('recommendations')
            .insert({
              user_id: user.id,
              product_id: productId,
              score: getActivityScore(type)
            });
        }
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [productId]);

  const getActivityScore = (type: string): number => {
    switch (type) {
      case 'view':
        return 0.1;
      case 'hover':
        return 0.3;
      case 'click':
        return 0.5;
      default:
        return 0.1;
    }
  };

  useEffect(() => {
    trackActivity('view');
  }, [trackActivity, productId]);

  return null;
};
