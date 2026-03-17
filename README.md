# FIT-CHECK – AI Virtual Try-On Fashion (MERN)

Full-stack MERN app where shoppers can browse outfits, upload their photo, and preview AI-generated try-ons. Includes JWT auth, dynamic admin product management (no static data), cart, Gemini-based virtual try-on with fallbacks, and Groq-powered stylist chat.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- AI: Google Gemini for image try-on (2-image prompt), Groq llama3-8b-8192 for chat

## Project Structure
```
client/   # React + Tailwind frontend
server/   # Express API, Mongo models, AI integrations
```

## Environment Variables
Create `server/.env` with:
```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<strong_secret>
ADMIN_CODE=<admin_signup_code>
GEMINI_API_KEY=<google_gemini_key>
GROQ_API_KEY=<groq_api_key>
```

Create `client/.env` with:
```
VITE_API_URL=http://localhost:5000/api
```

## Backend Setup
```bash
cd server
npm install
npm run dev   # starts Express on http://localhost:5000
```
Routes:
- `POST /api/auth/register` (supports optional `adminCode` to assign admin role)
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/products` (create/update/delete requires admin JWT)
- `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/quantity`, `DELETE /api/cart/remove`
- `POST /api/tryon` (multipart: userImage, clothImage) – calls Gemini, falls back to demo image, saves to user
- `POST /api/chat` – Groq chatbot with fallback responses

## Frontend Setup
```bash
cd client
npm install
npm run dev   # http://localhost:5173
npm run build # production build
```
Pages: Home, Product Listing, Product Detail, Cart, Login/Signup, Try-On, Admin panel (dynamic CRUD). Floating chatbot + before/after try-on preview included.

## Demo Flow
1) Register/login (use `ADMIN_CODE` to create admin).  
2) Admin adds products (image URL, price, sizes).  
3) Browse products, add to cart, open product to “Try this look”.  
4) Go to Try-On, upload your photo + clothing (or pick from catalogue) and generate AI preview.  
5) Use chatbot for styling tips; fallback images/replies ensure fast demo even if AI APIs are unavailable.

## Notes
- Cart, try-ons, and admin are JWT-protected.  
- Image uploads are processed with multer in-memory and converted to base64 for Gemini.  
- Fallback demo image is returned if AI services fail or keys are missing to keep the flow responsive.  
- No static product data is bundled; all products are managed dynamically via the Admin panel.
