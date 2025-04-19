import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ProgressChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const rawLog = JSON.parse(localStorage.getItem("goalLog") || "[]");
    const countPerDay = {};

    rawLog.forEach(entry => {
      countPerDay[entry.date] = (countPerDay[entry.date] || 0) + 1;
    });

    // Format for past 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().split("T")[0];
      return {
        date: iso.slice(5), // MM-DD
        count: countPerDay[iso] || 0
      };
    });

    setData(days);
  }, []);

  return (
    <div className="progress-chart">
      <h2>📊 Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4CAF50" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
