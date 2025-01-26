# Skincare Shop Management System - Frontend

## Overview  
This repository contains the frontend for the Skincare Shop Management System, built using ReactJS. It provides an intuitive interface for customers, staff, and admins to interact with the system.

## Features  
- **Homepage**: Product display, blog, FAQs, and news.  
- **Skin Testing**: Quiz-based tool to determine skin type.  
- **Product Recommendations**: Personalized suggestions based on skin type.  
- **Feedback Submission**: Customers leave feedback for admin review.
 <!-- - **Order Tracking**: Customers track their orders.   -->  

## Tech Stack  
- **Framework**: ReactJS  
- **Styling**: TailwindCSS  
- **API Integration**: RESTful APIs  
<!-- - **State Management**: Context API or Redux   -->

## Setup Instructions  

### Prerequisites  
Before getting started, ensure you have the following installed on your machine:  
- **[Node.js](https://nodejs.org/)** (LTS version recommended)  
- **npm**
- **Git**

### Installation  
Follow these steps to set up the project locally:  

1. **Clone the Repository**  
   Open a terminal and run:  
   ```bash
   git clone https://github.com/hq-nguyen/BeautySkin.git
   cd BeautySkin
   ```

2. **Install Dependencies**  
   Install the required packages using `npm` (or npm i):  
   ```bash
   npm install
   ```

4. **Add TailwindCSS Configuration Files**  
   If `tailwind.config.js` and `postcss.config.js` are missing, generate them with the following command:  
   ```bash
   npx tailwindcss init -p
   ```

   This will create:
   - **`tailwind.config.js`**: Customize your TailwindCSS setup here. For example:
     ```javascript
     /** @type {import('tailwindcss').Config} */
     export default = {
       content: [
           "./index.html",
           "./src/**/*.{js,jsx,ts,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     };
     ```
   - **`postcss.config.js`**: PostCSS setup:
     ```javascript
     module.exports = {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     };
     ```

5. **Start the Development Server**  
   Run the development server with:  
   ```bash
   npm run dev
   ```

## Questions  
For any configuration issues or questions, feel free to contact me via email: **nguyenhaiquan.data@gmail.com**


