export const alamatPusat = alamat => {
  if (!alamat) {
    return '-'
  }

  if (typeof alamat === 'string') {
    return alamat
  }

  if (typeof alamat === 'object') {
    const parts = [
      alamat.alamat || alamat.jalan,
      alamat.desa || alamat.kelurahan,
      alamat.kecamatan,
      alamat.kabupaten || alamat.kota || alamat.kab_kota,
      alamat.provinsi
    ]

    const formatted = parts.filter(Boolean).join(', ')

    if (formatted) {
      return formatted
    }
  }

  return String(alamat)
}
