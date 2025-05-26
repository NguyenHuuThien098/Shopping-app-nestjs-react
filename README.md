# Shopping App Project

This repository contains a full-stack e-commerce application built with React (frontend) and NestJS (backend). The application supports role-based authentication (admin & customer), product browsing, order management, and more.

## Project Structure

```
├── frontend/     # React application (Material-UI, React Router, Context API)
└── backend/      # NestJS REST API (TypeORM, PostgreSQL, JWT)
```

---

## Frontend

The frontend is built with React and Material-UI, featuring:

- Role-based authentication (admin & customer)
- Customer registration and profile management
- Admin registration (by admin) and dashboard
- Product browsing with search and filtering
- Shopping cart functionality
- Order management and order tracking
- Responsive design for mobile and desktop

### Key Technologies

- React 19
- Material-UI 7
- Axios for API requests
- React Router for navigation
- Context API for state management
- TypeScript

### Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will be available at [http://localhost:3000](http://localhost:3000)

#### Environment Variables

- Configure `REACT_APP_API_URL` in `.env` (default: `http://localhost:8080`)

---

## Backend

The backend is built with NestJS and provides a RESTful API for the frontend with:

- Role-based authentication and authorization (admin & customer)
- Admin management (register/login/dashboard)
- Customer management (register/profile/orders)
- Product management
- Order processing & order tracking
- Database integration with PostgreSQL

### Key Technologies

- NestJS 11
- TypeORM for database interaction
- JWT authentication
- PostgreSQL database
- Class-validator for DTO validation
- Swagger for API docs

### Getting Started

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure your database settings in `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_DATABASE=shop
   PORT=8080
   JWT_SECRET=your-secret-key
   ```

4. Start the development server:
   ```bash
   pnpm run start:dev
   ```

5. The API will be available at [http://localhost:8080](http://localhost:8080)
6. API documentation available at [http://localhost:8080/api](http://localhost:8080/api)

---

## Database Setup

When using PostgreSQL, ensure that sequences are properly configured for auto-increment columns:

```sql
-- Create sequences for tables with auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS orders_id_seq;
ALTER TABLE orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq'::regclass);

CREATE SEQUENCE IF NOT EXISTS orderdetails_id_seq;
ALTER TABLE orderdetails ALTER COLUMN id SET DEFAULT nextval('orderdetails_id_seq'::regclass);

-- Repeat for other tables as needed
```

---

## Features

- Role-based authentication (admin & customer)
- Admin registration (by admin) and dashboard
- Customer registration and profile management
- Browse products with search and filtering
- View product details
- Add products to cart
- Checkout process
- Order history and tracking
- User profile management

---

## API Endpoints

The backend provides the following main endpoints:

- `/auth` - Authentication routes (login, logout, profile)
- `/admin` - Admin routes (login, register, dashboard)
- `/customers` - Customer registration, profile, and order history
- `/products` - Product management and search
- `/orders` - Order processing
- `/order-tracking` - Order tracking management

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.