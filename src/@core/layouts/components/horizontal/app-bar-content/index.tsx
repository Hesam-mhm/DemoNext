// ** Next Import
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Theme Config Import

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
}

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props

  // ** Hooks

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <StyledLink href='/'>
          <Image src={'/images/logo.png'} width={70} height={70} alt='logo' />
     

        </StyledLink>

      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
