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

LOGIN SCREEN
	
![Screenshot_2025-08-22-18-33-15-608_host exp exponent](https://github.com/user-attachments/assets/2c920a82-32c2-4bfd-bfca-52ed42d397a8)

![Screenshot_2025-08-22-18-33-19-262_host exp exponent](https://github.com/user-attachments/assets/306aaac7-2362-4088-9635-c5bf1bba5583)

CHAT LIST
	
![Screenshot_2025-08-22-18-29-13-375_host exp exponent](https://github.com/user-attachments/assets/b3c1b550-72b8-481f-b7c2-b8b39880e9f2)

![Screenshot_2025-08-22-18-33-41-403_host exp exponent](https://github.com/user-attachments/assets/6104e3f4-72a6-4545-8a35-af69dcc1aa88)

CHAT SCREEN

![Screenshot_2025-08-22-18-34-30-752_host exp exponent](https://github.com/user-attachments/assets/0b4acd4f-38a1-491c-abc5-c22c4780aa94)

![Screenshot_2025-08-22-18-35-13-838_host exp exponent](https://github.com/user-attachments/assets/b6f57995-8c6c-43a8-a6b5-206256cc2644)

	


	


PROFILE SCREEN


![Screenshot_2025-08-22-18-33-50-738_host exp exponent](https://github.com/user-attachments/assets/2e2378f7-2fd7-436e-b383-02e1379e7535)
	

EDIT PROFILE

 
![Screenshot_2025-08-22-18-33-56-341_host exp exponent](https://github.com/user-attachments/assets/ceafb68e-d09c-40d5-8a5f-09a00ac66856)

NEW CHAT


![Screenshot_2025-08-22-18-40-29-352_host exp exponent](https://github.com/user-attachments/assets/6de411fb-c2e1-42e3-9501-6178fbf69a71)

	


	


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
