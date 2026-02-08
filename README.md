# AiCitySimulation API

Backend API for a city simulation in which users propose laws, vote on them, and observe how collective decisions influence the city’s development over time. Each round, the system selects laws, simulates one year of the city’s life using OpenAI, and updates key metrics: population, happiness, wealth, crime rate, and trust.

The project is built with **Node.js**, **Express**, and **MongoDB** and includes:

- User registration and authentication (JWT + cookies)
- Law proposal and voting mechanics
- Automatic simulation of a city year
- Persistent storage of the city state in a database

---

## Installation and Setup

```bash
npm install
```

Create a .env file in the root of the project and add the following variables:

```bash
PORT=YOUR_PORT
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Start the server:

```bash
npm start
```

### API documentatioin

# Auth router:

## POST /api/auth/register

Register new user and rerturn JWT.

### Request Body
{  
  "name": "John Doe",  
  "email": "john@example.com",  
  "password": "password123"  
}

### Validation
- name, email, password — required
- email must be valid
- email must be unique

### Success Response (201)
{  
  "token": "jwt_token_here",  
  "user": {  
    "id": "64b123...",  
    "name": "John Doe",  
    "email": "john@example.com"  
  }  
}

### Cookies
- access_token — JWT (httpOnly, 7 дней)

### Errors
400 — Required fields are not provided  
400 — not valid email  
409 — User with provided email already exists  
500 — Internal server error
profile            |


## POST /api/auth/login

Authorize user and return JWT

### Request Body
{  
  "email": "john@example.com",  
  "password": "password123"  
}

### Success Response (200)
{  
  "token": "jwt_token_here",  
  "user": {  
    "id": "64b123...",  
    "name": "John Doe",  
    "email": "john@example.com"  
  }  
}

### Cookies
- access_token — JWT (httpOnly, 7 дней)

### Errors
400 — Required fields are not provided  
401 — Invalid credentials  
500 — Internal server error

## GET /api/auth/profile

Return profile of authorized user

### Authorization
JWT in cookie `access_token`

### Success Response (200)
{  
  "id": "64b123...",  
  "name": "John Doe",  
  "email": "john@example.com",  
  "createdAt": "2024-01-01T10:00:00.000Z",  
  "updatedAt": "2024-01-01T10:00:00.000Z"  
}

### Errors
401 — Unauthorized


# Laws router

## POST /api/round/end

Ends current round before the schedule

### Success Response (200)
{  
  "message": "round ended"  
}

### Errors
500 — Internal server error


## POST /api/round/propose

Allows user to propose a law

### Authorization
JWT in cookie `access_token`

### Request Body
{  
  "law": "Law text here"  
}  
 
### Validation
- User must be authorized
- law field is required
- User can propose only one law per round

### Success Response (200)
{
  "message": "The law added"
}

### Errors
400 — Law text required  
401 — User is unauthorize  
409 — You already proposed a law  
500 — Internal server error


## POST /api/round/:lawId/vote

Voting for proposed laws.

### Authorization
JWT in cookie `access_token`

### URL Params
- lawId — law ID

### Validation
- User must be authorized
- Law must exist
- Not allowed to vote for you own law
- User can vote once per round

### Success Response (200)
{
  "message": "You voted"
}

### Errors
400 — law id required  
400 — You cannot vote for you're own law  
404 — There is no law with this id  
409 — You already voted  
500 — Internal server error


## GET /api/round/getCityInfo

Return current city params

### Authorization
Not required

### Success Response (200)
{  
  "_id": "64b123...",  
  "name": "City name",  
  "population": 1000,  
  "resources": {},  
  "createdAt": "2024-01-01T10:00:00.000Z",  
  "updatedAt": "2024-01-01T10:00:00.000Z"  
}

### Errors
500 — Internal server error


## GET /api/round/getLaws

Return all proposed laws.

### Authorization
Not required

### Success Response (200)
[  
  {  
    "_id": "64b123...",  
    "law": "Law text",  
    "proposedBy": "64a999...",  
    "createdAt": "2024-01-01T10:00:00.000Z"  
  }  
]

### Errors
500 — Internal server error
