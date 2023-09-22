# Current in development

# Santê Restaurant

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Delivery Service](#delivery-service)
- [Appointment Booking](#appointment-booking)
- [Setup Instructions](#setup-instructions)

## Introduction

Santê is a restaurant located in Brazil. At Sante, we take pride in offering a delightful culinary experience featuring a delectable menu that includes açai, pasta, hotdogs, and an array of refreshing beverages. This README serves as a comprehensive guide to our restaurant project.

## Installation

```bash
Copy code
git clone <repository_url>
Navigate to the project directory:

cd client-sante || cd api-sante
Install dependencies for both the server and client:

npm install
Set up your database and configure the environment variables for authentication methods, social login, and other project-specific settings.
npm run dev

```

## Features

### Authentication

The project utilizes multiple authentication methods, including:

### Cookies HttpOnly:

Secure authentication using HttpOnly cookies for session management.

### JWT Tokens:

JSON Web Tokens are used for secure user authentication and authorization.

### User Roles

The system supports two user roles:

Admin Users: Have access to protected areas, including management of products, categories, orders, and toppings.
Normal Users: Can interact with the menu, add products to the cart, and place orders.
Admin Dashboard
Admin users have access to a dashboard with the following information:

### Monthly sales statistics.

Sales reports and graphical representations.
Guest Users
When normal users access the menu page without logging in, a guest user profile is created in the database.
Guest users can interact with the menu and save their cart information in the database.

### Social Login

Users can sign up or log in using social login (e.g., OAuth) methods.
Upon social login, the guest user profile is updated to a normal user with email and password, and their cart information is retained.

### Cart Functionality

Normal users can interact with their cart, adding products, specifying quantities, and adding toppings if available.
Cart information is stored securely in the database for each user.

### End-to-End Testing

End-to-end testing is performed using Cypress in the client to ensure the application functions as expected.
Test scripts and procedures are provided for quality assurance.

### Delivery Service

We understand the importance of convenience for our customers. To enhance your dining experience, we offer a free delivery service for orders placed within a 2-kilometer radius of our restaurant location. This service ensures that your favorite Sante dishes can be enjoyed from the comfort of your home or office.

### Appointment Booking

At Sante, we believe in providing our customers with the utmost convenience. For those who prefer a planned dining experience, our appointment booking feature allows you to reserve a specific time for your order pickup or delivery. This ensures that your meal is ready exactly when you need it.

## License

[MIT](https://choosealicense.com/licenses/mit/)
