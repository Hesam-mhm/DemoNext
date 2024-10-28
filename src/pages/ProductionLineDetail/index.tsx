/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import { Icon } from '@iconify/react'
import { Box, Card, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CardRows from 'src/comp/CardRows'
import ColorlyCardInProductionDetail from 'src/comp/ColorlyCardInProductionDetail'
import MachineCard from 'src/comp/MachineCard'
import MessagesComponent from 'src/comp/MessagesComponent'
import { socket } from 'src/configs/mqttConfig'
import generateRandomData from 'src/helper/dateGenerator'
import { MachineType, DepartmentType, MessagesType, SocketMessagesType } from 'src/types/ProductionLine.type'

const ProductionLineDetail = () => {
  const{id} = useRouter().query 


  const [pmMessages, setPmMessages] = useState<SocketMessagesType[]>([])
  const [aIMessages, setAiMessages] = useState<SocketMessagesType[]>([])
  const [machinesList,setMachinesList] = useState<MachineType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [productionRate ,setProductionRate]= useState<number>(0)
  const [performanceRate ,setPerformanceRate]= useState<number>(0)
  const [activeRate ,setActiveRate]= useState<number>(0)
  const [productionCapacity ,setProductionCapacity]= useState<number>(0)
  const [productionLineDetail, setproductionLineDetail ] = useState<DepartmentType>();
  const [productionLoading, setProductionLoading] = useState<boolean>(false)
  const [randomArrayForCartCharts ,setRandomArrayForCartCharts] = useState<number[]>([0,0,0,0,0,0,0])
  const [randomArrayForCartCharts2 ,setRandomArrayForCartCharts2] = useState<number[]>([0,0,0,0,0,0,0])
  const [statusList,setStatusList] = useState<boolean[]>([])

  function generateRandomArray() {
    const array :number[] = [];
    while (array.length < 7) {
        const randomNum = Math.floor(Math.random() * 30) + 1;
        if (!array.includes(randomNum)) {
            array.push(randomNum);
        }
    }

    return array;
}


////fetch Machines
useEffect(()=>{
  const fetchMachines = async ()=>{
    setLoading(true)
    try {
      const response =  await axios.get(`http://185.105.187.116:4002/sm/self_machines?department_id=${id}`)
      if (response.status >= 200 && response.status < 300) {
        setMachinesList(response.data.data as MachineType[])
        const statusList = response.data.data.map(() => Math.random() >= 0.5);
        setStatusList(statusList)
      } else {
        toast.error('مشکلی در دریافت لیست ماشین ها داده است !')
      }
      setLoading(false)

    } catch (error) {
      setLoading(false)

      // toast.error('مشکلی در دریافت لیست ماشین ها داده است !')

    }


}

setProductionRate(Math.floor(Math.random() * (100 - 70 + 1)) + 70)
setPerformanceRate(Math.floor(Math.random() * (50 - 20 + 1)) + 20)
setActiveRate(Math.floor(Math.random() * (70 - 50 + 1)) + 50)
setProductionCapacity(Math.floor(Math.random() * (100 - 70 + 1)) + 70)
setRandomArrayForCartCharts(generateRandomArray)
setRandomArrayForCartCharts2(generateRandomArray)
fetchMachines()
},[id])


//fetch DepartmentDetail
useEffect(()=>{
  const fetchProductionLine = async ()=>{
    setProductionLoading(true)
    try {
      const response =  await axios.get(`http://185.105.187.116:4002/departments/get/${id}`)
      if (response.status >= 200 && response.status < 300) {
        setproductionLineDetail(response.data.data as DepartmentType)
      } else {
        toast.error('مشکلی در دریافت جزئیات خط تولید رخ داده است !')
      }
      setProductionLoading(false)

    } catch (error) {
      setProductionLoading(false)

      // toast.error('مشکلی در دریافت جزئیات خط تولید رخ داده است !')

    }


}
fetchProductionLine()
},[id])


useEffect(() => {
  const fetchMessages = async () => {
    setLoading(true)
    try {
      const resPm = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=PM&entity_type=department&entity_id=${id}`)
      const resAi = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=AI&entity_type=department&entity_id=${id}`)
  
      if (resPm.status >= 200 &&resAi.status >= 200 && resPm.status < 300 && resAi.status < 300) {
        // setTimeLine(randomData)
          const finalPmRes = resPm.data.data as MessagesType[]
          const finalAiRes = resAi.data.data as MessagesType[]
            


          const pmMessages : SocketMessagesType[] = finalPmRes.reduce((acc :SocketMessagesType[],item:SocketMessagesType)=>{
           return [...acc,{title:item.title ,time:item.time ,summary:item.summary ,entity_id:item.entity_id ,message_type:item.message_type ,entity_type:item.entity_type }]
          },[])

          const aIMessages : SocketMessagesType[] = finalAiRes.reduce((acc :SocketMessagesType[],item:SocketMessagesType)=>{
           return [...acc,{title:item.title ,time:item.time ,summary:item.summary ,entity_id:item.entity_id ,message_type:item.message_type ,entity_type:item.entity_type }]
          },[])        


        setPmMessages(pmMessages)
        setAiMessages(aIMessages)
      } else {
        toast.error('مشکلی در ارتباط با سرور رخ داده است !')
      }
      setLoading(false)
    } catch (error : any) {
      setLoading(false)
        toast.error('ارتباط برقرار نشد')
    }
  }

  fetchMessages()
}, [id])


////fetch pm Messages socket Data
useEffect(() => {
        
  function onConnect() {
      setIsConnected(true);
  }

  function onDataReceived(receivedData: SocketMessagesType) {
      console.log(receivedData);
      console.log(socket.on);
      
      setPmMessages((prev)=>[...prev,receivedData]); 
    }

  function onDisconnect() {
      setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("department_pm", onDataReceived);
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
      
      setAiMessages((prev)=>[...prev,receivedData]); 
    }

  function onDisconnect() {
      setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("department_ai", onDataReceived);
  socket.on("disconnect", onDisconnect);
  socket.connect();

  return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
  };
}, []);


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
          {productionLoading ?<Stack justifyContent={"center"} alignItems={"center"} height={"100%"} > <CircularProgress /> </Stack> :
                    <Stack>
   
                    <Stack 
                       sx={{
                         mb: 3,
                         width: '100%',
                         height: 324,
                         bgcolor: '#E2E2E2',
                         borderRadius: "8px",
                         overflow: "hidden", // Ensures image is clipped if it's larger than container
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         }}
                    >
                                 <img 
                               src={`http://185.105.187.116:4002/static/images/${productionLineDetail?.additional_fields?.image_name}`}
                               alt="Department Image" 
                               style={{
                                     width: "100%",
                                     height: "100%",
                                     objectFit: "cover" // Ensures image covers the container without stretching
                               }} 
                               />
                     </Stack> 
 
 
             <Stack
               p={4}
               direction={'column'}
               sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 550 }}
             >
               <Stack direction={'row'} my={2}>
                 <Icon icon={'quill:stack-alt'} fontSize={20} fontWeight={500} />
                 <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                   {productionLineDetail?.name_persian}
                 </Typography>
               </Stack>
 
               <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
 
               <CardRows title={'وضعیت'} value={'فعال'} color='#00B051' bgColor='#DFF5E9' />
               <CardRows title={'تعداد ماشین'} value={'4'} color='' bgColor='' />
               <CardRows title={'OEE'} value={'58%'} color='#00B051' bgColor='#DFF5E9' />
               <CardRows title='نرخ تولید' value={productionRate!.toString()} color={productionRate! > 70 && productionRate! <75 ? "#FF9600" : "#00B051"} bgColor={productionRate! > 75 && productionRate! <80 ? "#FFF5E7" : "#DFF5E9"}/>
               <CardRows title={'ظرفیت تولید'} value={productionCapacity.toString()} color='#00B051' bgColor='#DFF5E9' />
               <CardRows title={'کیفیت تولید'} value={'75%'} color='#FF9600' bgColor='#FFF5E7' />
             </Stack>
           </Stack>
          }

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
                bgColor={activeRate <55 ? "#FF0000":activeRate > 55 && activeRate < 65 ?"#FF9600":"green"} donutSeries={[activeRate]} 
                barSeries={[{name:"sss",data:randomArrayForCartCharts2}]}              
              /> 
               <ColorlyCardInProductionDetail 
               title='نرخ بهره‌وری'
                bgColor={performanceRate <30 ? "#FF0000":"#FF9600"} donutSeries={[performanceRate]} 
                barSeries={[{name:"فعال",data:randomArrayForCartCharts}]}              
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
              { loading ?<Stack justifyContent={"center"} alignItems={"center"} height={"100%"}> <CircularProgress /> </Stack> :
                machinesList.length ? machinesList.map((i,index)=>{

                  return <MachineCard 
                  key={i.name}
                  imageUrl={i.additional_fields!.image_name!}
                  timeLineData={generateRandomData("Machine 2", "2023-06-20 00:00", 6)}
                  machineName={i.name!}
                  status={statusList[index]}
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
                          {loading? <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
                      <CircularProgress />
                     </Stack>
                      :
                      pmMessages.length ? 
                      pmMessages.map((i,index)=>{
                        return <MessagesComponent 
                        animate={true}
                         title={i.title}
                         date={i.time}
                         summary={i.summary}
                         key={index}
                        />
                       }).reverse() : pmMessages.length === 0 || !pmMessages ?
                       <Stack justifyContent={'center'} alignItems={"center"} height={"100%"}>

                       <Typography fontWeight={500} fontSize={14} color={"#aaaaaa"} ml={2} >

                         پیامی جهت نمایش وجود ندارد

                       </Typography>
                       
                       </Stack>
                       :""
                     }
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
                     {loading? <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
                      <CircularProgress />
                     </Stack>
                      :
                      aIMessages.length ? 
                      aIMessages.map((i,index)=>{
                        return <MessagesComponent 
                        animate={true}
                         title={i.title}
                         date={i.time}
                         summary={i.summary}
                         key={index}
                        />
                       }).reverse() : aIMessages.length === 0 || !aIMessages ?
                       <Stack justifyContent={'center'} alignItems={"center"} height={"100%"}>

                       <Typography fontWeight={500} fontSize={14} color={"#aaaaaa"} ml={2} >

                         پیامی جهت نمایش وجود ندارد

                       </Typography>
                       
                       </Stack>
                       :""
                     }
              </Box>
            </Stack>
          </Grid>


        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductionLineDetail
