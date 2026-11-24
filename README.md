# Travel Diaries

A full-stack (MERN) app for sharing travel stories. Anyone can browse the diaries; registered users can publish their own and edit or delete them.

## Features

- Sign up and log in with email and password (JWT, hashed passwords)
- Public feed of diaries, newest trips first
- Add, edit and delete your own diaries: title, description, image URL, location and date
- Profile page with your own diaries
- Protected pages that send guests to the login form and back after login

## Tech stack

| Part     | Technologies                                                          |
| -------- | --------------------------------------------------------------------- |
| Frontend | React 18, Vite, MUI 5, Redux Toolkit, React Router 7, axios            |
| Backend  | Node.js, Express 4, Mongoose 7, JSON Web Token, bcryptjs, helmet       |
| Database | MongoDB (Atlas or local)                                              |
| Tooling  | Vitest, Testing Library, ESLint, node:test, supertest                  |

## Getting started

### Requirements

- Node.js 20.19+, 22.13+ or 24+
- A MongoDB database: [Atlas](https://www.mongodb.com/atlas) or a local server

### 1. Clone the repository

```bash
git clone https://github.com/alinahusak/mui-travel-diaries.git
cd mui-travel-diaries
```

### 2. Start the backend

```bash
cd backend
npm ci
cp .env.example .env
```

Fill in `backend/.env` (see [Environment variables](#environment-variables)), then run:

```bash
npm run dev
```

The API starts on <http://localhost:5000>. The database and its collections are created automatically on the first run.

### 3. Start the frontend

In a second terminal, from the project root:

```bash
cd frontend
npm ci
npm run dev
```

The app opens on <http://localhost:3000>. The port is fixed because the backend only accepts requests from `CLIENT_URL`.

## Environment variables

Never commit `.env` files: they are listed in `.gitignore`.

### `backend/.env`

| Variable         | Required | Description                                                                                     |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `MONGODB_URI`    | yes      | MongoDB connection string, including the database name (for example `.../travel-diaries`)       |
| `JWT_SECRET`     | yes      | Long random string used to sign tokens                                                          |
| `JWT_EXPIRES_IN` | no       | Token lifetime, `7d` by default                                                                 |
| `PORT`           | no       | API port, `5000` by default                                                                     |
| `CLIENT_URL`     | no       | Allowed frontend origins, comma-separated. **If empty, requests from any origin are accepted** |

You can generate a value for `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### `frontend/.env`

Optional for local development.

| Variable       | Required | Description                                             |
| -------------- | -------- | ------------------------------------------------------- |
| `VITE_API_URL` | no       | URL of the backend API, `http://localhost:5000` by default |

## Scripts

### Backend

| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Start the API and restart it on changes  |
| `npm start`   | Start the API                            |
| `npm test`    | Run the API tests (needs MongoDB)        |

### Frontend

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the development server            |
| `npm run build`   | Build for production into `dist`        |
| `npm run preview` | Serve the production build locally      |
| `npm test`        | Run the tests                           |
| `npm run lint`    | Check the code with ESLint              |

## Tests

Frontend tests need no server: API calls are mocked.

Backend tests **drop the database they connect to**, so they ignore `MONGODB_URI` and refuse to run unless the database name ends with `-test`. By default they use `mongodb://127.0.0.1:27017/travel-diaries-test`. To use another server, set `TEST_MONGODB_URI` in the terminal (it is not read from `.env`):

```bash
TEST_MONGODB_URI="mongodb://127.0.0.1:27017/my-app-test" npm test
```

PowerShell:

```powershell
$env:TEST_MONGODB_URI = "mongodb://127.0.0.1:27017/my-app-test"; npm test
```

## API

Protected routes expect the header `Authorization: Bearer <token>`. Errors are returned as `{ "message": "..." }`.

| Method | Route          | Auth  | Description                               |
| ------ | -------------- | ----- | ----------------------------------------- |
| GET    | `/health`      | no    | Health check                              |
| POST   | `/user/signup` | no    | Register; returns a token and the user    |
| POST   | `/user/login`  | no    | Log in; returns a token and the user      |
| GET    | `/user/me`     | yes   | Current user with their diaries           |
| GET    | `/user`        | no    | All users (name and diary ids only)       |
| GET    | `/user/:id`    | no    | Public profile with diaries               |
| GET    | `/posts`       | no    | All diaries                               |
| GET    | `/posts/:id`   | no    | One diary                                 |
| POST   | `/posts`       | yes   | Create a diary                            |
| PUT    | `/posts/:id`   | owner | Update a diary                            |
| DELETE | `/posts/:id`   | owner | Delete a diary                            |

Body for creating a diary (all fields are required; an update accepts any subset):

```json
{
  "title": "Lisbon",
  "description": "Tram 28 and pastel de nata",
  "image": "https://example.com/lisbon.jpg",
  "location": "Lisbon, Portugal",
  "date": "2024-05-01"
}
```

Login and signup share a limit of 50 requests per 15 minutes from one IP address.

## Project structure

```text
backend/
  controllers/   request handlers
  middleware/    authentication and error handling
  models/        Mongoose models: User, Post
  routes/        API routes
  tests/         API tests
  utils/         validation and HTTP errors
  app.js         Express app
  server.js      entry point: database connection and server start
frontend/
  public/        static files
  src/
    api-helpers/ axios client and API calls
    auth/        login and signup
    components/  shared components
    diaries/     list, form, add and edit pages
    header/      navigation
    home/        home page
    pages/       404 page
    profile/     user profile
    store/       Redux store
```

## Deployment

- **Frontend:** `frontend/vercel.json` already contains the rewrite needed for client-side routing on Vercel. Set the root directory to `frontend`, the framework preset to Vite (output `dist`) and the `VITE_API_URL` variable to the URL of the deployed API.
- **Backend:** any Node.js hosting. Set the variables from [`backend/.env`](#backendenv), with `CLIENT_URL` pointing to the deployed frontend.
