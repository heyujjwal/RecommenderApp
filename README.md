# Product Recommendation App

## Overview
The **Product Recommendation App** is designed to enhance user engagement for eCommerce websites. It achieves this by tracking user activity, leveraging the data to recommend relevant products, and dynamically displaying these recommendations through interactive popups with discount offers.

## Features

### 1. User Activity Tracking Pixel
- Tracks user activities, including views, clicks, and hovers, across the website
- Stores user activity data securely in a backend database for analysis and recommendations

### 2. Product Recommendations
- Dynamically recommends products based on user behavior, such as recently viewed or interacted items
- Delivers personalized suggestions to enhance the shopping experience

### 3. Popup with Discounts
- Displays a popup when a user performs specific actions (e.g., scrolling, clicking, or spending time on the site)
- Popups include a dynamically recommended product with a discount offer
- The discount value is configurable by the website owner for customization

## Tech Stack

### Frontend
- React.js: For building the user interface
- Tailwind CSS: For responsive and modern styling

### Backend
- Node.js with Express.js: To handle API requests and data processing
- Supabase: As the backend-as-a-service for user authentication and database management

### Database
- PostgreSQL (via Supabase): For storing user activity data and product information

### Other Tools
- GitHub: Version control and hosting the repository
- Vercel: For frontend deployment (optional)
- Render/Elastic Beanstalk: For backend deployment (optional)

## Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/product-recommendation-app.git
cd product-recommendation-app
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the backend directory and include the following:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### 4. Start the App

**Frontend:**
```bash
cd frontend
npm start
```

**Backend:**
```bash
cd backend
npm run dev
```

### 5. Access the App
- Frontend: Visit http://localhost:3000
- Backend: Ensure the API is running on http://localhost:5000

## Folder Structure
```bash
product-recommendation-app/
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── styles/      # TailwindCSS styles
│   │   ├── App.tsx      # Root app component
│   │   └── index.tsx    # React entry point
│   └── package.json     # Frontend dependencies
├── backend/
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # Express routes
│   │   └── server.ts    # Express server
│   └── package.json     # Backend dependencies
└── README.md            # Documentation
```

## Key Functionalities

### 1. Tracking Pixel
The tracking pixel logs user activity (views, hovers, clicks) via an invisible React component:

```tsx
useEffect(() => {
  const trackActivity = async () => {
    // API call to log activity
    await axios.post('/api/track', { userId, activityType, productId });
  };
  trackActivity();
}, [activityType, productId]);
```

### 2. Dynamic Recommendations
Recommendations are generated based on user activity stored in the database. Example logic:

```ts
const getRecommendations = async (userId) => {
  const userActivity = await db.getUserActivity(userId);
  return generateRecommendations(userActivity); // Custom recommendation algorithm
};
```

### 3. Popup with Discounts
The popup dynamically shows recommended products with configurable discounts:

```tsx
const [showPopup, setShowPopup] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowPopup(true), 5000); // Show popup after 5 seconds
  return () => clearTimeout(timer);
}, []);

return showPopup && <Popup product={recommendedProduct} discount={10} />;
```

## Screenshots
1. User Activity Tracking
2. Product Recommendations
3. Popup with Discounts

## Configuration

### 1. Discount Value
Update the discount percentage in the backend:
```ts
const discountValue = 10; // Adjustable by the admin
```

### 2. Popup Trigger
Modify the conditions for showing the popup in the frontend:
```tsx
useEffect(() => {
  const onScroll = () => {
    if (window.scrollY > 500) setShowPopup(true);
  };
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

## Demo
[Link to Live Demo]()

## Future Enhancements
- Advanced machine learning algorithms for recommendations
- Multi-language support for global accessibility
- Integration with Google Analytics for detailed insights

## Contributing
Feel free to contribute! Fork the repository and create a pull request for any enhancements or fixes.

## License
This project is licensed under the MIT License.
