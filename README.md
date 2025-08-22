Real-Time Chat App

    ![chat app Demo](./.github/assets/app-demo.gif)

📋 Table of Contents

    .Description

    .Key Features

    .Tech Stack

    .Screenshots

    Setup and Installation

📝 Description

This is a feature-rich, real-time mobile chat application built with React Native (Expo) and Firebase. This project demonstrates a full-stack mobile development approach, connecting a sleek, animated frontend to a powerful backend for live data synchronization.

The app features a complete user authentication system, editable user profiles with image uploads, private one-on-one conversations, and a dynamic chat list that displays the last message and unread notifications. The entire user interface is built with a modern, light-themed glassmorphism design for a polished and professional user experience.
✨ Key Features

    Real-Time Messaging: Utilizes Firebase Firestore's real-time listener to instantly deliver messages between users without needing to refresh.

    User Authentication: Secure user sign-up and login handled by Firebase Authentication, with persistent login sessions.

    Editable User Profiles: Users can edit their display name and upload a custom profile picture, which is stored in Firebase Storage.

    Private One-on-One Chats: A scalable database structure that supports private, one-on-one conversations between any two users on the platform.

    Dynamic Chat List: The main screen displays a list of all active conversations, sorted by the most recent message, and includes timestamps and unread message count badges.

    Modern Glassmorphism UI: A beautiful, light-themed "glass" design built with expo-blur for a modern, professional aesthetic.

    Smooth Animations: Message bubbles gracefully fade in and slide up using react-native-reanimated.

    "New Chat" Functionality: Users can browse a list of all registered users to start new conversations.

🛠️ Tech Stack

    Framework: React Native (Expo)

    Backend as a Service (BaaS): Google Firebase

        Database: Firestore (for real-time data)

        Authentication: Firebase Auth (Email/Password)

        File Storage: Firebase Storage (for profile pictures)

    Navigation: React Navigation (Native Stack Navigator)

    Animations: react-native-reanimated

    UI Design: Glassmorphism with expo-blur

    Image Handling: expo-image-picker

📸 Screenshots

Login Screen
	

Chat List
	

Chat Screen


	


	


Profile Screen
	

Edit Profile
	

New Chat


	


	


🚀 Setup and Installation

To run this project locally, you will need to set up your own Firebase project.

    Clone the repository:

    git clone https://github.com/your-username/real-time-chat-app.git
    cd real-time-chat-app

    Install dependencies:

    npm install

    Set up Firebase:

        Go to the Firebase Console and create a new project.

        Enable Authentication (Email/Password provider).

        Enable Firestore Database (start in test mode).

        Enable Storage (start in test mode).

        Add a Web App to your project and copy the firebaseConfig object.

        Paste your credentials into the src/config/firebase.js file.

    Run the application:

    npx expo start

    Scan the QR code with the Expo Go app on your iOS or Android device.