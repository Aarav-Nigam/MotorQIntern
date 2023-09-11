import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import {TextField} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import moment from 'moment';
import axios from 'axios';
import CarInputForm from './addVehicleForm';
import DashboardPieChart from './dashboard';



export default function AdminPage() {
    const [open, setOpen] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState(''); // 'accept' or 'reject'
    const [row, setRow] = React.useState("");
    const [rows, setRows] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const filteredRows = rows.filter((row) =>
        (row.vin.prefix + row.vin.suffix).toLowerCase().includes(searchText.toLowerCase())
    );
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRadioChange = (e) => {
        setRadioValue(e.target.value);
    };

    const handleSubmit = () => {
        // Do something with the inputValue
        axios.post('http://localhost:3000/api/enrollment_verdict', { verdict: radioValue, _id: row })
            .then((res) => {
                console.log(res.json())
            })
        setOpen(false);
    };
    React.useEffect(() => {
        axios.post('http://localhost:3000/api/enrollments', {})
            .then((res) => {
                if (res.status == 200) {
                    setRows(res.data)
                }
            })
    }, [])

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
            renderCell: (obj) => {
                return (
                    <Button
                        variant="contained"
                        // disabled={!(obj.row.status == 'pending')}
                        color="primary"
                        onClick={(event) => {
                            if ((obj.row.status == 'pending')) {
                                setRow(obj.row._id)
                                setOpen(true)
                            }
                        }}
                    >
                        {obj.row.status}
                    </Button>
                );
            }
        }
    ]
    return (
        <div className='h-100 d-flex flex-column align-items-center justify-content-center'>
            <h1>Admin Page</h1>
            <br />
            <h3>Dashboard</h3>
            <DashboardPieChart/>
            <br/>
            <h3>Enrollments</h3>
            <div>
                <TextField
                    label="Search By VIN"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows}
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enrollment Verdict</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select an option:
                    </DialogContentText>
                    <RadioGroup
                        aria-label="Accept or Reject"
                        name="acceptReject"
                        value={radioValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel
                            value="accept"
                            control={<Radio />}
                            label="Accept"
                        />
                        <FormControlLabel
                            value="reject"
                            control={<Radio />}
                            label="Reject"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <br/>
            <br/>
            <h3>Car Model Input Form</h3>
            <CarInputForm/>
        </div>

    );
}