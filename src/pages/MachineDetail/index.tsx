// ** MUI Imports
import { Icon } from '@iconify/react'
import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CardRows from 'src/comp/CardRows'
import MachineCard from 'src/comp/MachineCard'
import generateRandomData from 'src/helper/dateGenerator'
import { MachineType } from 'src/types/ProductionLine.type'
import Image from 'next/image'
import TimelineChart from 'src/comp/timeLineChart'
import RadialBar from 'src/comp/RadialBar'
import MessagesComponent from 'src/comp/MessagesComponent'
import { MessageType } from 'src/types/MessageType'
import ColumnChart from 'src/comp/ColumnChart'

const MachineDetail = () => {
  const [machinesList, setMachinesList] = useState<MachineType[]>([])
  const [alertList, setAlertList] = useState<MessageType[]>([
    { date: 'امروز', summary: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و', title: 'عنوان پیام' }
  ])
  const [messageList, setMessageList] = useState<MessageType[]>([
    { date: 'امروز', summary: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و', title: 'عنوان پیام' }
  ])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://185.105.187.116:4002/sm/self_machines?department_name=خط تولید پوشاک')
        if (response.status >= 200 && response.status < 300) {
          console.log(response)
          setMachinesList(response.data.data as MachineType[])
        } else {
          toast.error('مشکلی در دریافت لیست ماشین ها داده است !')
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error('مشکلی در دریافت لیست ماشین ها داده است !')
      }
    }
    fetchMachines()
  }, [])

  return (
    <Grid container height={'100%'}>
      {/* Right Side */}
      <Grid p={2} item lg={3} xs={12}>
        <Card
          sx={{
            p: 3,
            backgroundColor: 'white',
            height: 920,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Prevent overflow from affecting the layout
          }}
        >
          <Stack>
            <Stack
              sx={{
                mb: 0,
                width: '100%',
                height: 187.5,
                bgcolor: '#F9F9F9',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image alt='' src={'/images/image-placeholder.png'} width={84} height={84} />
            </Stack>
            <Stack width={"100%"}>
              <TimelineChart machinesData={generateRandomData('Machine 2', '2023-06-20 00:00', 6)} />
            </Stack>

            <Stack
              p={4}
              direction={'column'}
              sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 550 }}
            >
              <Stack direction={'row'} my={2}>
                <Icon icon={'tabler:settings-2'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  ماشین ۱
                </Typography>
              </Stack>

              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  برند
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  برند ۱
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  نام اپراتور
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  محمدجواد فتوت
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  تاریخ تولید
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  ۱۴۰۲
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  دسته‌بندی
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  کوره نگهدارنده
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  زیرمجموعه
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  زیرمجموعه ۱
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <CardRows title={'وضعیت'} value={'فعال'} color='#00B051' bgColor='#DFF5E9' />
              <CardRows title={'ظرفیت تولید'} value={'80'} color='#00B051' bgColor='#DFF5E9' />
            </Stack>
          </Stack>
        </Card>
      </Grid>

      {/* Left side */}
      <Grid container item lg={9} height={940}>
        {/* Charts Card */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444, p: '16px', overflow: 'auto' }}>
            <Grid container spacing={2} sx={{ pb: '16px' }}>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <RadialBar amount={76} label='OEE' />
                </Card>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <RadialBar amount={58} label='کیفیت تولید' />
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <RadialBar amount={50} label='نرخ تولید' />
                </Card>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <RadialBar amount={28} label='مصرف انرژی' />
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Machines List */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444 }}>
            <Stack direction={'row'} m={'16px'} justifyContent={'space-between'}>
              <Stack direction={'row'}>
                <Icon icon={'lets-icons:chart-alt-light'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                نرخ تولید شیفت‌ها در هفته گذشته
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#00B051' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت 3
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#FF9600' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت 2
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#009DFF' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت ۱
                </Typography>
              </Stack>
            </Stack>
            <ColumnChart />
          </Card>
        </Grid>

        {/* Bottom side */}
        <Grid p={2} m={2} item container lg={12} xs={12} component={Card} sx={{ borderRadius: '8px' }}>
          {/* پیام‌های تعمیر و نگهداری */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'tabler:message'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  پیام‌های تعمیر و نگهداری
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Box
                sx={{
                  m: 0,
                  p: 0,
                  overflowY: 'auto', // Enable vertical scrolling
                  flexGrow: 1,
                  scrollbarWidth: 'none', // For Firefox
                  '&::-webkit-scrollbar': {
                    display: 'none' // For Chrome, Safari, and Edge
                  }
                }}
              >
                {messageList &&
                  messageList.map((message, index) => (
                    <MessagesComponent
                      key={index}
                      date={message.date}
                      summary={message.summary}
                      title={message.title}
                    />
                  ))}
              </Box>
            </Stack>
          </Grid>

          {/* هشدارهای پیش‌بینی‌کننده */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'tdesign:notification'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  هشدارهای پیش‌بینی‌کننده
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Box
                sx={{
                  m: 0,
                  p: 0,
                  overflowY: 'auto', // Enable vertical scrolling
                  flexGrow: 1,
                  scrollbarWidth: 'none', // For Firefox
                  '&::-webkit-scrollbar': {
                    display: 'none' // For Chrome, Safari, and Edge
                  }
                }}
              >
                {alertList &&
                  alertList.map((alert, index) => (
                    <MessagesComponent key={index} date={alert.date} summary={alert.summary} title={alert.title} />
                  ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MachineDetail

const ColoredDot: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block'
    }}
  />
)
