# NewGame

**NewGame** is a mobile-first platform designed to centralize game development resources for students and other enthusiasts. It aggregates guides, videos, tools, and creator content in a single, searchable app with optional AI-assisted recommendations.

---

## Features

- **Personalized content feed** for game development resources
- **Curated collections** of tutorials, videos, and tools
- **Search and filtering** powered by Algolia
- **AI-assisted recommendations and tagging** via OpenAI APIs
- **Admin dashboard** for managing resources (CRUD operations)

---

## Project Structure

- `apps/mobile`: React Native app (Expo)
- `apps/admin-dashboard`: Web administration tool (Next.js)
- `backend`: AWS infrastructure (CDK)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)
- **Expo Go** (app on your mobile device for local testing)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd NewGame
```

### 2. Environment Setup

Both the mobile app and the admin dashboard require environment variables to function correctly. Create a `.env` file in both `apps/mobile` and `apps/admin-dashboard`.

**Mobile (`apps/mobile/.env`):**

```bash
EXPO_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
EXPO_PUBLIC_ALGOLIA_INDEX_NAME=your_algolia_index_name
```

**Admin Dashboard (`apps/admin-dashboard/.env`):**

```bash
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_cognito_id
NEXT_PUBLIC_COGNITO_CLIENT_SECRET=your_cognito_secret
NEXT_PUBLIC_COGNITO_REDIRECT_URI=your_redirect_uri
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

---

## Running the Mobile App

1. Navigate to the mobile app directory:

    ```bash
    cd apps/mobile
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the Expo server:

    ```bash
    npx expo start
    ```

4. Use the **Expo Go** app on your phone to scan the QR code displayed in your terminal, or press `i` for iOS simulator or `a` for Android emulator.

---

## Running the Admin Dashboard

1. Navigate to the admin dashboard directory:

    ```bash
    cd apps/admin-dashboard
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Frontend (Mobile):** React Native (Expo)
- **Frontend (Web Admin):** Next.js
- **Backend:** AWS (Lambda, API Gateway, DynamoDB)
- **Search:** Algolia
- **AI Integration:** OpenAI API
