import { useLocation, useNavigate } from 'react-router-dom'
import { TextField } from '../components'
import { Grid, Stack, Box, Typography, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { register, userIsLoggedIn } from '../services/auth'

import logo from '../assets/img/logo.png'

const Register = ({ setCurrentRoute }) => {
  const location = useLocation()
  setCurrentRoute(location.pathname)

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    userIsLoggedIn(navigate, location.pathname)
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={0} sm={4}></Grid>
      <Grid item xs={12} sm={4}>
        <Stack direction={'column'}>
          <Box
            sx={{
              textAlign: 'center'
            }}
          >
            <img
              style={{
                height: '80px',
                width: 'auto',
                padding: '15px 0'
              }}
              src={logo}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Register
            </Typography>
          </Box>
          <TextField
            id={'name-register'}
            fullWidth={true}
            label={'Name'}
            type={'text'}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            id={'email-register'}
            fullWidth={true}
            label={'E-mail'}
            type={'email'}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            id={'username-register'}
            fullWidth={true}
            label={'Username'}
            type={'text'}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            id={'password-register'}
            fullWidth={true}
            label={'Password'}
            type={'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            size={'large'}
            variant={'contained'}
            onClick={async () => {
              const response = await register(username, name, email, password)
              if (response.status === 200) {
                alert('Você recebeu um e-mail de confirmação')
              } else if (response.status === 404) {
                alert(response.data.msg)
              }
            }}
          >
            Register
          </Button>
          <Button
            size={'large'}
            onClick={() => {
              navigate(`/login`)
            }}
          >
            Login
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Register
