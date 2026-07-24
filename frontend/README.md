# React Frontend for FastAPI Product Manager

This folder contains a React frontend built with Vite.
The app is ready to connect to your existing FastAPI backend.

## Setup

From the `frontend` folder:

```powershell
cd c:\Users\PC\Desktop\FASTAPI\frontend
npm install
npm run dev
```

If you do not have Node installed, install it first from https://nodejs.org.

## Available scripts

- `npm run dev` — start the development server.
- `npm run build` — build production assets.
- `npm run preview` — preview the production build.

## How it works

- `src/main.jsx` mounts the React app.
- `src/App.jsx` handles fetching data from the backend.
- `src/styles.css` contains the UI styling.

## API endpoint mapping

The app currently uses these backend routes:

- `GET /products`
- `GET /product/{id}`
- `POST /product/{id}`
- `PUT /product?id={id}`
- `DELETE /product{id}`

If your backend endpoints change, update the API paths in `src/App.jsx`.
