'use server'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const buildQueryString = params => {
  const query = new URLSearchParams()

  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.fas_id) query.set('fas_id', params.fas_id)
  if (params.cari) query.set('cari', params.cari)

  return query.toString()
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
    total: 0
  }

  const queryString = buildQueryString(searchParams)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const url = `${baseUrl}/api/data/fasilitas${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      return fallbackResponse
    }

    const payload = await response.json()
    const responseData = payload?.response ?? payload

    if (!responseData) {
      return fallbackResponse
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
      total: Number(responseData.total ?? responseData.data?.length ?? 0)
    }
  } catch (error) {
    console.error('Error fetching fasilitas:', error)

    return fallbackResponse
  }
}
