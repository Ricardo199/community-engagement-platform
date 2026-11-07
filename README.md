# Community Engagement Platform

A full-stack **Community Engagement Platform** built using a **Microservices** backend architecture and a **Micro-Frontend (MFE)** client architecture powered by **GraphQL**, **Apollo**, **Express**, **MongoDB**, and **React + Vite**.

The platform connects neighborhood residents, local business owners, and community organizers—enabling users to share community news, start neighborhood discussions, coordinate volunteer help requests, and manage their profiles.

---

## Architecture Overview

The repository is organized into independent backend microservices (each with its own GraphQL schema, resolvers, and MongoDB database) and a Vite-based React Micro-Frontend:

```text
community-engagement-platform/
├── backend/
│   ├── auth-service/                # Authentication & User Management Microservice (Port 4001)
│   │   ├── graphQL/
│   │   │   ├── resolvers.js         # Auth queries & mutations
│   │   │   └── typeDefs.js          # User & AuthPayload GraphQL schema
│   │   ├── models/
│   │   │   └── User.js              # Mongoose User model (bcrypt + JWT methods)
│   │   ├── src/
│   │   │   └── server.js            # Express + Apollo Server entrypoint
│   │   └── utils/
│   │       └── logger.js            # Structured JSON audit logger
│   │
│   └── community-service/           # Community Posts & Help Requests Microservice (Port 4002)
│       └── src/
│           ├── graphql/
│           │   ├── resolvers.js     # Posts & HelpRequests queries/mutations
│           │   └── typeDefs.js      # Post, HelpRequest & User schema
│           ├── models/
│           │   ├── HelpRequest.js   # Mongoose HelpRequest model
│           │   └── Post.js          # Mongoose Post model
│           └── server.js            # Express + Apollo Server entrypoint
│
├── frontend/
│   └── auth-mfe/                    # React + Vite Micro-Frontend Application
│       └── src/
│           ├── graphQL/
│           │   └── operations.js    # GraphQL queries & mutations (Auth & Community)
│           ├── pages/
│           │   ├── auth/            # Login & Sign Up views
│           │   └── resdient/        # Home, News, Discussion, Help, Profile & Settings views
│           ├── services/
│           │   └── apolloClient.js  # Apollo Client & Bearer token link configuration
│           ├── styles/              # Component & layout stylesheets
│           ├── App.jsx              # Client-side routing (React Router v6)
│           └── main.jsx             # Application bootstrap
└── LICENSE                          # GNU General Public License v3.0
```

| Service / App | Directory | Default Port | GraphQL / Web Endpoint | Default Database |
| :--- | :--- | :--- | :--- | :--- |
| **Auth Service** | `backend/auth-service` | `4001` | `http://localhost:4001/graphql` | `mongodb://localhost:27017/auth-service` |
| **Community Service** | `backend/community-service` | `4002` | `http://localhost:4002/graphql` | `mongodb://localhost:27017/community-service` |
| **Auth & Community MFE** | `frontend/auth-mfe` | `5173` | `http://localhost:5173` | — |

---

## Tech Stack

### Backend (`auth-service` & `community-service`)
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js (`express`)
- **GraphQL Server**: Apollo Server 4 (`@apollo/server`, `graphql`, `graphql-tag`)
- **Database & ODM**: MongoDB & Mongoose (`mongoose`)
- **Authentication & Security**: JSON Web Tokens (`jsonwebtoken`), password hashing (`bcryptjs`), CORS (`cors`), environment configuration (`dotenv`)

### Frontend (`auth-mfe`)
- **Framework**: React 18 (`react`, `react-dom`)
- **Build Tool & Module Federation**: Vite 8 (`vite`, `@vitejs/plugin-react`, `@originjs/vite-plugin-federation`)
- **Routing**: React Router v6 (`react-router-dom`)
- **GraphQL Client**: Apollo Client 4 (`@apollo/client`, `graphql`)

---

## Features

