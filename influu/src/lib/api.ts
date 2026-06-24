import { API_URL } from '@/lib/constants'
import type { ApiResponse } from '@/types'
import axios, { AxiosError, AxiosResponse } from 'axios'

// ── AXIOS INSTANCE ────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── REQUEST INTERCEPTOR — attach token ────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE INTERCEPTOR — handle 401 ────────────────────────
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

// ── AUTH ──────────────────────────────────────────────────────
export const authApi = {
  signup: (data: {
    name: string
    email: string
    password: string
    role: 'brand' | 'creator'
  }) =>
    api.post<ApiResponse<{ user: unknown; tokens: unknown }>>(
      '/auth/signup',
      data,
    ),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: unknown; tokens: unknown }>>(
      '/auth/login',
      data,
    ),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    }),

  me: () => api.get<ApiResponse<unknown>>('/auth/me'),

  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
}

// ── CAMPAIGNS ─────────────────────────────────────────────────
export const campaignsApi = {
  list: (params?: {
    status?: string
    platform?: string
    page?: number
    limit?: number
  }) => api.get('/campaigns', { params }),

  get: (id: string) => api.get(`/campaigns/${id}`),

  create: (data: unknown) => api.post('/campaigns', data),

  update: (id: string, data: unknown) => api.patch(`/campaigns/${id}`, data),

  delete: (id: string) => api.delete(`/campaigns/${id}`),

  apply: (id: string, data: { proposal: string; price: number }) =>
    api.post(`/campaigns/${id}/apply`, data),

  applications: (id: string) => api.get(`/campaigns/${id}/applications`),
}

// ── CREATORS ──────────────────────────────────────────────────
export const creatorsApi = {
  list: (params?: {
    niche?: string
    platform?: string
    minFollowers?: number
    search?: string
    page?: number
  }) => api.get('/creators', { params }),

  get: (id: string) => api.get(`/creators/${id}`),

  sendOffer: (creatorId: string, data: unknown) =>
    api.post(`/creators/${creatorId}/offers`, data),
}

// ── CONTRACTS ─────────────────────────────────────────────────
export const contractsApi = {
  list: (params?: { status?: string }) => api.get('/contracts', { params }),

  get: (id: string) => api.get(`/contracts/${id}`),

  sign: (id: string) => api.post(`/contracts/${id}/sign`),

  submitDraft: (id: string, data: FormData) =>
    api.post(`/contracts/${id}/drafts`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  reviewDraft: (
    contractId: string,
    draftId: string,
    decision: 'approve' | 'request_revision',
    feedback?: string,
  ) =>
    api.post(`/contracts/${contractId}/drafts/${draftId}/review`, {
      decision,
      feedback,
    }),

  submitPostUrl: (id: string, data: { postUrl: string }) =>
    api.post(`/contracts/${id}/post-url`, data),
}

// ── ESCROW & PAYMENTS ─────────────────────────────────────────
export const paymentsApi = {
  createPaymentIntent: (contractId: string, paymentMethod: string) =>
    api.post('/payments/intent', { contractId, paymentMethod }),

  verifyPayment: (orderId: string) => api.post('/payments/verify', { orderId }),

  history: (params?: { page?: number; limit?: number }) =>
    api.get('/payments/history', { params }),

  escrowStatus: (contractId: string) =>
    api.get(`/payments/escrow/${contractId}`),
}

// ── PACKAGES ──────────────────────────────────────────────────
export const packagesApi = {
  list: () => api.get('/packages'),
  create: (data: unknown) => api.post('/packages', data),
  update: (id: string, data: unknown) => api.patch(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
}

// ── SOCIAL ACCOUNTS ───────────────────────────────────────────
export const socialApi = {
  connect: (platform: string, code: string) =>
    api.post('/social/connect', { platform, code }),
  list: () => api.get('/social'),
  disconnect: (id: string) => api.delete(`/social/${id}`),
  verify: (id: string) => api.post(`/social/${id}/verify`),
}

// ── ANALYTICS ─────────────────────────────────────────────────
export const analyticsApi = {
  brandOverview: () => api.get('/analytics/brand'),
  creatorOverview: () => api.get('/analytics/creator'),
  campaignStats: (id: string) => api.get(`/analytics/campaigns/${id}`),
}

export const usersApi = {
  getBrandProfile: () => api.get('/users/brand/me'),
  updateBrandProfile: (data: {
    companyName?: string
    industry?: string
    website?: string
  }) => api.patch('/users/brand/me', data),
  getCreatorProfile: () => api.get('/users/creator/me'),
  updateCreatorProfile: (data: {
    bio?: string
    niche?: string
    city?: string
    availability?: string
  }) => api.patch('/users/creator/me', data),
}
