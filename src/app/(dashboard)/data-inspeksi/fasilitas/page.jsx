import React from 'react'

import FasilitasTable from './FasilitasTable'
import { fetchDataFasilitas } from './server'

const DEFAULT_LIMIT = 20

const Page = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams

  const page = Number(resolvedSearchParams?.page) || 1
  const limit = Number(resolvedSearchParams?.limit) || DEFAULT_LIMIT
  const fasId = resolvedSearchParams?.fas_id ?? ''
  const cari = resolvedSearchParams?.cari ?? ''

  const response = await fetchDataFasilitas({
    page,
    limit,
    fas_id: fasId,
    cari
  })

  const data = response?.data ?? []
  const currentPage = Number(response?.current_page ?? page)
  const perPage = Number(response?.per_page ?? limit)

  const totalPages = Number(
    response?.last_page ??
      (response?.total && perPage ? Math.ceil(response.total / perPage) : 1)
  )

  const errorMessage = response?.error ?? null

  return (
    <FasilitasTable
      data={data}
      currentPage={currentPage}
      perPage={perPage}
      totalPages={totalPages}
      errorMessage={errorMessage}
    />
  )
}

Page.acl = {
  action: 'all',
  subject: 'bptn-page'
}

export default Page
