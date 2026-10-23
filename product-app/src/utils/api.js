
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiRequest(
  path,
  { token, headers = {}, ...options } = {}
) {
  const requestHeaders = {
    ...headers
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders
  })

  if (response.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
  }

  return response
}