### 1. Authentication Microservice (`backend/auth-service`)
- **Role-Based User Accounts**: Supports three community roles:
  - `resident` — Connect with neighbors, participate in discussions, and request/volunteer for help.
  - `business_owner` — Engage with residents, share business updates, and post community news.
  - `community_organizer` — Manage community initiatives, events, announcements, and volunteer efforts.
- **JWT Token Lifecycle**:
  - Issues short-lived **Access Tokens** (`15m` expiration) and long-lived **Refresh Tokens** (`7d` expiration).
  - Automatic password hashing via Mongoose `pre('save')` hooks using `bcryptjs`.
- **User Management**: Query current user (`me`), fetch users by ID or list all users, update account details, and delete accounts.
- **Audit Logging**: Structured JSON logging utility (`utils/logger.js`) for authentication events and token refreshes.

### 2. Community Engagement Microservice (`backend/community-service`)
- **Community Posts**:
  - Create, read, update, and delete posts categorized as `news` or `discussion`.
  - Includes an `aiSummary` field on posts for quick digest previews.
  - Enforces author-level authorization on post updates and deletions.
- **Help Requests & Volunteering**:
  - Residents can create help requests with a description and optional location.
  - Community members can volunteer for open help requests (`volunteerForHelpRequest`), preventing duplicate sign-ups.
  - Authors can update or mark help requests as resolved (`resolveHelpRequest`).

### 3. Frontend Micro-Frontend (`frontend/auth-mfe`)
- **Authentication Views**:
  - `/login` — Email/password login with form validation and quick navigation.
  - `/signup` — Account registration with role selection (`Resident`, `Business Owner`, `Community Organizer`).
- **Community & Resident Portal**:
  - `/home` — Personalized dashboard displaying community stats, quick action cards, latest community posts, and active help requests needing volunteers.
  - `/news` & `/news/:postId` — Searchable and category-filterable community news feed (`news`, `announcement`, `event`, `business`) with detailed post view and AI summary box.
  - `/profile` — User profile overview with role badge, activity metrics, created posts, help requests, and volunteer history.
  - `/account-settings` — Profile editing, password change form, and account deletion danger zone.
  - `/dis`, `/help`, `/create-post`, `/create-help` — Route scaffolding for discussions, help board, and creation forms.

---

## GraphQL API Reference

### Auth Service (`http://localhost:4001/graphql`)

#### Types
- **`User`**: `_id: ID!`, `username: String!`, `email: String!`, `role: String!`, `createdAt: String!`, `refreshToken: String`
- **`AuthPayload`**: `accessToken: String!`, `refreshToken: String!`, `user: User!`

#### Queries & Mutations
| Type | Operation | Signature | Description |
| :--- | :--- | :--- | :--- |
| **Query** | `me` | `me: User` | Returns the currently authenticated user from the `Bearer` token |
| **Query** | `getUser` | `getUser(_id: ID!): User` | Fetches a single user by ID |
| **Query** | `getAllUsers` | `getAllUsers: [User!]!` | Lists all registered users |
| **Mutation** | `signup` | `signup(username: String!, email: String!, password: String!, role: String!): AuthPayload!` | Registers a new user and returns JWT tokens |
| **Mutation** | `login` | `login(email: String!, password: String!): AuthPayload!` | Authenticates a user and returns JWT tokens |
| **Mutation** | `logout` | `logout: Boolean!` | Invalidates the current user's refresh token (requires auth) |
| **Mutation** | `refreshToken` | `refreshToken(refreshToken: String!): AuthPayload!` | Issues a new access token from a valid refresh token |
| **Mutation** | `updateUser` | `updateUser(_id: ID!, username: String, email: String, password: String, role: String): User!` | Updates user profile fields |
| **Mutation** | `deleteUser` | `deleteUser(_id: ID!): Boolean!` | Deletes a user by ID |

---

### Community Service (`http://localhost:4002/graphql`)

