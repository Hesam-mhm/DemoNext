/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from '@iconify/react'
import { Box, Card, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CardRows from 'src/comp/CardRows'
import { MachineDetailType, MachineSocketDataType, MachineType, MessagesType, SocketMessagesType } from 'src/types/ProductionLine.type'
import TimelineChart from 'src/comp/timeLineChart'
import MessagesComponent from 'src/comp/MessagesComponent'
import ColumnChart from 'src/comp/ColumnChart'
import generateRandomData from 'src/helper/dateGenerator'
import GaugeChart from 'src/comp/GaugeChart'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { socket } from 'src/configs/mqttConfig'

interface ShiftDataType {
  name: string
  data: number[]
}
interface GaugeDataType {
  oee: number
  quality: number
  energy: number
  rate: number
}

const MachineDetail = () => {
  const{id} = useRouter().query 

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [productionCapacity ,setProductionCapacity]= useState<number>(0)
  const [columnList, setColumnList] = useState<ShiftDataType[]>([])
  const [machineDetailLoading, setMachineDetailLoading] = useState<boolean>(false)
  const [machineDetail, setMachineDetail] = useState<MachineDetailType>()
  const [pmMessages, setPmMessages] = useState<SocketMessagesType[]>([])
  const [aIMessages, setAiMessages] = useState<SocketMessagesType[]>([])
  const [machineData,setMachineData]= useState<MachineSocketDataType>({
    data:{oee:93 ,production_quality:82,production_rate:76,status:0,energy_usage:74},
    machine_id:0
      })
  


////fetch pm Messages socket Data
useEffect(() => {
        
  function onConnect() {
      setIsConnected(true);
  }

  function onDataReceived(receivedData: SocketMessagesType) {
      console.log(receivedData);
      console.log(socket.on);
      if(receivedData.entity_id !== id){

        setPmMessages((prev)=>[...prev,receivedData]); 
      }
    }

  function onDisconnect() {
      setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("machine_pm", onDataReceived);
  socket.on("disconnect", onDisconnect);
  socket.connect();

  return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
  };
}, []);

////fetch Ai Messages socket Data
useEffect(() => {
        
  function onConnect() {
      setIsConnected(true);
  }

  function onDataReceived(receivedData: SocketMessagesType) {
      console.log(receivedData);
      console.log(socket.on);
      if(receivedData.entity_id !== id){

        setAiMessages((prev)=>[...prev,receivedData]); 
      }
    }

  function onDisconnect() {
      setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("machine_ai", onDataReceived);
  socket.on("disconnect", onDisconnect);
  socket.connect();

  return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
  };
}, []);


// fetch department socket data
useEffect(() => {
        
  function onConnect() {
      setIsConnected(true);
  }

  function onDataReceived(receivedData: MachineSocketDataType) {
    if (receivedData.machine_id?.toString() === id) {
      
      setMachineData(receivedData); 
    }
  }

  function onDisconnect() {
      setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("machine_data", onDataReceived);
  socket.on("disconnect", onDisconnect);
  socket.connect();

  return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
  };
}, [id]);




  const generateRandomDataForColumnChart = () => {
    return [
      {
        name: 'شیفت 1',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      },
      {
        name: 'شیفت 2',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      },
      {
        name: 'شیفت 3',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      }
    ]
  }

  useEffect(() => {
    setColumnList(generateRandomDataForColumnChart())

    const interval = setInterval(() => {
      setColumnList(prevColumnList => {
        return prevColumnList.map(shift => {
          const newData = [...shift.data]
          const lastValue = newData[newData.length - 1]

          // تولید یک عدد تصادفی جدید با حداکثر اختلاف 10
          const randomChange = Math.floor(Math.random() * 21) - 10 // بین -10 و 10
          const newValue = lastValue + randomChange

          // اطمینان از اینکه مقدار جدید در محدوده 50 تا 200 قرار گیرد
          newData[newData.length - 1] = Math.max(50, Math.min(newValue, 200))

          return { ...shift, data: newData }
        })
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => { 
    const fetchMachinedetail = async ()=>{
      setMachineDetailLoading(true)
      try {
        const response =  await axios.get(`http://185.105.187.116:4002/sm/self_machines/${id}`)
        if (response.status >= 200 && response.status < 300) {
          setMachineDetail(response.data.data as MachineDetailType)
        } else {
          toast.error('مشکلی در دریافت جزئیات  ماشین رخ داده است !')
        }
        setMachineDetailLoading(false)
  
      } catch (error) {
        setMachineDetailLoading(false)
  
        // toast.error('مشکلی در دریافت جزئیات خط تولید رخ داده است !')
  
      }
    }

    setProductionCapacity(Math.floor(Math.random() * (100 - 70 + 1)) + 70)
    fetchMessageService()
    fetchMachinedetail()
  }, [id])



  const fetchMessageService = async () => {
    const res = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=PM&entity_type=machine`)
    if (res.status >= 200 && res.status < 300) {
      const finalPmRes = res.data.data as MessagesType[]

      const pmMessages : SocketMessagesType[] = finalPmRes.reduce((acc :SocketMessagesType[],item:SocketMessagesType)=>{
        return [...acc,{title:item.title ,time:item.time ,summary:item.summary ,entity_id:item.entity_id ,message_type:item.message_type ,entity_type:item.entity_type }]
       },[])
      setPmMessages(pmMessages)
    }

    const alertRes = await axios.get(
      `http://45.156.185.218:7008/message_service/list?message_type=AI&entity_type=machine`
    )
    if (alertRes.status >= 200 && alertRes.status < 300) {
      const finalAiRes = alertRes.data.data as MessagesType[]

      const aIMessages : SocketMessagesType[] = finalAiRes.reduce((acc :SocketMessagesType[],item:SocketMessagesType)=>{
        return [...acc,{title:item.title ,time:item.time ,summary:item.summary ,entity_id:item.entity_id ,message_type:item.message_type ,entity_type:item.entity_type }]
       },[])  
      setAiMessages(aIMessages)
    }
  }



  return (
    <Grid container height={'100%'}>
      {/* Right Side */}
      <Grid p={2} item lg={3} xs={12}>
        {machineDetailLoading ? <Stack justifyContent={"center"} alignItems={"center"} > <CircularProgress /> </Stack> :
                <Card
                sx={{
                  p: 3,
                  backgroundColor: 'white',
                  height: 920,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Stack sx={{ flexGrow: 1 }}>
                  <Stack
                    sx={{
                      mb: 0,
                      width: '100%',
                      flexGrow: 1,
                      maxHeight: 350,
                      bgcolor: '#F9F9F9',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img alt='desc'
                     src={`http://185.105.187.116:4002/static/images/${machineDetail?.additional_fields?.image_name}`} 
                     style={{
                        width: "100%",
                        height: "100%",
                        borderRadius:"8px",
                        objectFit: "cover" // Ensures image covers the container without stretching
                          }}  />
                  </Stack>
                  <Stack width='100%' p={0} m={0}>
                    <TimelineChart machinesData={generateRandomData('Machine 2', '2023-06-20 00:00', 6)} />
                  </Stack>
      
                  <Stack
                    p={4}
                    direction={'column'}
                    sx={{
                      border: '2px solid ',
                      borderColor: '#4c4e641f',
                      borderRadius: '8px',
                      pb: '16px',
                      flexGrow: 0
                    }}
                  >
                    <Stack direction={'row'} my={2}>
                      <Icon icon={'tabler:settings-2'} fontSize={20} fontWeight={500} />
                      <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                        {machineDetail?.name}
                      </Typography>
                    </Stack>
                    <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        برند
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {machineDetail?.brand}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        نام اپراتور
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {"حسام محمدی"}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        تاریخ تولید
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {machineDetail?.made_on}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        دسته‌بندی
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {machineDetail?.machine_type}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        زیرمجموعه
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {machineDetail?.machine_subtype}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                      <Typography fontWeight={500} fontSize={14}>
                        ظرفیت تولید
                      </Typography>
                      <Typography fontWeight={500} fontSize={14}>
                        {productionCapacity}
                      </Typography>
                    </Stack>
                    <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
                    <CardRows
                      title={'وضعیت'}
                      value={machineData.data.status ===1 ? "فعال":"غیرفعال"}
                      color={machineData.data.status ===1 ? '#00B051' : '#FF0000'}
                      bgColor={machineData.data.status ===1 ? '#DFF5E9' : '#FFDFDF'}
                    />
                  </Stack>
                </Stack>
              </Card>
        }

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
                  <GaugeChart value={machineData!.data!.oee!} label='OEE'  min={0} max={100}/>
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
                  <GaugeChart value={machineData!.data!.production_quality!} label='کیفیت تولید'  min={0} max={100}/>
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
                  <GaugeChart value={machineData!.data!.production_rate!} label='نرخ تولید' withPercentage={false} min={0} max={100}/>
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
                  <GaugeChart value={machineData!.data!.energy_usage!} label='مصرف انرژی' min={0} max={100}/>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Column Chart */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444 }}>
            <Stack direction={'row'} ml={'24px'}my={'16px'} mr={"32px"} justifyContent={'space-between'}>
              <Stack direction={'row'}>
                <Icon icon={'lets-icons:chart-alt-light'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={15} color={'#1c1c1c'} ml={2}>
                  نمودار نرخ تولید در هفته گذشته
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#FF9600' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت 3
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#00B051' />
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
            <ColumnChart series={columnList} />
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
                  overflowY: 'auto',
                  flexGrow: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {pmMessages.length ? (
                  pmMessages.map((message, index) => (
                    <MessagesComponent
                     animate={true}
                      key={index}
                      date={message.time}
                      summary={message.summary}
                      title={message.title}
                    />
                  )).reverse()
                ) : (
                  <Typography>پیامی وجود ندارد!</Typography>
                )}
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
                  overflowY: 'auto',
                  flexGrow: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {aIMessages.length ? (
                  aIMessages.map((alert, index) => (
                    <MessagesComponent animate={true} key={index} date={alert.time} summary={alert.summary} title={alert.title} />
                  ))
                ).reverse() : (
                  <Typography>هشداری وجود ندارد!</Typography>
                )}
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
