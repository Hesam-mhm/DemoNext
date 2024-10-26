// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'داشبورد',
    path: '/home',
    icon: 'mdi:home-outline'
  },
  {
    title: 'خط تولید',
    path: '/ProductionLineDetail',
    icon: 'mdi:email-outline'
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'mdi:shield-outline'
  }
]

export default navigation
