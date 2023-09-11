import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';


const LoginForm = () => {
  const navigate=useNavigate()
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [admin ,setAdmin]=useState(false);
  const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3000/api/search_user',
    {
      email:email,
      pass:pass,
      admin:admin
    },{ validateStatus: false })
        .then((res)=>{
          if(res.status==200){
            localStorage.setItem('userID',res.data._id)
            if(admin) navigate('/admin')
            else navigate('/customer')
          }
          else{
            alert(res.data.error)
          }
        })
  }
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">MotorQ-Login</Typography>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <TextField
            label="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={pass}
            onChange={(e)=>setPass(e.target.value)}
            variant="outlined"
            name='password'
            fullWidth
            margin="normal"
          />
          <FormControlLabel control={<Checkbox value={admin} onChange={(e)=>setAdmin(!admin)} name='admin_check'  />} label="Login as Admin" />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
          >
            Log In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;