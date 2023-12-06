---
title: Darkboard API specs
description: Darkboard API specs
---

# Darkboard API specs

Welcome to the Darkboard API specs. This document describes the API endpoints that are available for the Darkboard application.

Our whole API is based on [`socket.io`](https://socket.io/), so make sure you use a socket.io client to connect to our API. See [compatibilty](#compatibility) for more information.

## Table of contents

-   [Getting started](#getting-started)
-   [Authentication](#authentication)
-   [Events](#events)
-   [Errors](#errors)
-   [Examples](#examples)
-   [Compatibility](#compatibility)

## Getting started

First of all, you need to have a `developer` api. If you don't have one, simply connect [here](/developer) and create one.

You also need to have a `token`, which you can request on your developer dashboard.

> **Note:** You can only have one token per developer account. If you need more, please contact us.
> DO NOT share your token with anyone, as it can be used to access your bots.

Now create a new Bot, with a name and a description _(optional)_. You will need the name and the previusly generated token to connect to the API, so that statistics can be tracked for
each one of your bots.

> **Note:** with our free plan you can have only up to 2 bots. If you need more, upgrade your plan [here](/developer).

## Authentication

Authentication is required because the internet is a free-for-all, and we don't want to be spammed by bots or ambigous requests.

To authenticate, you need to send a `token` and a `bot` name. The `token` is the one you generated on your developer dashboard, and the `bot` name is the one you created on your developer dashboard.

To start a connection with our server, you need to send a `socket.io` connection request to `https://omega-chess.ddns.net/api/db/games/socket/`. You can use any socket.io client to do this (always refer to [compatibility](#compatibility) for more information about the versions).

Here's an example of how to connect to our API using a javascript client:

```javascript
const socket = io("https://omega-chess.ddns.net", {
    reconnection: false, //optional, can be set to true
    query: {
        gameType: "developer",
        username: yourBotUsername,
        token: yourToken,
    },
    path: "/api/db/games/socket/",
});
```

> **Note:** the `gameType` parameter is mandatory and must always be set to `"developer"`.

Depending on the client you are using, the connection may be established in different ways. The query could be sent as query parameters (just like any URL query parameter), or as a JSON object (like in the example above). Also, the `path` parameter must be in some way specified. You cannot append the path to the URL, as the client will think it's not simply an URL, but a socket.io namespace, which we don't want.

## Events

Events are the way you can communicate with our API. They are sent from the client to the server, and viceversa. They are used to send and receive data.

### Server to clients

These are the events that the server sends to the client during a game. Those marked as `optional` are not required to be implemented by the client.

| Event name           | Description                                                                                                      | Data                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------- |
| `read_message`       | Sent when the umpire has something to say                                                                        | `message`: `string` |
| `chessboard_changed` | Fired when the chessboard changes, both for your moves and the opponent's ones. Sends the updated chessboard fen | `fen`: `string`     |
| `game_over`          | Sent when the game ends. Sends the game the bot just played in pgn format                                        | `pgn`: `string`     |
| `error`              | Sent when there is and error somewhere                                                                           | `message`: `string` |

### Client to server

These are the events that the client must send to the server in order to play a game.

| Event name  | Description                             | Payload          | Notes                                                                                                         |
| ----------- | --------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `ready`     | Sent when the bot wants to start a game |                  |                                                                                                               |
| `make_move` | Sent when the bot wants to try a move   | `move`: `string` | The move must be in [Standard Algebraic Notation](<https://en.wikipedia.org/wiki/Algebraic_notation_(chess)>) |
| `resign`    | Sent when the bot wants to resign       |                  |                                                                                                               |

## Errors

Errors are sent from the server to the client when something goes wrong. They are sent as an `error` event, and contain a `message` field, which is a string containing the error message.

This is an optional listener that you can add to your client if you want to debug your connection.

## Examples

Here are some examples of how to connect to our API using different clients.

## Compatibility

Our server is compatible with the `socket.io` protocol versions `2` and `3`. Make sure you use a compatible client.