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
import { MessagesType } from 'src/types/ProductionLine.type'


const Home = () => {
  const [messages, setMessages] = useState<MessagesType[] | []>([])
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const fetchProductionLines = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=PM&entity_type=company`)
    
        if (res.status >= 200 && res.status < 300) {
          // setTimeLine(randomData)


           setMessages(res.data.data as MessagesType[])
        } else {
          toast.error('مشکلی در ارتباط با سرور رخ داده است !')
        }
        setLoading(false)
      } catch (error : any) {
        setLoading(false)
          toast.error('ارتباط برقرار نشد')
      }
    }

    fetchProductionLines()
  }, [])



  return (
    <Grid container>

      {/* Right Side */}
      <Grid m={2} item lg={3.9} p={4} xs={12}component={Card}
        sx={{  backgroundColor: 'white',  height: 936, 
          display: 'flex',  flexDirection: 'column', overflow: 'hidden'  // Prevent overflow from affecting the layout
          }}>
        <SearchableSection />
      </Grid>


      {/* Left side */}
      <Grid p={2} m={2} item container lg={7.8} xs={12} component={Card} sx={{
          backgroundColor: 'white' }}>


            
                  {/* کارخانه در یک نگاه */}
                  <Grid m={2} item lg={4.4} xs={12} component={Stack} 
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
                              <CardRows title='نرخ تولید' value='70' color='' bgColor=''/>
                              <CardRows title='کیفیت تولید' value='69%' color='#00B051' bgColor='#DFF5E9'/>
                              <CardRows title='تعداد کل ماشین‌ها' value='95' color='#FF9600' bgColor='#FFF5E7'/>
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
                      messages.map((i)=>{
                        return <MessagesComponent 
                         title={i.title}
                         date={i.created_at}
                         summary={i.summary}
                         key={i.id}
                        />
                       }) : messages.length === 0 || !messages ?
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
                <Grid m={2} item lg={12} xs={12} component={Stack}
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