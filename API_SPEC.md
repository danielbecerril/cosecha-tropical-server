# API Specification - Cosecha Tropical Server

## Base URL

### Local Development
```
http://localhost:3000/api
```

### Production (Fly.io)
```
https://cosecha-tropical-server.fly.dev/api
```

## Authentication
This API requires authentication for all endpoints except the health check. Authentication is performed using a password header.

### Authentication Methods
You can provide the password in one of two ways:

1. **Custom Header**: `x-api-password: cosecha-tropical-2024`
2. **Authorization Header**: `Authorization: cosecha-tropical-2025` or `Authorization: Bearer cosecha-tropical-2025`

### Example
```bash
curl -X GET http://localhost:3000/api/clients \
  -H "x-api-password: cosecha-tropical-2024"
```

Or using Authorization header:
```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: cosecha-tropical-2024"
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "Authentication required. Missing password header."
}
```

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": <response_data>,
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Error description"
}
```

## HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Health Check

### GET /health
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "API is running successfully",
  "timestamp": "2025-07-18T19:33:09.395Z"
}
```

---

## Clients

### GET /clients
Retrieve all clients.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "created_at": "2025-07-18T19:33:09.395Z",
      "updated_at": "2025-07-18T19:33:09.395Z"
    }
  ],
  "message": "Clients retrieved successfully"
}
```

### GET /clients/:id
Retrieve a specific client by ID.

**Parameters:**
- `id` (number, required) - Client ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Client retrieved successfully"
}
```

### POST /clients
Create a new client.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Required Fields:**
- `name` (string) - Client's full name
- `email` (string) - Client's email address

**Optional Fields:**
- `phone` (string) - Client's phone number
- `address` (string) - Client's address

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Client created successfully"
}
```

### PUT /clients/:id
Update an existing client.

**Parameters:**
- `id` (number, required) - Client ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1987654321",
  "address": "456 Oak Ave"
}
```

**All fields are optional for updates.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "+1987654321",
    "address": "456 Oak Ave",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Client updated successfully"
}
```

### DELETE /clients/:id
Delete a client.

**Parameters:**
- `id` (number, required) - Client ID

**Response:**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

## Products

### GET /products
Retrieve all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "image": "https://example.com/laptop.jpg",
      "stock": 10,
      "price": 999.99,
      "cost": 750.00,
      "created_at": "2025-07-18T19:33:09.395Z",
      "updated_at": "2025-07-18T19:33:09.395Z"
    }
  ],
  "message": "Products retrieved successfully"
}
```

### GET /products/:id
Retrieve a specific product by ID.

**Parameters:**
- `id` (number, required) - Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "image": "https://example.com/laptop.jpg",
    "stock": 10,
    "price": 999.99,
    "cost": 750.00,
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Product retrieved successfully"
}
```

### POST /products
Create a new product.

**Request Body:**
```json
{
  "name": "Laptop",
  "image": "https://example.com/laptop.jpg",
  "stock": 10,
  "price": 999.99,
  "cost": 750.00
}
```

**Required Fields:**
- `name` (string) - Product name
- `stock` (number) - Available stock quantity
- `price` (number) - Selling price
- `cost` (number) - Product cost

**Optional Fields:**
- `image` (string) - Product image URL

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "image": "https://example.com/laptop.jpg",
    "stock": 10,
    "price": 999.99,
    "cost": 750.00,
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Product created successfully"
}
```

### PUT /products/:id
Update an existing product.

**Parameters:**
- `id` (number, required) - Product ID

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "stock": 5,
  "price": 1299.99,
  "cost": 950.00
}
```

**All fields are optional for updates.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Gaming Laptop",
    "image": "https://example.com/laptop.jpg",
    "stock": 5,
    "price": 1299.99,
    "cost": 950.00,
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z"
  },
  "message": "Product updated successfully"
}
```

### DELETE /products/:id
Delete a product.

**Parameters:**
- `id` (number, required) - Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Sales

### GET /sales
Retrieve all sales with client and product details.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "client_id": 1,
      "delivery_method": "pickup",
      "payment_status": "paid",
      "total": 999.99,
      "date": "2025-07-18T19:33:09.395Z",
      "created_at": "2025-07-18T19:33:09.395Z",
      "updated_at": "2025-07-18T19:33:09.395Z",
      "client": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "address": "123 Main St"
      },
      "products": [
        {
          "sale_id": 1,
          "product_id": 1,
          "quantity": 1,
          "price": 999.99,
          "product": {
            "id": 1,
            "name": "Laptop",
            "image": "https://example.com/laptop.jpg",
            "stock": 9,
            "price": 999.99,
            "cost": 750.00
          }
        }
      ]
    }
  ],
  "message": "Sales retrieved successfully"
}
```

### GET /sales/:id
Retrieve a specific sale by ID with full details.

**Parameters:**
- `id` (number, required) - Sale ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "client_id": 1,
    "delivery_method": "pickup",
    "payment_status": "paid",
    "total": 999.99,
    "date": "2025-07-18T19:33:09.395Z",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z",
    "client": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "products": [
      {
        "sale_id": 1,
        "product_id": 1,
        "quantity": 1,
        "price": 999.99,
        "product": {
          "id": 1,
          "name": "Laptop",
          "image": "https://example.com/laptop.jpg",
          "stock": 9,
          "price": 999.99,
          "cost": 750.00
        }
      }
    ]
  },
  "message": "Sale retrieved successfully"
}
```

