"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  visits: number;
  orders: number;
}

interface ChartComponentProps {
  data: DataPoint[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="visits" stroke="#8884d8" />
        <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
