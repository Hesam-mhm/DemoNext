// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
  {
    title: 'داشبورد',
    path: '/home',
    icon: 'cuida:dashboard-outline',
  },
  {
    title: 'خط تولید',
    path: '/ProductionLineDetail',
    icon: 'basil:stack-solid',
    disabled :true,
    

  },
  {
    title: 'ماشین‌ها',
    path: '/MachineDetail',
    icon: 'mingcute:settings-1-fill',
    disabled :true

  }
  ]
}

export default navigation
