# React Hooks Review

## useState

`useState` stores data that can change over time. When the state changes, React renders the component again so the UI can show the updated value.

## useEffect

`useEffect` runs side effects, such as fetching data from an API. Its dependencies tell React when to run the effect again.

- `[]` means the effect runs on mount, with an extra setup/cleanup.
- `[value]` means it runs when `value` changes.
- No dependency array means it runs after every render.

## useMemo

`useMemo` memoizes a calculated value. It can avoid repeating an expensive calculation when its dependencies have not changed.

## useCallback

`useCallback` memoizes a function reference. It can help avoid passing a new function reference to child components on every render.

## useRef

A ref stores a value between renders. Changing `ref.current` does not trigger a render because React does not treat ref changes as state updates.

## Custom Hooks

I moved product-fetching logic into `useProducts` to keep API logic separate from UI code. The hook manages products, loading, errors, and retrying, so the component can focus on displaying the UI.

## Cleanup

My product request uses `AbortController`. The effect cleanup calls `controller.abort()` to cancel the fetch when the effect is cleaned up. The hook ignores `AbortError` and avoids setting loading to false after the request has been aborted.

## Optimization

`useState` and `useEffect` are needed for the current state and API-fetching behavior. `useRef` is used for focusing the search input without causing a render. `useMemo` and `useCallback` are mainly optimization tools, not automatically required for correctness. Custom hooks mainly organize and reuse logic; they do not automatically make code faster.
