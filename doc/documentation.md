# Technical Documentation for Mutuals

## Table of Contents
1. [Introduction](#1-introduction)
2. [User Guide](#2-user-guide)
3. [API Documentation](#3-api-documentation)
4. [Developer Guide](#4-developer-guide)
5. [Contact Information](#5-contact-information)


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


### Components 
#### File: `chat/reporting.tsx`
- Implements reporting functionality within the chat feature.
- Handles user reporting for inappropriate behavior or no-show incidents.
  
#### File: `onboarding/onboarding-form.tsx`
- Implements a user onboarding form using `react-hook-form` for form management and `zod` for schema validation.
- Collects user details, including name, phone, interests (poker, basketball), age, and avatar, with custom UI components from `@/components/ui`.
- Integrates `UserContext` for state management and `clientDbInterface` utilities for updating user data.
- Validation includes age (18+ years) and phone number regex checks.
- Successful submission updates user data and redirects to the calendar page.

#### Directory: `ui/`
- Contains React components sourced from `shadcn/ui`.
- Offers a suite of UI components designed for functionality and aesthetics.
- Components, such as `Toast` and `Avatar`, are built using React patterns.
- Provides UI elements including notifications, buttons, input fields, and avatars for modularity and reusability.

#### File: `events.tsx`
- Displays upcoming events for users.
- Utilizes contexts from `UserContext` and `EventsContext` for state management.
- Defines an `Event` interface detailing properties like day, time, and activity.
- Uses Firebase Firestore to fetch details about event chat rooms and participants.
- Dynamically creates event cards for Friday, Saturday, and Sunday, each in their respective `DaySection` components.
- The `format` function is used to format event times.

#### File: `icons.tsx`
- Defines a collection of icon components using `lucide-react`.
- Exports an `Icons` object containing pre-defined icons such as `SunMedium`, `Moon`, `Twitter`, `Share`, and custom SVG icons for 'logo' and 'gitHub'.
- Each icon is structured as a functional component, allowing for consistent and reusable iconography throughout the Mutuals app.

#### File: `invites.tsx`
- Manages the display and interaction with user invitations.
- Uses `UserContext` and `EventsContext` for state management and `useSWR` for data fetching.
- Fetches and displays invitations, allowing users to accept or decline them.
- Invitations are presented using `Card` components from `./ui/card`.
- The `respond` function updates the invitation status and modifies the local state accordingly.
- The `format` function is used for formatting the display of timeslots.

#### File: `main-nav.tsx`
- Renders the main navigation menu.
- Utilizes `Link` from Next.js for navigation and a utility `isMobile` to adapt to mobile environments.
- Accepts `items` as props, each representing a navigation item defined by the `NavItem` interface.
- Conditionally renders the app logo from `Icons` and the site name from `siteConfig` based on the device type.
- Dynamically generates navigation links from the `items` array, with styling applied using `cn` for conditional classes and handling disabled states.

#### File: `site-header.tsx`
- Renders the site's header.
- Dynamically displays different headers for mobile and desktop using the `isMobile` utility.
- Includes navigation links defined in `MainNav`, a theme toggle button (`ThemeToggle`), and a site sharing feature (`ShareSite`).
- For authenticated users, it shows additional navigation options like Home, Profile, Chat, and Sign out, handled by `UserContext`.
- The sign-out functionality integrates `firebase_auth` for user session management.
- Includes a dropdown menu for mobile view, adapting the header's layout and functionality to smaller screens.

#### File: `theme-provider.tsx`
- Wraps the `NextThemesProvider` from `next-themes`.
- Facilitates theme management across the application, allowing for easy theme switching and customization.
- Accepts `ThemeProviderProps`, passing them along to the `NextThemesProvider`.
- Renders its children within this provider context, ensuring that theme-related functionality is consistently available throughout the app.

#### File: `theme-share.tsx`
- Defines a React component for sharing the app with friends.
- Includes a `ShareBox` component that allows users to send an invitation text message to a friend's phone number.
- Uses a `POST` request to `/api/sendText` with the phone number and a predefined invitation message.
- The main `ShareSite` component manages the visibility of the `ShareBox` pop-up, toggling it open and closed.
- The sharing functionality is initiated by a button with a `Share` icon from `lucide-react`.

#### File: `theme-toggle.tsx`
- Provides theme toggle functionality.
- Utilizes the `useTheme` hook from `next-themes` to manage theme states.
- Renders a `Button` which, on click, switches the app's theme between light and dark modes.
- The toggle is visually represented by `Sun` and `Moon` icons from `lucide-react`, conditionally displayed based on the current theme.
- Uses the `setTheme` function from `useTheme` to change the theme accordingly.

### Firebase - Client Side
#### File: `client_side/firebase_init.tsx`
- Initializes and exports Firebase authentication (`firebase_auth`), Firestore database (`db`), and the Firebase app (`firebase_app`) instances using the provided Firebase configuration.
- Exports the GoogleAuthProvider (`provider`) for authentication with Google.
- Allows the application to interact with Firebase services for authentication and database operations.

### Firebase - Server Side
#### File: `server_side/firebase_admin_init.tsx`
- Initializes and exports the Firebase Admin application (`firebase_admin_app`), authentication (`firebase_admin_auth`), Firestore database (`admin_db`), and storage bucket (`bucket`).
- Uses the provided Firebase Admin configuration and private key to authenticate with Firebase services and access the Firestore database and Cloud Storage.
- The exported instances can be used to perform administrative tasks and interact with Firebase services on the server-side.

### Styles
#### File: `global.css`
- Initializes and exports the Firebase Admin application (`firebase_admin_app`), authentication (`firebase_admin_auth`), Firestore database (`admin_db`), and storage bucket (`bucket`).
- Uses the provided Firebase Admin configuration and private key to authenticate with Firebase services and access the Firestore database and Cloud Storage.
- The exported instances can be used to perform administrative tasks and interact with Firebase services on the server-side.

## 5. Contact Information
### Team Members
- Dani Roytburg - d.j.roytburg@emory.edu
- El Yirdaw - el.yirdaw@emory.edu
- Vidhi Mittal - vidhi.mittal@emory.edu
- Karam Khanna - karam.khanna@emory.edu
- Aarush Bedi - aarush.bedi@emory.edu
- Avarna Swaika - avarna.swaika@emory.edu
- Macarah Morgan - macarah.morgan@emory.edu
