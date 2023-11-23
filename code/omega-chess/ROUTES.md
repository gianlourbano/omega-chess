# Routes

LE COSE TRA PARENTESI SONO DINAMICHE (es. `/api/users/[username]` -> `/api/users/andrea`)

## API

POST `/api/users/register` (register a new user)
```json
BODY
{
    username: String,
    email: String,
    password: String
}

RESPONSE: "User registered successfully"
```

GET `/api/users/[username]` (get user info)
```json
RESPONSE
{
    user: {
        username: String,
        email: String,
        friends: Array<User>
    }
}
```

PUT `/api/users/[username]` (update user info)
```json
BODY
{
    newUsername: String,
    newEmail: String,
    newPassword: String
}

RESPONSE: "OK"
```

PUT `/api/users/[username]/games` (add a game to user's games)
```json
BODY: pgn-text

RESPONSE: "OK"
```

POST `/api/games/lobby` (creates new lobby)
```json
BODY
{
    gameType: "darkboard" | "online",
    player: String
}
RESPONSE
{
    id: String
}
```

GET `/api/healthcheck` (check if api server is up)
```json
RESPONSE
{
    status: "OK" | "ERROR"
}
```

GET `/api/releases` (get releases)
```json
RESPONSE
{
    releases: Array<Release>
}
```