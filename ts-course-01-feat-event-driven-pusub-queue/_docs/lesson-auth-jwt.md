# Authentication with JWT

```bash
npm install -D @types/jsonwebtoken @types/bcrypt
npm install jsonwebtoken bcrypt
```

## 1. Registration flow

```mermaid
  sequenceDiagram
    Client->>+User Service: POST v1/register
    User Service->>+User DB: Check email if existed
    User DB-->>User Service: No email existed
    User Service->>User Service: Generate salt and hash password (bcrypt)
    User Service->>User DB: Insert new user
    User DB-->>-User Service: OK
    User Service-->>-Client: OK
```

## 2. Login flow

```mermaid
  sequenceDiagram
    Client->>+User Service: POST v1/login
    User Service->>+User DB: Find user with email
    User DB-->>-User Service: User
    User Service->>User Service: Hash & compare password (bcrypt)
    User Service->>User Service: Generate access token
    User Service-->>-Client: Access Token
```

## 3. Get user profile (My profile)

```mermaid
  sequenceDiagram
    Client->>+User Service: GET v1/me
    Note over Client,User Service: With Bearer Authorization
    User Service->>User Service: Verify & parse access token
    User Service->>+User DB: Find user with id
    User DB-->>-User Service: User
    User Service-->>-Client: User
```

## 4. Authorization flow with middleware

```mermaid
  sequenceDiagram
    Client->>+M: GET v1/carts
    Note over Client,M: With Bearer Authorization

    box Cart Service
      participant H as Handler
      participant M as Middleware
    end
    M->>+User Service: Verify & parse access token
    User Service-->>-M: Token payload (userId)
    M->>M: Attach payload to request
    M->>+H: next()
    H->>+Cart DB: Query cart items by user id
    Cart DB-->>-H: list items in cart
    H-->>-M: list items in cart
    M-->>-Client: list items in cart
```
