export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  }
  
  export interface Discount {
    discount_percent: number;
  }