'use server'

// Next Imports
import { cookies } from 'next/headers'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const getSessionToken = () => {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('authSession') ?? cookieStore.get('session')

    if (!sessionCookie?.value) {
      return null
    }

    try {
      const parsed = JSON.parse(sessionCookie.value)

      return parsed?.token ?? null
    } catch (error) {
      // Jika cookie tidak berbentuk JSON, gunakan nilai mentah sebagai token
      return sessionCookie.value
    }
  } catch (error) {
    console.error('Gagal membaca token dari session:', error)

    return null
  }
}

const buildQueryString = params => {
  const query = new URLSearchParams()

  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.fas_id) query.set('fas_id', params.fas_id)
  if (params.cari) query.set('cari', params.cari)

  return query.toString()
}

const parseServerError = async response => {
  try {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const body = await response.json()

      return body?.message || body?.error || body?.response?.message || body?.response?.error || JSON.stringify(body)
    }

    const textBody = await response.text()

    return textBody || 'Tidak ada detail kesalahan yang diberikan oleh server API.'
  } catch (error) {
    console.error('Gagal membaca respons error dari server API:', error)

    return 'Tidak dapat membaca detail kesalahan dari server API.'
  }
}

export async function fetchDataFasilitas(params = {}) {
  const searchParams = {
    page: params.page || DEFAULT_PAGE,
    limit: params.limit || DEFAULT_LIMIT,
    fas_id: params.fas_id || '',
    cari: params.cari || ''
  }

  const fallbackResponse = {
    data: [],
    current_page: searchParams.page,
    per_page: searchParams.limit,
    last_page: 1,
    total: 0,
    error: null
  }

  const queryString = buildQueryString(searchParams)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const url = `${baseUrl}/api/data/fasilitas${queryString ? `?${queryString}` : ''}`

  try {
    const token = getSessionToken()

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorDetail = await parseServerError(response)

      return {
        ...fallbackResponse,
        error: `Terjadi kesalahan pada server API (status ${response.status}). ${errorDetail}`
      }
    }

    const payload = await response.json()
    const responseData = payload?.response ?? payload

    if (!responseData) {
      return {
        ...fallbackResponse,
        error: 'Server API tidak mengembalikan data yang valid.'
      }
    }

    const perPage = Number(responseData.per_page ?? searchParams.limit)

    const totalPages = Number(
      responseData.last_page ??
        responseData.total_pages ??
        (responseData.total && perPage ? Math.ceil(responseData.total / perPage) : 1)
    )

    return {
      data: Array.isArray(responseData.data) ? responseData.data : [],
      current_page: Number(responseData.current_page ?? searchParams.page),
      per_page: perPage,
      last_page: totalPages,
      total: Number(responseData.total ?? responseData.data?.length ?? 0),
      error: null
    }
  } catch (error) {
    console.error('Error fetching fasilitas:', error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Terjadi kesalahan yang tidak diketahui.'

    return {
      ...fallbackResponse,
      error: `Gagal memuat data dari server aplikasi. ${errorMessage}`
    }
  }
}
