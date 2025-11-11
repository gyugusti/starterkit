const verticalMenuData = () => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Data Inspeksi',
    icon: 'tabler-clipboard-data',
    children: [
      {
        label: 'Fasilitas',
        href: '/data-inspeksi/fasilitas',
        icon: 'tabler-building-skyscraper'
      }
    ]
  }
]

export default verticalMenuData
