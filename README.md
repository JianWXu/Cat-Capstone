Cat Capstone
[Live Site URL](https://cat-capstone-1.onrender.com)

# Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [User Flow](#user-flow)
- [API](#api)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)

## Introduction

Cat Capstone is a dynamic web application designed for cat enthusiasts to showcase their feline companions, swipe through other users' cats, and potentially find a purr-fect match. Whether you’re looking to share your cat’s latest photo or find a furry friend, Cat Capstone provides an interactive platform to connect with fellow cat lovers.

## Features

User Authentication: Secure sign-up and login functionality to protect user data.
Cat Profile Management: Users can add, update, and delete profiles of their cats, including pictures and details like breed, age, and personality traits.
Swiping Feature: Inspired by Tinder, users can swipe through cat profiles, indicating their interest in connecting with the cat's owner.
Liked Cats Carousel: Users can view cats they’ve liked in a visually appealing carousel.
Mutual Likes: If two users like each other's cats, they can connect via email, fostering potential friendships.

_Why These Features?_

User Authentication ensures a secure experience for users, keeping their data safe and allowing personalized interactions.
Cat Profile Management gives users the ability to showcase their pets, providing a personal touch to the platform.
Swiping Feature makes the user experience fun and engaging, increasing interaction on the site.
Liked Cats Carousel offers a user-friendly way to review and interact with previously liked profiles.
Mutual Likes enhances the community aspect of the platform by enabling connections between users.

## User Flow

Sign-Up/Login: Users create an account or log in to their existing one.
Create Cat Profile: After logging in, users can create a profile for their cat by adding a picture and relevant details.
Swipe Cats: Users can browse through other cats' profiles and swipe right if they like a cat.
View Liked Cats: Users can view all the cats they have liked in a carousel format.
Connect with Owners: If two users like each other’s cats, they can connect via email.

## API

This project uses the [[supabase](https://supabase.com/)] to manage user data, cat profiles, and interactions.

_Key API Endpoints:_

POST /login - Authenticates a user.
GET /cats - Retrieves a list of all cats.
POST /cats - Creates a new cat profile.
PUT /cats/:id - Updates an existing cat profile.
DELETE /cats/:id - Deletes a cat profile.
POST /swipes - Records a swipe action.
GET /swipes/liked - Retrieves all cats liked by the user.

_Notes on the API:_

The API is RESTful and provides efficient CRUD operations for cat profiles.
The swipes and likes feature is optimized to ensure fast response times, even as the number of users grows.

#Technology Stack

_Frontend:_
React.jsVite
CSS Modules for styling
React-Tinder-Card for swipe functionality
Multer for handling multipart/form-data

_Backend:_
Node.js with Express.js
Supabase for database management
RESTful API integration

_Deployment:_
Render for hosting
GitHub

Contributions are welcome! If you have any suggestions or improvements, feel free to submit a pull request or open an issue.
