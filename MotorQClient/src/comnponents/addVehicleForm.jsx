import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
function CarInputForm() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/addModel', formData,{ validateStatus: false })
            .then((res) => {
                alert(res.data.message)
            })
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="VIN Prefix"
              name="vin"
              InputProps={{
                inputProps: {
                  pattern: '^[A-Z0-9]{8}$', // Set the regex pattern
                },
              }}
              value={formData.vin}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default CarInputForm;
