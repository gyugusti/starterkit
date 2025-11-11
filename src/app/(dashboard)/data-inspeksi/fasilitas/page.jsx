import React from 'react'

import FasilitasTable from './FasilitasTable'
import { fetchDataFasilitas } from './server'

const DEFAULT_LIMIT = 20

const Page = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1
  const limit = Number(searchParams?.limit) || DEFAULT_LIMIT
  const fasId = searchParams?.fas_id ?? ''
  const cari = searchParams?.cari ?? ''

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

  return (
    <FasilitasTable
      data={data}
      currentPage={currentPage}
      perPage={perPage}
      totalPages={totalPages}
    />
  )
}

Page.acl = {
  action: 'all',
  subject: 'bptn-page'
}

export default Page
