# Buyer Portal

## How to run the app

**1. Run the Backend Server**
```bash
cd backend
npm install
npm run dev
# The backend will start on http://localhost:5000
```

**2. Run the Frontend Application**
```bash
cd frontend
npm install
npm run dev
# The frontend will start on http://localhost:5173
```

## Example flows

**1. Sign Up & Login Flow**
* Go to the frontend URL (http://localhost:5173).
* Click on the "Register" button to create an account (providing a valid email and a password of at least 6 characters).
* After a successful registration, you will be redirected to the login page.
* Enter your new credentials to securely log into the Buyer Portal dashboard.

**2. Property Favourites Flow**
* Once logged in, you will see a list of available Nepalese properties on your Dashboard.
* Click the **"Add Favourite"** button on any property.
* The button will turn red and confirm it's added. A success toast notification will appear.
* You can easily view all your saved properties in the "Your Favourites" section at the bottom of the page.
* To remove a property, simply click the "Favourite" button again.
