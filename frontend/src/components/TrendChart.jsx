import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function TrendChart() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/api/history/last10");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map((h) =>
      new Date(h.timestamp).toLocaleTimeString()
    ),

    datasets: [
      {
        label: "Voltage (kV)",
        data: history.map((h) => h.voltage),
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.2,
      },
      {
        label: "Current (A)",
        data: history.map((h) => h.current),
        borderColor: "red",
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-[300px]">
      <Line data={chartData} />
    </div>
  );
}
