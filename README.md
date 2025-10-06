# Password Vault API Documentation

This document outlines all available API endpoints for the Password Vault application.

## Authentication Endpoints

### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```
- **Success Response (201):**
```json
{
    "message": "User registered",
    "userId": "user_id_here"
}
```
- **Error Responses:**
  - `400`: User already exists
  - `500`: Server error

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```
- **Success Response (200):**
```json
{
    "token": "jwt_token_here"
}
```
- **Error Responses:**
  - `404`: User not found
  - `401`: Invalid credentials
  - `500`: Server error

## Vault Endpoints

All vault endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token
```

### Create Vault Entry
- **URL:** `/vault`
- **Method:** `POST`
- **Body:**
```json
{
    "title": "Entry Title",
    "encryptedData": "encrypted_string",
    "iv": "initialization_vector",
    "salt": "encryption_salt"
}
```
- **Success Response (201):**
```json
{
    "_id": "entry_id",
    "userId": "user_id",
    "title": "Entry Title",
    "encryptedData": "encrypted_string",
    "iv": "initialization_vector",
    "salt": "encryption_salt",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```
- **Error Response (500):** Server error

### Get All Vault Entries
- **URL:** `/vault`
- **Method:** `GET`
- **Success Response (200):**
```json
[
    {
        "_id": "entry_id",
        "userId": "user_id",
        "title": "Entry Title",
        "encryptedData": "encrypted_string",
        "iv": "initialization_vector",
        "salt": "encryption_salt",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
]
```
- **Error Response (500):** Server error

### Update Vault Entry
- **URL:** `/vault/:id`
- **Method:** `PUT`
- **URL Parameters:** `id=[vault_entry_id]`
- **Body:**
```json
{
    "title": "Updated Title",
    "encryptedData": "encrypted_string",
    "iv": "initialization_vector",
    "salt": "encryption_salt"
}
```
- **Success Response (200):**
```json
{
    "_id": "entry_id",
    "userId": "user_id",
    "title": "Updated Title",
    "encryptedData": "encrypted_string",
    "iv": "initialization_vector",
    "salt": "encryption_salt",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```
- **Error Responses:**
  - `404`: Item not found
  - `500`: Server error

### Delete Vault Entry
- **URL:** `/vault/:id`
- **Method:** `DELETE`
- **URL Parameters:** `id=[vault_entry_id]`
- **Success Response (200):**
```json
{
    "message": "Deleted successfully"
}
```
- **Error Responses:**
  - `404`: Item not found
  - `500`: Server error

### Generate Password
- **URL:** `/vault/generate`
- **Method:** `GET`
- **Query Parameters:** `length` (optional, defaults to 16)
- **Success Response (200):**
```json
{
    "password": "generated_password"
}
```

## Error Response Format
All error responses follow this format:
```json
{
    "message": "Error description" // or
    "error": "Error message"
}
```