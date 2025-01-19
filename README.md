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
- Vercel: For frontend deployment

## Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/heyujjwal/RecommenderApp.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and include the following:
```env
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_SUPABASE_URL=your-supabase-url
```

### 4. Start the App

```bash
npm run dev
```

### 5. Access the App
- Locally Visit http://localhost:5173

## Folder Structure
```bash
RecommenderApp/
|   ├── node_modules
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/supabase.ts
│   │   ├── App.tsx      # Root app component
│   │   └── main.tsx    # React entry point
│   └── package.json     # dependencies
|   |___supabase/
|       ├── migration/   # database tables setup and integration
└── README.md            # Documentation
```

## Key Functionalities

### 1. Tracking Pixel
The tracking pixel logs user activity (views, hovers, click/detailed_view) via an invisible React component.


### 2. Dynamic Recommendations
Recommendations are generated based on user activity stored in the supabase database.

### 3. Popup with Discounts
The popup dynamically shows recommended products with configurable discounts.

## Screenshots
SignIn/SignUP:
![image](https://github.com/user-attachments/assets/fb15a928-b637-4c2a-9671-eec373a9b13f)
HomePage:
![image](https://github.com/user-attachments/assets/413051cc-63b5-42e9-a1d1-2c90ca166f4e)

1. User Activity Tracking
![image](https://github.com/user-attachments/assets/2ee307bb-9633-4fcc-b960-5762a7fcfc7d)

2. Product Recommendations
![image](https://github.com/user-attachments/assets/58ed4a01-88fa-4d02-8342-b8abacd44371)

3. Popup with Discounts
![image](https://github.com/user-attachments/assets/48a72f02-d66e-4320-aba8-3a0c34591c27)

## Configuration

### 1. Discount Value
Update the discount percentage:
```ts
const discountValue = 10; // Adjustable by the owner of DB
```

### 2. Popup Trigger
Modify the conditions for showing the popup in the frontend

## Demo
[Link to Live Demo](https://recommender-app-omega.vercel.app/)


## Contributing
Feel free to contribute! Fork the repository and create a pull request for any enhancements or fixes.

## License
This project is licensed under the MIT License.
