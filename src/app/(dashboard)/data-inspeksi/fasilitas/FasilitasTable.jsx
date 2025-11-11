'use client'

import React from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { alamatPusat } from '@/utils/balishelper'

const FasilitasTable = ({ data, currentPage, perPage, totalPages, errorMessage }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const indexOfFirstItem = (currentPage - 1) * perPage

  const handlePageChange = (_, value) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 1) {
      params.delete('page')
    } else {
      params.set('page', value.toString())
    }

    const queryString = params.toString()
    const target = queryString ? `${pathname}?${queryString}` : pathname

    router.push(target, { scroll: false })
  }

  const hasData = Array.isArray(data) && data.length > 0

  return (
    <Card>
      <CardContent>
        {errorMessage ? (
          <Alert severity='error' sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='tabel data fasilitas'>
            <TableHead>
              <TableRow>
                <TableCell component='th'>NO</TableCell>
                <TableCell>Nama Fasilitas</TableCell>
                <TableCell>Fas ID</TableCell>
                <TableCell>Alamat Pusat</TableCell>
                <TableCell>Bidang</TableCell>
                <TableCell>KTUN</TableCell>
                <TableCell>SRP</TableCell>
                <TableCell>Pekerja</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasData ? (
                data.map((item, index) => (
                  <TableRow key={`${item.fas_id ?? 'fas'}-${index}`}>
                    <TableCell scope='row'>{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.fas_id}</TableCell>
                    <TableCell>{alamatPusat(item.alamat_pusat)}</TableCell>
                    <TableCell>{item.bidang?.nama}</TableCell>
                    <TableCell>{(item.ktun20_count || 0) + (item.ktun25_count || 0)}</TableCell>
                    <TableCell>{item.sumber_count}</TableCell>
                    <TableCell>{item.pekerja_count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    <Typography component='span' variant='body2'>
                      Tidak ada data fasilitas.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default FasilitasTable
