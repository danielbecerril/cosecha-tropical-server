# TypeScript Express API with Supabase

A RESTful API built with TypeScript, Express.js, and Supabase featuring a layered architecture with CRUD operations for clients, products, and sales management.

## Features

- 🏗️ **Layered Architecture**: Clean separation of concerns with controllers, services, and routers
- 🔒 **Type Safety**: Full TypeScript implementation with proper typing
- 🗄️ **Supabase Integration**: Database operations with Row Level Security (RLS)
- 🚀 **RESTful API**: Standard HTTP methods and status codes
- 🛡️ **Error Handling**: Comprehensive error handling with custom error classes
- 📊 **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- 🔄 **Transaction Support**: Safe database operations with rollback capabilities

## Project Structure

```
src/
├── config/
│   └── database.ts          # Supabase client configuration
├── controllers/
│   ├── clientController.ts  # Client HTTP request handlers
│   ├── productController.ts # Product HTTP request handlers
│   └── saleController.ts    # Sale HTTP request handlers
├── services/
│   ├── clientService.ts     # Client business logic
│   ├── productService.ts    # Product business logic
│   └── saleService.ts       # Sale business logic
├── routes/
│   ├── clientRoutes.ts      # Client route definitions
│   ├── productRoutes.ts     # Product route definitions
│   ├── saleRoutes.ts        # Sale route definitions
│   └── index.ts             # Route aggregation
├── middleware/
│   └── errorHandler.ts      # Error handling middleware
├── types/
│   └── database.ts          # TypeScript type definitions
└── index.ts                 # Application entry point
```

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create a new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales with client and product details
- `GET /api/sales/:id` - Get sale by ID with full details
- `POST /api/sales` - Create a new sale with products
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Health Check
- `GET /api/health` - API health status

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Set your Supabase URL and anon key

3. **Database Setup**
   - The migration file will create all necessary tables
   - Run the migration in your Supabase dashboard

4. **Development**
   ```bash
   npm run dev
   ```

5. **Production**
   ```bash
   npm run build
   npm start
   ```

## Usage Examples

### Create a Client
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "stock": 10,
    "price": 999.99,
    "cost": 750.00
  }'
```

### Create a Sale
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "delivery_method": "pickup",
    "payment_status": "paid",
    "total": 999.99,
    "products": [
      {
        "product_id": 1,
        "quantity": 1,
        "price": 999.99
      }
    ]
  }'
```

## Error Handling

The API includes comprehensive error handling:
- Custom `AppError` class for operational errors
- Global error handler middleware
- Proper HTTP status codes
- Detailed error messages in development mode

## Database Schema

The API manages four main entities:
- **Clients**: Customer information
- **Products**: Product catalog with stock management
- **Sales**: Sales transactions
- **Sale Products**: Junction table linking sales to products

All tables include Row Level Security (RLS) for data protection.