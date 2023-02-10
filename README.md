# JsonIpc

A simple IPC (Inter-Process Communication) system for Node.js using JSON as a message format.

## Features

### Simple and flexible API

*JSON message format
*Debugging support
*Supports multiple methods (GET, POST, DELETE, and custom methods)
*Lightweight and easy to use
#Installation

### To install JsonIpc, run the following command:

```
npm install json-ipc
```

# Usage

A simple example of how to use JsonIpc:

```
import { JsonIpc } from 'json-ipc';

const ipc = new JsonIpc();

ipc.get('/hello', (res, res) => {
res(`Hello, ${res.body}`, 200);
});

ipc.listen();
```

# API Reference

# JsonIpc

JsonIpc is the main class of the library. You can create an instance of this class and use it to define your IPC routes.

```
const ipc = new JsonIpc();
```

## debugging()

- This method enables debugging mode, which logs extra information to the console.

```
ipc.debugging();
```

## get(endpoint: string, func: (message: Request, respond: (body?: any, status?: status) => void) => void)

This method creates a new GET route.

```
ipc.get('/hello', (res, res) => {
    res(`Hello, ${res.body}`, 200);
});
```

## post(endpoint: string, func: (message: Request, respond: (body?: any, status?: status) => void) => void)

This method creates a new POST route.

```
ipc.post('/hello', (res, res) => {
    res(`Hello, ${res.body}`, 200);
});
```

## del(endpoint: string, func: (message: Request, respond: (body?: any, status?: status) => void) => void)

This method creates a new DELETE route.

```
ipc.del('/hello', (res, res) => {
res(`Hello, ${res.body}`, 200);
});
```

## set(method: string, endpoint: string, func: (message: Request, respond: (body?: any, status?: status) => void) => void)

This method creates a new route with the specified method.

```
ipc.set('GET', '/hello', (res, res) => {
res(`Hello, ${res.body}`, 200);
});
```

## endpoints(): string[]

This method returns a list of all defined endpoints.

```

console.log(ipc.endpoints());

```

## api(): { [key: string]: string[] }

This method returns all the defined methods and endpoints

```

console.log(ipc.api())

```
