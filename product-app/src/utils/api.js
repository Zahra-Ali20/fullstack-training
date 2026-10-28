
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TASKS_API_BASE_URL = import.meta.env.VITE_TASKS_API_BASE_URL

async function request(url, path, options = {}) {
  const { token, headers = {}, ...restOptions } = options

  const requestHeaders = {
    ...headers
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${url}${path}`, {
    ...restOptions,
    headers: requestHeaders
  })

  if (response.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
  }

  return response
}

export function apiRequest(path, options = {}) {
  return request(API_BASE_URL, path, options)
}

export function tasksApiRequest(path, options = {}) {
  return request(TASKS_API_BASE_URL, path, options)
}
