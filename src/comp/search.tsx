import { Box, CircularProgress, Divider, FormControl, Stack, TextField, Typography, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { ProductionLineType } from 'src/types/ProductionLine.type'
import axios from 'axios'
import toast from 'react-hot-toast'
import ProductionLineCardComponent from './ProductionLineCardComponent'
import { Controller, useForm } from 'react-hook-form'
import debounce from 'lodash/debounce'
import generateRandomData from 'src/helper/dateGenerator'

type SearchableSectionProps = {
  withFilter?: boolean
  onFilterClick?: () => void
}



export const SearchableSection: React.FC<SearchableSectionProps> = ({ onFilterClick, withFilter = true }) => {
  const [productionLine, setProductionLine] = useState<ProductionLineType[] | []>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [statusList,setStatusList] = useState<boolean[]>([])
  const { control } = useForm({ defaultValues: { search: '' } })
  const theme = useTheme()


 


  // Fetch production lines based on search or get all
  useEffect(() => {
    const fetchProductionLines = async () => {
      setLoading(true)
      try {
        let res
        if (searchQuery) {
          res = await axios.get(`http://185.105.187.116:4002/departments/search?query=${searchQuery}`)
        } else {
          res = await axios.get('http://185.105.187.116:4002/departments/list')
        }

        if (res.status >= 200 && res.status < 300) {
          // setTimeLine(randomData)


           setProductionLine(res.data.data as ProductionLineType[])
           const statusList = res.data.data.map(() => Math.random() >= 0.5);
           setStatusList(statusList)
          } else {
          toast.error('مشکلی در ارتباط با سرور رخ داده است !')
        }
        setLoading(false)
      } catch (error : any) {
        setLoading(false)
        console.log(error.response.status)
        if (error.response.status) {
          setProductionLine([])
        } else {
          toast.error('ارتباط برقرار نشد')
        }
      }
    }

    fetchProductionLines()
  }, [searchQuery])



  // Debounced search input handler
  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value)
  }, 500) // Debounce for 500ms

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          borderRadius: '0px',
          backgroundColor: theme.palette.background.paper,
          alignItems: 'center'
        }}
      >
        <FormControl fullWidth>
          <Controller
            name='search'
            control={control}
            render={({ field: { onChange } }) => (
              <TextField
                onChange={e => {
                  onChange(e)
                  handleSearchChange(e.target.value) // Debounced search
                }}
                InputProps={{
                  startAdornment: (
                    <Icon
                      fontSize={20}
                      color={theme.palette.grey?.[700]}
                      icon={'hugeicons:search-01'}
                      style={{ marginLeft: '12px' }}
                    />
                  ),
                  endAdornment: withFilter ? (
                    <Box
                      onClick={onFilterClick}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Divider sx={{ mx: '12px' }} orientation='vertical' variant='fullWidth' flexItem />
                      <Icon icon={'hugeicons:filter'} fontSize={17} color={theme.palette.grey?.[700]} />
                      <Typography
                        sx={{ ml: '12px', fontSize: '14px', fontWeight: '400', color: theme.palette.grey?.[400] }}
                      >
                        فیلتر
                      </Typography>
                    </Box>
                  ) : null
                }}
                placeholder='جستجو'
                sx={{ height: '56px', my: '16px' }}
                fullWidth
              />
            )}
          />
        </FormControl>
      </Box>

      <Stack direction={'row'} mb={2}>
        <Icon icon={'quill:stack-alt'} fontSize={20} fontWeight={500} />
        <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
          خط های تولید
        </Typography>
      </Stack>

      {/* Wrapper for the scrollable content */}
      <Box
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          scrollbarWidth: 'none', // For Firefox
          '&::-webkit-scrollbar': {
            display: 'none' // For Chrome, Safari, and Edge
          }
        }}
      >
        {loading ? (
          <Stack justifyContent={'center'} alignItems={'center'} height={"100%"}>
            <CircularProgress />
          </Stack>
        ) : productionLine.length ? (
          productionLine.map((i,index) => (
            <ProductionLineCardComponent
              timeLineData={generateRandomData("Machine 2", "2023-06-20 00:00", 6)}
              id={i.id!.toString()}
              key={i.id}
              imageUrl={i.additional_fields!.image_name!}
              departmentName={i.name_persian!}
              machineCount={i.additional_fields!.machine_counts!}
              productionRate={25}
              status={statusList[index]}
            />
          ))
        ) : (
          <Stack justifyContent={'center'} alignItems={'center'} height={"100%"}>
            <Typography>خط تولید وجود ندارد</Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  )
}
export default SearchableSection