#### Types
- **`Post`**: `_id: ID!`, `author: User!`, `title: String!`, `content: String!`, `category: String!`, `aiSummary: String`, `createdAt: String!`, `updatedAt: String!`
- **`HelpRequest`**: `_id: ID!`, `author: User!`, `description: String!`, `location: String`, `isResolved: Boolean!`, `volunteers: [User!]!`, `createdAt: String!`, `updatedAt: String`

#### Queries & Mutations
| Type | Operation | Signature | Description |
| :--- | :--- | :--- | :--- |
| **Query** | `me` | `me: User` | Returns the authenticated user payload from the JWT |
| **Query** | `posts` | `posts(category: String): [Post!]!` | Lists all posts, optionally filtered by `category` |
| **Query** | `post` | `post(_id: ID!): Post` | Fetches a single post by ID |
| **Query** | `helpRequests` | `helpRequests(isResolved: Boolean): [HelpRequest!]!` | Lists help requests, optionally filtered by resolution status |
| **Query** | `helpRequest` | `helpRequest(_id: ID!): HelpRequest` | Fetches a single help request by ID |
| **Mutation** | `createPost` | `createPost(title: String!, content: String!, category: String!): Post!` | Creates a new post (requires auth) |
| **Mutation** | `updatePost` | `updatePost(_id: ID!, title: String, content: String, category: String): Post!` | Updates an existing post (author only) |
| **Mutation** | `deletePost` | `deletePost(_id: ID!): Boolean!` | Deletes a post (author only) |
| **Mutation** | `createHelpRequest` | `createHelpRequest(description: String!, location: String): HelpRequest!` | Creates a new help request (requires auth) |
| **Mutation** | `updateHelpRequest` | `updateHelpRequest(_id: ID!, description: String, location: String, isResolved: Boolean): HelpRequest!` | Updates a help request (author only) |
| **Mutation** | `volunteerForHelpRequest` | `volunteerForHelpRequest(_id: ID!): HelpRequest!` | Adds the authenticated user to the request's volunteers list |
| **Mutation** | `resolveHelpRequest` | `resolveHelpRequest(_id: ID!): HelpRequest!` | Marks a help request as resolved (author only) |

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection URI

### 1. Clone the Repository
```bash
gh repo clone Ricardo199/community-engagement-platform
cd community-engagement-platform
```

### 2. Configure Environment Variables

Create a `.env` file in `backend/auth-service/`:
```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=your-secret-key
```

Create a `.env` file in `backend/community-service/`:
```env
PORT=4002
MONGO_URI=mongodb://localhost:27017/community-service
JWT_SECRET=your-secret-key
```
> **Note:** Ensure `JWT_SECRET` matches across both backend microservices so tokens issued by `auth-service` can be verified by `community-service`.

*(Optional)* Create a `.env` file in `frontend/auth-mfe/`:
```env
VITE_GRAPHQL_URL=http://localhost:4001/graphql
```

### 3. Install Dependencies & Run Services

#### Start the Auth Microservice
```bash
cd backend/auth-service
npm install
npm run dev      # Starts with nodemon on http://localhost:4001/graphql
```

#### Start the Community Microservice
```bash
cd backend/community-service
npm install
npm run dev      # Starts with nodemon on http://localhost:4002/graphql
```

#### Start the Frontend (Auth MFE)
```bash
cd frontend/auth-mfe
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## Connecting Apollo Client in the Frontend

During standalone UI development, `frontend/auth-mfe` uses local mock state in its page components while the GraphQL client and operations are prepared in:
- `frontend/auth-mfe/src/services/apolloClient.js`
- `frontend/auth-mfe/src/graphQL/operations.js`

To switch from mock data to live GraphQL queries/mutations:
1. Uncomment the client setup in `src/services/apolloClient.js` and wrap `<App />` with `<ApolloProvider client={apolloClient}>` in `src/main.jsx`.
2. Uncomment the GraphQL document definitions in `src/graphQL/operations.js`.

---

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](./LICENSE) file for details.
