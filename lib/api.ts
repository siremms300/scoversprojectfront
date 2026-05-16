// client/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface FetchOptions extends RequestInit {
  token?: string
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Something went wrong')
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data: any) =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: (token: string) =>
      fetchAPI('/auth/me', { token }),
  },
  applications: {
    create: (data: any, token: string) =>
      fetchAPI('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    getAll: (params: string, token: string) =>
      fetchAPI(`/applications?${params}`, { token }),
    getOne: (id: string, token: string) =>
      fetchAPI(`/applications/${id}`, { token }),
    updateStatus: (id: string, status: string, note: string, token: string) =>
      fetchAPI(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
        token,
      }),
    uploadDocument: (id: string, formData: FormData, token: string) =>
      fetch(`${API_URL}/applications/${id}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }).then(res => res.json()),
    getAnalytics: (token: string) =>
      fetchAPI('/applications/analytics/overview', { token }),
  },
  institutions: {
    getAll: (params: string) =>
      fetchAPI(`/institutions?${params}`),
    getOne: (slug: string) =>
      fetchAPI(`/institutions/${slug}`),
  },
  courses: {
    getAll: (params: string) =>
      fetchAPI(`/courses?${params}`),
  },
  scholarships: {
    getAll: (params: string) =>
      fetchAPI(`/scholarships?${params}`),
  },
  blogs: {
    getAll: (params: string) =>
      fetchAPI(`/blogs?${params}`),
    getOne: (slug: string) =>
      fetchAPI(`/blogs/${slug}`),
  },
}