### POST /sales
Create a new sale with products.

**Request Body:**
```json
{
  "client_id": 1,
  "delivery_method": "pickup",
  "payment_status": "paid",
  "total": 999.99,
  "date": "2025-07-18T19:33:09.395Z",
  "products": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 999.99
    }
  ]
}
```

**Required Fields:**
- `client_id` (number) - ID of the client making the purchase
- `delivery_method` (string) - Delivery method (e.g., "pickup", "delivery")
- `payment_status` (string) - Payment status (e.g., "paid", "pending", "cancelled")
- `total` (number) - Total sale amount
- `products` (array) - Array of products in the sale

**Product Object Required Fields:**
- `product_id` (number) - Product ID
- `quantity` (number) - Quantity purchased
- `price` (number) - Price per unit

**Optional Fields:**
- `date` (string) - Sale date (ISO string, defaults to current date)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "client_id": 1,
    "delivery_method": "pickup",
    "payment_status": "paid",
    "total": 999.99,
    "date": "2025-07-18T19:33:09.395Z",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z",
    "client": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "products": [
      {
        "sale_id": 1,
        "product_id": 1,
        "quantity": 1,
        "price": 999.99,
        "product": {
          "id": 1,
          "name": "Laptop",
          "image": "https://example.com/laptop.jpg",
          "stock": 9,
          "price": 999.99,
          "cost": 750.00
        }
      }
    ]
  },
  "message": "Sale created successfully"
}
```

### PUT /sales/:id
Update an existing sale.

**Parameters:**
- `id` (number, required) - Sale ID

**Request Body:**
```json
{
  "delivery_method": "delivery",
  "payment_status": "pending",
  "total": 1299.99
}
```

**All fields are optional for updates.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "client_id": 1,
    "delivery_method": "delivery",
    "payment_status": "pending",
    "total": 1299.99,
    "date": "2025-07-18T19:33:09.395Z",
    "created_at": "2025-07-18T19:33:09.395Z",
    "updated_at": "2025-07-18T19:33:09.395Z",
    "client": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "products": [
      {
        "sale_id": 1,
        "product_id": 1,
        "quantity": 1,
        "price": 999.99,
        "product": {
          "id": 1,
          "name": "Laptop",
          "image": "https://example.com/laptop.jpg",
          "stock": 9,
          "price": 999.99,
          "cost": 750.00
        }
      }
    ]
  },
  "message": "Sale updated successfully"
}
```

### DELETE /sales/:id
Delete a sale.

**Parameters:**
- `id` (number, required) - Sale ID

**Response:**
```json
{
  "success": true,
  "message": "Sale deleted successfully"
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Required field 'name' is missing"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "Client with ID 999 not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Database connection failed",
  "message": "Unable to connect to database"
}
```

---

## Usage Examples

### Using cURL

**Create a client (Local):**
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "x-api-password: cosecha-tropical-2024" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'
```

**Create a client (Production):**
```bash
curl -X POST https://cosecha-tropical-server.fly.dev/api/clients \
  -H "Content-Type: application/json" \
  -H "x-api-password: cosecha-tropical-2024" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'
```

**Create a product (Production):**
```bash
curl -X POST https://cosecha-tropical-server.fly.dev/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-password: cosecha-tropical-2024" \
  -d '{
    "name": "Laptop",
    "stock": 10,
    "price": 999.99,
    "cost": 750.00
  }'
```

**Create a sale (Production):**
```bash
curl -X POST https://cosecha-tropical-server.fly.dev/api/sales \
  -H "Content-Type: application/json" \
  -H "x-api-password: cosecha-tropical-2024" \
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

### Using JavaScript/Fetch

**Get all clients (Local):**
```javascript
fetch('http://localhost:3000/api/clients', {
  headers: {
    'x-api-password': 'cosecha-tropical-2024'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

**Get all clients (Production):**
```javascript
fetch('https://cosecha-tropical-server.fly.dev/api/clients', {
  headers: {
    'x-api-password': 'cosecha-tropical-2024'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

**Create a client (Production):**
```javascript
fetch('https://cosecha-tropical-server.fly.dev/api/clients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-password': 'cosecha-tropical-2024'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## Notes

1. **Stock Management**: When creating a sale, the product stock is automatically reduced by the quantity sold.
2. **Transactions**: Sale creation uses database transactions to ensure data consistency.
3. **Timestamps**: All entities include `created_at` and `updated_at` timestamps in ISO format.
4. **Data Validation**: The API validates required fields and data types before processing requests.
5. **Error Handling**: Comprehensive error handling with meaningful error messages. 