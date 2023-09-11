import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box, Autocomplete } from '@mui/material';
const columns = [
  { field: 'make', valueGetter: ({ row }) => row.mmy.make, headerName: 'MAKE' },
  { field: 'model', valueGetter: ({ row }) => row.mmy.model, headerName: 'MODEL' },
  { field: 'year', valueGetter: ({ row }) => row.mmy.year, headerName: 'YEAR' },
  {
    field: 'vin',
    valueGetter: ({ row }) => row.vin.prefix + row.vin.suffix,
    headerName: 'VIN',
    width: 160,
  },
  {
    field: 'enrollmentAt',
    type: Date,
    valueGetter: ({ row }) => {
      return moment(row.enrollmentAt).format("YYYY MMMM DD hh:mm")
    },
    headerName: 'Enrollment At',
    width: 200,
  },
  {
    field: 'verdictedAt',
    type: Date,
    valueGetter: ({ row }) => {
      return moment(row.verdictedAt).format("YYYY MMMM DD hh:mm")
    },
    headerName: 'Verdicted At',
    width: 200,
  },
  {
    field: 'status',
    type: String,
    headerName: "Status",
    valueGetter: ({ row }) => {
      return row.status.toUpperCase()
    },
  }
]
const CustomerPage = () => {
  const [models, setModels] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVIN] = useState({ prefix: "", suffix: "" })
  const [filteredModels, setFilteredModels] = useState([]);
  const [rows, setRows] = React.useState([]);

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3000/api/enroll',
      {
        uid: localStorage.getItem('userID'),
        mmy: {
          make: make,
          model: model,
          year: year,
        },
        status: 'pending',
        vin: vin
      }, { validateStatus: false })
      .then((res) => {
        if (res.status == 200) {
          alert("Enrollment Successful!!")
        }
        else {
          alert("Error!! While Saving")
        }
      })

  }
  useEffect(() => {
    axios.get('http://localhost:3000/api/models')
      .then((res) => {
        if (res.status == 200) {
          setModels(res.data);
        }
        else {
          setModels([])
        }
      })
    axios.post('http://localhost:3000/api/enrollments/',{
      uid:localStorage.getItem('userID')
    })
      .then((res)=>{
        setRows(res.data)
      })

  })
  useEffect(() => {
    setFilteredModels(models);
    if (make != "") setFilteredModels(filteredModels.filter((obj) => obj.mmy.make == make));
    if (model != "") setFilteredModels(filteredModels.filter((obj) => obj.mmy.model == model));
    if (year != "") setFilteredModels(filteredModels.filter((obj) => obj.mmy.year == year));
    if (filteredModels.length == 1) setVIN({ ...vin, prefix: filteredModels[0].vin })
  }, [make, model, year, models])
  return (
    <>
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center">Customer Enrollment Form</Typography>
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* Add your form fields here */}
          <Autocomplete
            disablePortal
            required
            fullWidth
            margin="normal"
            onChange={(event, value) => value ? setMake(value.mmy.make) : setMake("")}
            options={filteredModels}
            getOptionLabel={(option) => option.mmy.make}
            isOptionEqualToValue={(option, value) => option.mmy.make === value.mmy.make}
            renderInput={(params) => <TextField {...params} required label="Make" />}
          />
          <br />
          <Autocomplete
            disablePortal
            fullWidth
            required
            margin="normal"
            onChange={(event, value) => value ? setModel(value.mmy.model) : setModel("")}
            options={filteredModels}
            getOptionLabel={(option) => option.mmy.model}
            isOptionEqualToValue={(option, value) => option.mmy.model === value.mmy.model}
            renderInput={(params) => <TextField {...params} required label="Model" />}
          />
          <br />
          <Autocomplete
            disablePortal
            fullWidth
            margin="normal"
            onChange={(event, value) => value ? setYear(value.mmy.year) : setYear("")}
            options={filteredModels}
            getOptionLabel={(option) => option.mmy.year}
            isOptionEqualToValue={(option, value) => option.mmy.year === value.mmy.year}
            renderInput={(params) => <TextField {...params} required label="Year" />}
          />
          <br />
          <TextField
            fullWidth
            required
            margin="normal"
            disabled
            label="VIN-prefix"
            value={vin.prefix}
          />
          <br />
          <TextField
            fullWidth
            required
            margin="normal"
            onChange={(e) => setVIN({ ...vin, suffix: e.target.value })}
            label="VIN-suffix"
            InputProps={{
              inputProps: {
                pattern: '^[A-Z0-9]{9}$', // Set the regex pattern
              },
            }}
            value={vin.suffix}
          />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
      
    </Container>
    <br/>
    <br/>
    <Container >
    <div className='h-100 d-flex flex-column align-items-center justify-content-center'>
        <h3>Enrollments</h3>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            getRowId={(row) => row._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>

      </div>
    </Container>
    </>
  );
};

export default CustomerPage;
