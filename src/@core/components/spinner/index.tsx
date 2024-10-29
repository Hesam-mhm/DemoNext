// ** MUI Import
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'


const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Image alt='لوگو' src={'/images/logo.png'} width={100} height={132.265} />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
