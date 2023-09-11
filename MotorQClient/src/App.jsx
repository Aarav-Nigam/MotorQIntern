import React from 'react';
import LoginPage from './comnponents/login';
import CustomerPage from './comnponents/customer';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import AdminPage from './comnponents/admin';


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/admin" element={<AdminPage/>}/>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
