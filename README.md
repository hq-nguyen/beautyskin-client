# Skincare Shop Management System - Frontend

## Overview
This repository contains the frontend for the **Skincare Shop Management System**, built using **ReactJS**. It provides an intuitive interface for customers, staff, and admins to interact with the system.

## Features
- **Homepage**: Product display, blog, FAQs, and news.
- **Skin Testing**: Quiz-based tool to determine skin type.
- **Product Recommendations**: Personalized suggestions based on skin type.
- **Feedback Submission**: Customers leave feedback for admin review.

## Tech Stack
- **Framework**: ReactJS
- **Styling**: TailwindCSS
- **API Integration**: RESTful APIs

## Setup Instructions

### Prerequisites
Before getting started, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (LTS version recommended)
- **npm**
- **Git**

### Installation

#### 1️⃣ Clone the Repository
Open a terminal and run:
```sh
git clone https://github.com/hq-nguyen/beautyskin-client.git
cd beautyskin-client
```

#### 2️⃣ Install Dependencies
Install the required packages using npm:
```sh
npm install
```

#### 3️⃣ Set Up Environment Variables
This project requires a .env file to store API keys and configuration settings.

Create a .env file in the root directory.

Add the following content and replace with your actual credentials:
```sh
VITE_API_BASE_URL=http://your-api-url.com/api/
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Ensure the .env file is NOT committed to version control by adding it to .gitignore:
```sh
echo ".env" >> .gitignore
```

#### 4️⃣ Start the Development Server
Run the development server with:
```sh
npm run dev
```

## Questions
For any configuration issues or questions, feel free to contact me via email:

📧 nguyenhaiquan.data@gmail.com