# Technical Documentation for Mutuals

## Table of Contents
1. [Introduction](##introduction)
2. [User Guide](##user-guide)
3. [API Documentation](#api-documentation)
4. [Developer Guide](#developer-guide)
5. [Contact Information](#contact-information)


## 1. Introduction
### Purpose
Mutuals is a web-based application designed to simplify the process of finding and connecting with individuals who share a common interest in playing sports during the weekend. Users can input their sport preferences and availability, facilitating the formation of groups with similar interests and schedules. The application uses an algorithm that runs every Thursday, creating groups of users who can connect through a group chat to plan and organize their sporting events.

### Target Audience
This document is intended for Emory College students with a valid emory.edu email address. The deliberate restriction to Emory College students is implemented for security purposes, ensuring a controlled and secure user environment in alignment with our commitment to maintaining the utmost standards of safety and confidentiality.

### App Overview
Users start by creating a comprehensive profile and completing an onboarding form. Subsequently, they can input their availability through an intuitive calendar interface for the upcoming weekend. Every Thursday, our algorithm curates a personalized selection of events based on user time preferences and interests. Users receive invitations to these events and can choose to accept or decline. Upon acceptance, they join a dedicated group chat, fostering effective coordination with their peers. To maintain a secure and respectful environment, the app features a reporting page where users can promptly flag any instances of unauthorized behavior.

## 2. User Guide
### For Users

Here’s the link to the current deployment of the app: [Mutuals App](https://mutuals-beta.vercel.app/)

### 1. Account Creation and Login

- To start using the app, create an account by selecting the "Sign Up" option. Use a valid @emory.edu email address for registration.
- You will receive a verification email at the provided email address. Follow the instructions to verify your account.
- If you already have an account, click on the "Log In" option.
- In case you forget your password, use the "Reset Password" option to recover your account.

### 2. Onboarding Process

- After signing up, enter your first name, last name, and phone number.
- Choose your interests from the options provided (poker, basketball, or both).
- Select an avatar and enter your age to complete the onboarding process.

### 3. Setting Availability in the Calendar

- Go to the calendar page and enter your availability for the upcoming weekend (Friday, Saturday, and Sunday).
- You can choose from four options for each day: morning, afternoon, evening, and late night.

### 4. Managing Invitations

- On the home page, you can view incoming invitations.
- Accept or decline invitations as per your interest and availability.

### 5. Viewing Accepted Events

- Your accepted events are displayed on the home page, organized by day.
- Use the "Chat" option associated with each event to join the group chat for that event.

### 6. Group Chat for Events
- In the group chat, you can send messages to other participants to plan details of the event.
- Feel free to communicate and coordinate with others in the group.

### 7. Reporting System

- If you encounter any inappropriate behavior or if someone does not show up to an event after confirming, click the "Submit a Report" button on the right panel of the chat.

### 8. Navigation Bar

- The navigation bar includes different buttons:
  - "Home" takes you back to the dashboard.
  - "Profile" allows you to view and edit your profile.
  - "Chat" shows your active group chats.
  - "Sign Out" logs you out of the app.

### 9. Dark/Light Mode Toggle

- Switch between dark and light modes using the sun/moon toggle button.

### 10. Sharing the App

- Use the "Share" button on the navigation bar to share the app with friends.


## 3. API Documentation
...

## 4. Developer Guide

This project is a Next.js application, bootstrapped with `create-next-app`.

### Running the Development Server

To start the development server, run one of the following commands:

```markdown
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Editing Pages

- Edit the page by modifying `pages/index.tsx`. 
- The page auto-updates as you edit the file.

### API Routes

- Access API routes at [http://localhost:3000/api/hello](http://localhost:3000/api/hello).
- Edit this endpoint in `pages/api/demo.ts`.
- Files in `pages/api` are API routes, not React pages.

### Fonts

This project uses `next/font` for automatic optimization and loading of Inter, a custom Google Font.

### Learn More

For more information about Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) - Feedback and contributions are welcome!

## 5. Contact Information
### Team Members
- Dani Roytburg - d.j.roytburg@emory.edu
- El Yirdaw - el.yirdaw@emory.edu
- Vidhi Mittal - vidhi.mittal@emory.edu
- Karam Khanna - karam.khanna@emory.edu
- Aarush Bedi - aarush.bedi@emory.edu
- Avarna Swaika - avarna.swaika@emory.edu
- Macarah Morgan - macarah.morgan@emory.edu


## 6. License and Legal Information
...
