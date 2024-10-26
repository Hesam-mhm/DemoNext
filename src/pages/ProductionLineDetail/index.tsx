// ** MUI Imports
import { Icon } from '@iconify/react'
import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CardRows from 'src/comp/CardRows'
import ColorlyCardInProductionDetail from 'src/comp/ColorlyCardInProductionDetail'
import MachineCard from 'src/comp/MachineCard'
import MessagesComponent from 'src/comp/MessagesComponent'
import generateRandomData from 'src/helper/dateGenerator'
import { MachineType } from 'src/types/ProductionLine.type'

const ProductionLineDetail = () => {
const [machinesList,setMachinesList] = useState<MachineType[]>([])
const [loading, setLoading] = useState<boolean>(false)


useEffect(()=>{
  const fetchMachines = async ()=>{
    setLoading(true)
    try {
      const response =  await axios.get("http://185.105.187.116:4002/sm/self_machines?department_name=خط تولید پوشاک")
      if (response.status >= 200 && response.status < 300) {
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
},[])

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
                mb: 3,
                width: '100%',
                height: 324,
                bgcolor: '#E2E2E2'
              }}
            ></Stack>

            <Stack
              p={4}
              direction={'column'}
              sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 550 }}
            >
              <Stack direction={'row'} my={2}>
                <Icon icon={'quill:stack-alt'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  خط تولید 1
                </Typography>
              </Stack>

              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />

              <CardRows title={'وضعیت'} value={'فعال'} color='#00B051' bgColor='#DFF5E9' />
              <CardRows title={'تعداد ماشین'} value={'20'} color='#FF0000' bgColor='#FFDFDF' />
              <CardRows title={'OEE'} value={'58%'} color='#00B051' bgColor='#DFF5E9' />
              <CardRows title={'نرخ تولید'} value={'70'} color='#FF9600' bgColor='#FFF5E7' />
              <CardRows title={'ظرفیت تولید'} value={'80'} color='#00B051' bgColor='#DFF5E9' />
              <CardRows title={'کیفیت تولید'} value={'75%'} color='#FF9600' bgColor='#FFF5E7' />
            </Stack>
          </Stack>
        </Card>
      </Grid>



      {/* Left side */}
      <Grid container item lg={9} height={940}>
          


          {/* Charts Card */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444 }} >

          <Stack direction={"row"} alignItems={"center"} spacing={2} p={2}>
              <ColorlyCardInProductionDetail 
                  title='فعال'
                bgColor='#FF9600' donutSeries={[48]} 
                barSeries={[{name:"sss",data:[3,30,20,22,16,5,10]}]}              
              /> 
               <ColorlyCardInProductionDetail 
               title='نرخ بهره‌وری'
                bgColor='#FF0000' donutSeries={[20]} 
                barSeries={[{name:"sss",data:[3,30,20,22,16,5,10]}]}              
              />

          </Stack>

          </Card>
        </Grid>


          {/* Machines List */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444 }}>
          <Stack sx={{height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'mingcute:settings-1-line'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                    ماشین ها 
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
              {
                machinesList.length ? machinesList.map((i)=>{

                  return <MachineCard 
                  key={i.name}
                  imageUrl={i.additional_fields!.image_name!}
                  timeLineData={generateRandomData("Machine 2", "2023-06-20 00:00", 6)}
                  machineName={i.name!}
                  status='فعال'
                  />
                }) : machinesList.length ===0 || !machinesList ? 
                <Stack justifyContent={'center'} alignItems={"center"} height={"100%"}>

                <Typography fontWeight={500} fontSize={14} color={"#aaaaaa"} ml={2} >

                  ماشینی جهت نمایش وجود ندارد

                </Typography>
                
                </Stack>
                
                :""
              }
                
               



              </Box>
            </Stack>

          </Card>
        </Grid>




      {/* Bottom side */}
      <Grid p={2}m={2} item container lg={12}
          xs={12} component={Card} sx={{ borderRadius: '8px' }}>

            {/* پیام‌های تعمیر و نگهداری */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'mingcute:settings-1-line'} fontSize={20} fontWeight={500} />
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
                <MessagesComponent />
                <MessagesComponent />
                <MessagesComponent />
                <MessagesComponent />
              </Box>
            </Stack>
          </Grid>


           {/* هشدارها */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'tdesign:notification'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  هشدارها
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
                <MessagesComponent />
                <MessagesComponent />
                <MessagesComponent />
                <MessagesComponent />
              </Box>
            </Stack>
          </Grid>


        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductionLineDetail
