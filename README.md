# Shopping App Project

This repository contains a full-stack e-commerce application built with React (frontend) and NestJS (backend). The application allows users to browse products, create accounts, add items to their cart, and complete orders.

## Project Structure

The project is organized into two main directories:

```
├── frontend/     # React application
└── backend/      # NestJS REST API
```

## Frontend

The frontend is built with React and Material-UI, featuring:

- User authentication (login/register)
- Product browsing with search and filtering
- Shopping cart functionality
- Order management
- Responsive design for mobile and desktop

### Key Technologies

- React 19
- Material-UI 7
- Axios for API requests
- React Router for navigation
- Context API for state management

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

## Backend

The backend is built with NestJS and provides a RESTful API for the frontend with:

- User authentication and authorization
- Product management
- Order processing
- Database integration with PostgreSQL

### Key Technologies

- NestJS 11
- TypeORM for database interaction
- JWT authentication
- PostgreSQL database
- Class-validator for DTO validation

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

## Features

- User registration and authentication
- Browse products with search and filtering capabilities
- View product details
- Add products to cart
- Checkout process
- Order history
- User profile management

## API Endpoints

The backend provides the following main endpoints:

- `/auth` - Authentication routes (login, register)
- `/products` - Product management and search
- `/orders` - Order processing
- `/customers` - Customer profile management

## License

This project is licensed under the MIT License - see the LICENSE file for details.