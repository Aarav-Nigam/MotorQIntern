import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// const data = [
//   { name: 'Category A', value: 400 },
//   { name: 'Category B', value: 300 },
//   { name: 'Category C', value: 200 },
//   { name: 'Category D', value: 100 },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function DashboardPieChart() {
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:3000/api/pieData').then((res) => {
      if (res.status == 200) {
        const temp=res.data
        const newArr=temp.map(obj => ({
          ...obj,
          ['name']: obj['_id'],
        }));
        console.log(newArr)
        setData(newArr)
      }
    })
  },[])
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DashboardPieChart;
