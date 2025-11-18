// import { useEffect, useState } from "react";
// import axios from "axios";
// import AlertsPanel from "../components/AlertsPanel";

// const API_URL = "http://localhost:5000/api/alerts/latest";

// export default function Dashboard() {
//   const [readings, setReadings] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setReadings(res.data);
//     } catch (err) {
//       console.log("Error:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 3000); // update every 3 seconds
//     return () => clearInterval(interval);
//   }, []);

// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <h1 className="text-3xl font-bold mb-6">⚡ Substation Dashboard</h1>

// //       <div className="grid md:grid-cols-3 gap-4">
// //         {readings.map((r) => (
// //           <div
// //             key={r._id}
// //             className="p-4 bg-white rounded-xl shadow-md border"
// //           >
// //             <h2 className="text-xl font-semibold">{r.type.toUpperCase()}</h2>
// //             <p className="text-3xl font-bold mt-2">{r.value} {r.unit}</p>
// //             <p className="text-gray-500 text-sm mt-1">{r.sensorId}</p>
// //             <p className="text-gray-400 text-xs mt-2">
// //               {new Date(r.timestamp).toLocaleString()}
// //             </p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );


// // return (
// //   <div className="p-6 bg-gray-100 min-h-screen">
// //     <h1 className="text-3xl font-bold mb-6">⚡ Substation Dashboard</h1>

// //     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

// //       {/* Left side - Alerts */}
// //       <div className="lg:col-span-1">
// //         <AlertsPanel />
// //       </div>

// //       {/* Right side - Live sensor cards */}
// //       <div className="lg:col-span-3">
// //         <div className="grid md:grid-cols-3 gap-4">
// //           {readings.map((r) => (
// //             <div
// //               key={r._id}
// //               className="p-4 bg-white rounded-xl shadow-md border"
// //             >
// //               <h2 className="text-xl font-semibold">{r.type.toUpperCase()}</h2>
// //               <p className="text-3xl font-bold mt-2">
// //                 {r.value} {r.unit}
// //               </p>
// //               <p className="text-gray-500 text-sm mt-1">{r.sensorId}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //     </div>
// //   </div>
// // );



// return (
//   <div className="p-6 bg-gray-100 min-h-screen">
//     <h1 className="text-3xl font-bold mb-6">⚡ Substation Dashboard</h1>

//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

//       {/* Left side - Alerts */}
//       <div className="lg:col-span-1">
//         <AlertsPanel />
//       </div>

//       {/* Right side - Live sensor cards */}
//       <div className="lg:col-span-3">
//         <div className="grid md:grid-cols-3 gap-4">
//           {readings.map((r) => (
//             <div
//               key={r._id}
//               className="p-4 bg-white rounded-xl shadow-md border"
//             >
//               <h2 className="text-xl font-semibold">{r.type.toUpperCase()}</h2>
//               <p className="text-3xl font-bold mt-2">
//                 {r.value} {r.unit}
//               </p>
//               <p className="text-gray-500 text-sm mt-1">{r.sensorId}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   </div>
// );

// }



//---------------------------------------

// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import AlertsPanel from "../components/AlertsPanel";
import TrendChart from "../components/TrendChart";


const REST_API = "http://localhost:5000/api/alerts/latest";
const SOCKET_URL = "http://localhost:5000";

// ✅ Add time formatter
const formatTime = (time) => {
  if (!time) return "N/A";
  const d = new Date(time);
  return isNaN(d.getTime()) ? "Invalid" : d.toLocaleString();
};

export default function Dashboard() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    // initial load
    const fetchData = async () => {
      try {
        const res = await axios.get(REST_API);
        setReadings(res.data);
      } catch (err) {
        console.error("Initial fetch error:", err.message);
      }
    };
    fetchData();

    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("sensor_data", (payload) => {
      if (payload?.reading) {
        setReadings((prev) => [payload.reading, ...prev].slice(0, 100));
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
  
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">⚡ Substation Dashboard</h1>
<div>
      <h2 className="text-xl font-bold mb-4">Voltage & Current Trend (Last 10 min)</h2>
      <TrendChart />
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>

        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-3 gap-4">
            {readings.map((r) => (
              <div
                key={r._id}
                className="p-4 bg-white rounded-xl shadow-md border"
              >
                <h2 className="text-xl font-semibold">{r.type.toUpperCase()}</h2>
                <p className="text-3xl font-bold mt-2">
                  {r.value} {r.unit}
                </p>
                <p className="text-gray-500 text-sm mt-1">{r.sensorId}</p>

                {/* ✅ replaced timestamp */}
                <p className="text-gray-400 text-xs mt-2">
                  {formatTime(r.timestamp)}
                </p>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  
  
  );
}
