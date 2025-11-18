// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // const API_URL = "http://localhost:5000/api/alerts/active";

// // export default function AlertsPanel() {
// //   const [alerts, setAlerts] = useState([]);

// //   const fetchAlerts = async () => {
// //     try {
// //       const res = await axios.get(API_URL);
// //       setAlerts(res.data);
// //     } catch (err) {
// //       console.log("Error fetching alerts", err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAlerts();
// //     const interval = setInterval(fetchAlerts, 3000); // refresh alerts every 3 sec
// //     return () => clearInterval(interval);
// //   }, []);

// //   const severityColor = {
// //     critical: "bg-red-600",
// //     high: "bg-orange-500",
// //     medium: "bg-yellow-400",
// //     low: "bg-blue-400",
// //   };

// //   return (
// //     <div className="p-4 bg-white rounded-xl shadow-lg border max-h-[350px] overflow-auto">
// //       <h2 className="text-2xl font-bold mb-4">⚠ Live Alerts</h2>

// //       {alerts.length === 0 && (
// //         <p className="text-gray-500">No active alerts ✔</p>
// //       )}

// //       {alerts.map((a, idx) => (
// //         <div
// //           key={idx}
// //           className={`p-3 mb-3 rounded-lg text-white ${severityColor[a.severity]}`}
// //         >
// //           <p className="font-semibold">{a.msg}</p>
// //           <p className="text-sm">Sensor: {a.sensor}</p>
// //           <p className="text-xs">
// //             {new Date(a.time).toLocaleTimeString()}
// //           </p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }






// import { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/alerts/active";

// export default function AlertsPanel() {
//   const [alerts, setAlerts] = useState([]);

//   const fetchAlerts = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setAlerts(res.data);
//     } catch (err) {
//       console.log("Error fetching alerts", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//     const interval = setInterval(fetchAlerts, 3000); // refresh alerts every 3 sec
//     return () => clearInterval(interval);
//   }, []);

//   const severityColor = {
//     critical: "bg-red-600",
//     high: "bg-orange-500",
//     medium: "bg-yellow-400",
//     low: "bg-blue-400",
//   };

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-lg border max-h-[350px] overflow-auto">
//       <h2 className="text-2xl font-bold mb-4">⚠ Live Alerts</h2>

//       {alerts.length === 0 && (
//         <p className="text-gray-500">No active alerts ✔</p>
//       )}

//       {alerts.map((a, idx) => (
//         <div
//           key={idx}
//           className={`p-3 mb-3 rounded-lg text-white ${severityColor[a.severity]}`}
//         >
//           <p className="font-semibold">{a.msg}</p>
//           <p className="text-sm">Sensor: {a.sensor}</p>
//           <p className="text-xs">
//             {new Date(a.time).toLocaleTimeString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }




//--------------------------

// // frontend/src/components/AlertsPanel.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client";

// const REST_API = "http://localhost:5000/api/alerts/active";
// const SOCKET_URL = "http://localhost:5000";

// export default function AlertsPanel() {
//   const [alerts, setAlerts] = useState([]);

//   useEffect(() => {
//     const fetchAlerts = async () => {
//       try {
//         const res = await axios.get(REST_API);
//         setAlerts(res.data);
//       } catch (err) {
//         console.log("Error fetching alerts", err.message);
//       }
//     };

//     fetchAlerts();

//     const socket = io(SOCKET_URL, { transports: ["websocket"] });

//     socket.on("connect", () => console.log("Alerts socket connected"));

//     // when backend emits 'alerts' (array)
//     socket.on("alerts", (newAlerts) => {
//       // prepend new ones
//       setAlerts(prev => [...newAlerts, ...prev].slice(0, 100));
//     });

//     // optional: individual alert events
//     socket.on("alert", (alert) => {
//       setAlerts(prev => [alert, ...prev].slice(0, 100));
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const severityColor = {
//     critical: "bg-red-600",
//     high: "bg-orange-500",
//     medium: "bg-yellow-400",
//     low: "bg-blue-400",
//   };

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-lg border max-h-[350px] overflow-auto">
//       <h2 className="text-2xl font-bold mb-4">⚠ Live Alerts</h2>

//       {alerts.length === 0 && <p className="text-gray-500">No active alerts ✔</p>}

//       {alerts.map((a, idx) => (
//         <div key={idx} className={`p-3 mb-3 rounded-lg text-white ${severityColor[a.severity] || "bg-gray-400"}`}>
//           <p className="font-semibold">{a.msg}</p>
//           <p className="text-sm">Sensor: {a.sensor}</p>
//           <p className="text-xs">{new Date(a.time).toLocaleTimeString()}</p>
//         </div>
//       ))}
//     </div>
//   );
// }



//----------------------------------
// frontend/src/components/AlertsPanel.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api/alerts/latest";

// ✅ Fix timestamp formatter
const formatTime = (time) => {
  if (!time) return "N/A";
  const d = new Date(time);
  return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleString();
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(API_URL);
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching alerts:", err.message);
      }
    };

    fetchAlerts();

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.on("alerts", (newAlerts) => {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4">⚠ Live Alerts</h2>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts right now.</p>
      ) : (
        alerts.map((alert, i) => (
          <div key={i} className="mb-4 p-3 border rounded-lg bg-red-50">
            <p className="font-semibold">
              Sensor: {alert.sensorId || "Unknown"}
            </p>

            <p className="text-sm text-gray-700">
              {alert.message}
            </p>

            {/* ✅ FIXED TIMESTAMP HERE */}
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(alert.timestamp)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
