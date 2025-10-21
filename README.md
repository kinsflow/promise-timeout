# `p-timeout-abort`

A simple, lightweight utility to add timeout support to any promise, using `AbortController` for cancellation.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Custom Timeout Error](#custom-timeout-error)
- [API](#api)
  - [`withTimeout`](#withtimeout)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

You can install `p-timeout-abort` via npm or yarn:

```bash
npm install p-timeout-abort
```

Or using yarn:

```bash
yarn add p-timeout-abort
```

## Usage

### Basic Usage

`p-timeout-abort` allows you to wrap any asynchronous function with a timeout. If the function doesn't resolve in the specified time, an error will be thrown.

```ts
import { withTimeout } from "p-timeout-abort";

// A sample async function
async function fetchData() {
  return new Promise((resolve) => setTimeout(() => resolve("Data fetched!"), 3000));
}

const abortController = new AbortController();
withTimeout(fetchData, 2000, { signal: abortController.signal })
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error.message)); // Will throw TimeoutError after 2 seconds
```

### Custom Timeout Error

You can create your own custom error by extending the `TimeoutError` class.

```ts
import { withTimeout, TimeoutError } from "p-timeout-abort";

// Custom TimeoutError
class CustomTimeoutError extends TimeoutError {
  constructor() {
    super("The operation exceeded the time limit.");
  }
}

async function fetchData() {
  return new Promise((resolve) => setTimeout(() => resolve("Data fetched!"), 3000));
}

const abortController = new AbortController();
withTimeout(fetchData, 2000, { signal: abortController.signal })
  .then((data) => console.log(data))
  .catch((error) => {
    if (error instanceof CustomTimeoutError) {
      console.error("Custom Timeout Error:", error.message);
    } else {
      console.error("General Error:", error.message);
    }
  });
```

## API

### `withTimeout`

```ts
async function withTimeout<T>(
  task: Promise<T> | (() => Promise<T>),
  ms: number,
  opts: { signal?: AbortSignal } = {}
): Promise<T>
```

**Parameters:**
- `task`: The promise or async function that you want to run with a timeout.
- `ms`: The time (in milliseconds) after which the task will be aborted if not completed.
- `opts`: An optional configuration object.
  - `signal`: An AbortSignal that can be used to cancel the operation externally.

**Returns:**
- A promise that resolves with the result of task if it finishes within the time limit.
- If the timeout is exceeded, it will throw a `TimeoutError` (or your custom error if you subclass it).

## Error Handling

`p-timeout-abort` throws a `TimeoutError` if the task exceeds the specified time limit.
You can catch and handle this error like so:

```ts
try {
  await withTimeout(fetchData, 2000);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error("The operation timed out:", error.message);
  } else {
    console.error("Other error:", error.message);
  }
}
```

### Customizing Timeout Error

You can create your own custom error by extending the `TimeoutError` class.

```ts
class MyCustomError extends TimeoutError {
  constructor() {
    super("The operation timed out with a custom error.");
  }
}
```

## License

MIT License. See the LICENSE file for details.

