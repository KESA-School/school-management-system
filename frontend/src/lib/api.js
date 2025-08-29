const fetchWrapper = async (url, options = {}) => {
  const response = await fetch(`${process.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error('Network error');
  return response.status === 204 ? null : response.json();
};

export default fetchWrapper;
