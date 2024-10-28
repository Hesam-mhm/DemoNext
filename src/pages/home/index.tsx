/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import { Icon } from '@iconify/react'
import {  Box, Card,  CircularProgress,  Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CardRows from 'src/comp/CardRows'
import MessagesComponent from 'src/comp/MessagesComponent'
import ProductionRateChart from 'src/comp/ProductionRateChart'
import { SearchableSection } from 'src/comp/search'
import { socket } from 'src/configs/mqttConfig'
import { MessagesType, SocketMessagesType } from 'src/types/ProductionLine.type'


const Home = () => {
  const [messages, setMessages] = useState<SocketMessagesType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [productionRate ,setProductionRate]= useState<number>(0)
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sockett, setSocket] = useState<any>();
  


  useEffect(() => {
        
    function onConnect() {
        setIsConnected(true);
    }
  
    function onDataReceived(receivedData: SocketMessagesType) {
      setSocket(receivedData)
          setMessages((prev)=>[...prev,receivedData]); 
    }
  
    function onDisconnect() {
        setIsConnected(false);
    }
  
    socket.on("connect", onConnect);
    socket.on("company_pm", onDataReceived);
    socket.on("disconnect", onDisconnect);
    socket.connect();
  
    return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=PM&entity_type=company`)
    
        if (res.status >= 200 && res.status < 300) {
           const finalRes = res.data.data as MessagesType[]

           const messages : SocketMessagesType[] = finalRes.reduce((acc :SocketMessagesType[],item:SocketMessagesType)=>{
            return [...acc,{title:item.title ,time:item.time ,summary:item.summary ,entity_id:item.entity_id ,message_type:item.message_type ,entity_type:item.entity_type }]
           },[])

           setMessages(messages)
        } else {
          toast.error('مشکلی در ارتباط با سرور رخ داده است !')
        }
        setLoading(false)
      } catch (error : any) {
        setLoading(false)
          toast.error('ارتباط برقرار نشد')
      }
    }
    setProductionRate(Math.floor(Math.random() * (100 - 70 + 1)) + 70)
    fetchMessages()
  },[])


  return (
    <Grid container>

      {/* Right Side */}
      <Grid m={2} item lg={3.9} md={3.9} sm={12} p={4} xs={12}component={Card}
        sx={{  backgroundColor: 'white',  height: 936, 
          display: 'flex',  flexDirection: 'column', overflow: 'hidden'  // Prevent overflow from affecting the layout
          }}>
        <SearchableSection />
      </Grid>


      {/* Left side */}
      <Grid p={2} m={2} item container lg={7.8} md={7.8} sm={12} xs={12} component={Card} sx={{
          backgroundColor: 'white' }}>


            
                  {/* کارخانه در یک نگاه */}
                  <Grid m={2} item lg={4.4} md={4.4} sm={12} xs={12} component={Stack} 
                  p={4}
                  direction={"column"}
                  sx={{ border: '2px solid ',borderColor:"#4c4e641f",borderRadius : "8px",height:468}}
                  >



                      <Stack direction={"row"} my={2}>
                        <Icon icon={"lucide:factory"} fontSize={20} fontWeight={500}/>
                        <Typography fontWeight={500} fontSize={14} color={"#1c1c1c"} ml={2}>
                                کارخانه در یک نگاه
                        </Typography>
                      </Stack>


                          <Divider variant='fullWidth' sx={{borderWidth:"1px"}}  />
                              
                              <CardRows title='OEE' color='#FF9600' value='65' bgColor='#FFF5E7'/>
                              <CardRows title='نرخ تولید' value={productionRate!.toString()} color={productionRate! > 70 && productionRate! <75 ? "#FF9600" : "#00B051"} bgColor={productionRate! > 75 && productionRate! <80 ? "#FFF5E7" : "#DFF5E9"}/>
                              <CardRows title='کیفیت تولید' value='69%' color='#00B051' bgColor='#DFF5E9'/>
                              <CardRows title='تعداد کل ماشین‌ها' value='12' color='#FF9600' bgColor='#FFF5E7'/>
                              <CardRows title='درصد ماشین‌های فعال' value='55' color='#00B051' bgColor='#DFF5E9'/>
              




                  </Grid>

                  {/* پیام‌های تعمیر و نگهداری */}
                    <Grid m={2} item lg={7.25} xs={12} component={Stack} direction={"column"} p={4}
                    sx={{ border: '2px solid ',borderColor:"#4c4e641f",borderRadius : "8px", height: 468 }}
                    >
                        <Stack direction={"row"} my={2}>
                          <Icon icon={"mingcute:settings-1-line"} fontSize={20} fontWeight={500}/>
                          <Typography fontWeight={500} fontSize={14} color={"#1c1c1c"} ml={2}>
                          پیام‌های تعمیر و نگهداری
                          </Typography>
                        </Stack>


                    <Divider variant='fullWidth' sx={{borderWidth:"1px"}} />
                    <Box 
                      sx={{ 
                        m:0,
                        p :0,
                        overflowY: 'auto',  // Enable vertical scrolling
                        flexGrow: 1 ,       
                        scrollbarWidth: 'none', // For Firefox
                        '&::-webkit-scrollbar': {
                          display: 'none',      // For Chrome, Safari, and Edge
                        },
                      }}
                    >
                 
                     {loading? <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
                      <CircularProgress />
                     </Stack>
                      :
                      messages.length ? 
                      messages.map((i,index)=>{
                        return <MessagesComponent 
                         animate={true} 
                         title={i.title}
                         date={i.time}
                         summary={i.summary}
                         key={index}
                        />
                       }).reverse() : messages.length === 0 || !messages ?
                       <Stack justifyContent={'center'} alignItems={"center"} height={"100%"}>

                       <Typography fontWeight={500} fontSize={14} color={"#aaaaaa"} ml={2} >

                         پیامی جهت نمایش وجود ندارد

                       </Typography>
                       
                       </Stack>
                       :""
                     }

           
                      

                      </Box>



                    </Grid>

                  {/*نمودار نرخ تولید در ۲۴ ساعت گذشته */}
                <Grid m={2} item lg={12} md={12} sm={12} xs={12} component={Stack}
                direction={"column"}
                 sx={{ border: '2px solid ',borderColor:"#4c4e641f",borderRadius : "8px", height: 396 }} p={4}
                >
                     <Stack direction={"row"} my={2}>
                      <Icon icon={"mynaui:line-chart-square"} fontSize={20} fontWeight={500}/>
                      <Typography fontWeight={500} fontSize={14} color={"#1c1c1c"} ml={2}>
                      نمودار نرخ تولید در ۲۴ ساعت گذشته
                      </Typography>
                     </Stack>


                <Divider variant='fullWidth' sx={{borderWidth:"1px"}} />
                <ProductionRateChart />

                </Grid>
      </Grid>

    </Grid>
  )
}

export default Home