const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchWrapper = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'API request failed')
  return data
}

export default fetchWrapper
