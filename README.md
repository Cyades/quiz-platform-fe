# Quiz Platform Frontend

This is the frontend component of the Quiz Platform application, built with React and TypeScript.

## Features

- Display a list of available tryouts
- View detailed information about individual tryouts
- Responsive design for various screen sizes
- Integration with the backend REST API

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Setup and Installation

### 1. Install Dependencies

```bash
# Install all required npm packages
npm install
```

### 2. Configure Environment

The application uses environment variables for configuration. A `.env` file is provided:

```
REACT_APP_API_URL=http://localhost:8080
```

If your backend is running on a different host or port, update this value accordingly.

### 3. Start the Development Server

```bash
npm start
```

This will start the development server on port 3000. The application will be available at:
http://localhost:3000

### 4. Build for Production (Optional)

```bash
npm run build
```

This creates an optimized production build in the `build` directory that can be served by any static file server.

## Usage

1. **Viewing Tryouts**: The home page displays a grid of all available tryouts
2. **Viewing Details**: Click on any tryout card to see its detailed information

## Integration with Backend

The frontend communicates with the backend API at the URL specified in the `.env` file. Make sure the backend server is running before accessing the frontend application.

## Project Structure

```
frontend/
├── public/          # Static assets
│   ├── favicon.ico  # Page icon
│   └── index.html   # HTML template
├── src/             # Source code
│   ├── components/  # Reusable components
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── pages/       # Page components
│   │   ├── TryoutDetail.tsx
│   │   └── TryoutList.tsx
│   ├── types/       # TypeScript definitions
│   │   └── index.ts
│   ├── App.css      # Global styles
│   ├── App.tsx      # Main component with routes
│   └── index.tsx    # Application entry point
├── .env             # Environment variables
├── package.json     # NPM dependencies
└── tsconfig.json    # TypeScript configuration
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Runs the test suite
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)