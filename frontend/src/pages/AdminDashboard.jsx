import { useState } from "react";

function NavItem({ icon, label, active, setActive }) {
  const isActive = active === label;
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => setActive(label)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: isActive
          ? "#0d9488"
          : hov
            ? "rgba(255,255,255,0.06)"
            : "transparent",
        color: isActive ? "#fff" : hov ? "#cbd5e1" : "#64748b",
        fontWeight: isActive ? "800" : "500",
        fontSize: "13px",
        textAlign: "left",
        transition: "all 0.2s",
        boxShadow: isActive ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
        marginBottom: "2px",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {isActive && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#99f6e4",
            boxShadow: "0 0 6px #99f6e4",
          }}
        />
      )}
    </button>
  );
}

function StatCard({ label, value, growth, icon, color }) {
  const isNeg = growth.includes("-");
  const isCrit = growth.toLowerCase() === "critical";
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov
          ? "0 12px 40px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            background: color,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            transition: "transform 0.3s",
            transform: hov ? "scale(1.1)" : "none",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: "9px",
            fontWeight: "900",
            padding: "4px 8px",
            borderRadius: "8px",
            background: isCrit ? "#e11d48" : isNeg ? "#fff1f2" : "#f0fdf4",
            color: isCrit ? "#fff" : isNeg ? "#e11d48" : "#16a34a",
          }}
        >
          {isCrit ? "⚠️ Critical" : isNeg ? `↓ ${growth}` : `↑ ${growth}`}
        </span>
      </div>
      <p
        style={{
          fontSize: "9px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#94a3b8",
          marginBottom: "4px",
          margin: "0 0 4px",
        }}
      >
        {label}
      </p>
      <h4
        style={{
          fontSize: "26px",
          fontWeight: "900",
          color: hov ? "#0d9488" : "#0f172a",
          margin: 0,
          transition: "color 0.2s",
        }}
      >
        {value}
      </h4>
      <div
        style={{
          marginTop: "12px",
          height: "3px",
          background: "#f1f5f9",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: isNeg ? "33%" : "66%",
            background: isNeg ? "#f43f5e" : "#10b981",
            borderRadius: "99px",
          }}
        />
      </div>
    </div>
  );
}

function AlertItem({ title, desc, status }) {
  const map = {
    Critical: ["#f43f5e", "#fff1f2", "#e11d48"],
    Warning: ["#f59e0b", "#fffbeb", "#d97706"],
    Normal: ["#10b981", "#f0fdf4", "#16a34a"],
  };
  const [c, bg, txt] = map[status];
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "8px",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "3px",
          borderRadius: "99px",
          background: c,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b" }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "8px",
              fontWeight: "900",
              padding: "2px 6px",
              borderRadius: "6px",
              background: bg,
              color: txt,
              textTransform: "uppercase",
            }}
          >
            {status}
          </span>
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            marginTop: "2px",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

function DashboardView() {
  const bars = [
    { h: 40, label: "Mon", val: "₹40k" },
    { h: 70, label: "Tue", val: "₹70k" },
    { h: 55, label: "Wed", val: "₹55k" },
    { h: 90, label: "Thu", val: "₹90k" },
    { h: 65, label: "Fri", val: "₹65k" },
    { h: 80, label: "Sat", val: "₹80k" },
    { h: 95, label: "Sun", val: "₹95k" },
  ];
  const [hovBar, setHovBar] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <StatCard
          label="Total Revenue"
          value="₹4,60,000"
          growth="+12.5%"
          icon="💰"
          color="#10b981"
        />
        <StatCard
          label="Active Users"
          value="1,240"
          growth="+4.2%"
          icon="👤"
          color="#3b82f6"
        />
        <StatCard
          label="Avg. Occupancy"
          value="72%"
          growth="-2.1%"
          icon="🚗"
          color="#f59e0b"
        />
        <StatCard
          label="Open Tickets"
          value="14"
          growth="Critical"
          icon="🎟️"
          color="#f43f5e"
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "900",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Revenue Performance
              </h3>
              <p
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  margin: "2px 0 0",
                }}
              >
                Daily revenue across all zones
              </p>
            </div>
            <select
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              height: "200px",
            }}
          >
            {bars.map((bar, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    color: "#fff",
                    background: "#1e293b",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    opacity: hovBar === i ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  {bar.val}
                </span>
                <div
                  onMouseEnter={() => setHovBar(i)}
                  onMouseLeave={() => setHovBar(null)}
                  style={{
                    width: "100%",
                    background: hovBar === i ? "#0d9488" : "#f1f5f9",
                    borderRadius: "10px 10px 0 0",
                    height: `${bar.h * 1.7}px`,
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#94a3b8",
                  }}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 20px",
            }}
          >
            System Health
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <AlertItem
              title="Fraud Detection"
              desc="Account 'Amrit_22' flagged for high-frequency booking."
              status="Critical"
            />
            <AlertItem
              title="API Latency"
              desc="Payment gateway response time is 2.4s."
              status="Warning"
            />
            <AlertItem
              title="Database"
              desc="Scheduled backup completed successfully."
              status="Normal"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px 28px 0" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            Recent Bookings
          </h3>
        </div>
        {[
          {
            id: "#PK-9923",
            user: "Priya Nair",
            ini: "PN",
            lot: "Indiranagar Point",
            time: "2 mins ago",
            amount: "₹320",
            active: true,
          },
          {
            id: "#PK-9922",
            user: "Rahul Kumar",
            ini: "RK",
            lot: "Koramangala Hub",
            time: "18 mins ago",
            amount: "₹160",
            active: true,
          },
          {
            id: "#PK-9921",
            user: "Anita Desai",
            ini: "AD",
            lot: "MG Road Zone B",
            time: "1 hr ago",
            amount: "₹80",
            active: false,
          },
          {
            id: "#PK-9920",
            user: "Chandana V.",
            ini: "CV",
            lot: "Koramangala Hub",
            time: "2 hrs ago",
            amount: "₹240",
            active: false,
          },
        ].map((r, i) => {
          const [rHov, setRHov] = useState(false);
          return (
            <div
              key={i}
              onMouseEnter={() => setRHov(true)}
              onMouseLeave={() => setRHov(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 28px",
                cursor: "pointer",
                background: rHov ? "#fafafa" : "",
                borderTop: "1px solid #f8fafc",
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "900",
                  color: "#64748b",
                  flexShrink: 0,
                }}
              >
                {r.ini}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: rHov ? "#0d9488" : "#1e293b",
                      transition: "color 0.2s",
                    }}
                  >
                    {r.user}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      fontFamily: "monospace",
                    }}
                  >
                    {r.id}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "2px 0 0",
                  }}
                >
                  {r.lot} · {r.time}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "900",
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {r.amount}
                </p>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: r.active ? "#f0fdfa" : "#f8fafc",
                    color: r.active ? "#0d9488" : "#94a3b8",
                  }}
                >
                  {r.active ? "Active" : "Completed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TableView({ title }) {
  const [alertMessages, setAlertMessages] = useState({});
  const [search, setSearch] = useState("");
  const configs = {
    "User Registry": {
      headers: ["User / Email", "Registered", "Status", "Actions"],
      rows: [
        {
          primary: "Chandana V.",
          sub: "dev@parkzen.com",
          date: "Oct 12, 2025",
          status: "Active",
          type: "success",
        },
        {
          primary: "Amrit Sharma",
          sub: "amrit@example.com",
          date: "Nov 02, 2025",
          status: "Suspended",
          type: "danger",
        },
        {
          primary: "Priya Nair",
          sub: "priya.nair@gmail.com",
          date: "Dec 15, 2025",
          status: "Active",
          type: "success",
        },
        {
          primary: "Rahul Kumar",
          sub: "rahul.k@outlook.com",
          date: "Jan 03, 2026",
          status: "Active",
          type: "success",
        },
      ],
    },
    Bookings: {
      headers: ["Booking ID", "Vehicle No.", "Duration", "Revenue"],
      rows: [
        {
          primary: "#PK-9923",
          sub: "KA-03-HT-9870",
          date: "1.5 Hours",
          status: "₹180.00",
          type: "neutral",
        },
        {
          primary: "#PK-9922",
          sub: "KA-02-GT-4433",
          date: "3 Hours",
          status: "₹360.00",
          type: "neutral",
        },
        {
          primary: "#PK-9921",
          sub: "KA-05-NB-5678",
          date: "45 Mins",
          status: "₹80.00",
          type: "neutral",
        },
        {
          primary: "#PK-9920",
          sub: "KA-01-MG-1234",
          date: "2 Hours",
          status: "₹240.00",
          type: "neutral",
        },
      ],
    },
  };
  const { headers, rows } = configs[title] || { headers: [], rows: [] };
  const filtered = rows.filter(
    (r) =>
      r.primary.toLowerCase().includes(search.toLowerCase()) ||
      r.sub.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>
            {filtered.length} entries
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "12px",
            outline: "none",
            width: "180px",
          }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "12px 28px",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#94a3b8",
                  textAlign: i === headers.length - 1 ? "right" : "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => {
            const [rHov, setRHov] = useState(false);
            return (
              <tr
                key={i}
                onMouseEnter={() => setRHov(true)}
                onMouseLeave={() => setRHov(false)}
                style={{
                  borderTop: "1px solid #f8fafc",
                  background: rHov ? "#fafafa" : "",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
              >
                <td style={{ padding: "16px 28px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: rHov ? "#0d9488" : "#1e293b",
                      transition: "color 0.2s",
                    }}
                  >
                    {row.primary}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      marginTop: "2px",
                    }}
                  >
                    {row.sub}
                  </div>
                </td>
                <td
                  style={{
                    padding: "16px 28px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  {row.date}
                </td>
                <td style={{ padding: "16px 28px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background:
                        row.type === "success"
                          ? "#f0fdf4"
                          : row.type === "danger"
                            ? "#fff1f2"
                            : "#f8fafc",
                      color:
                        row.type === "success"
                          ? "#16a34a"
                          : row.type === "danger"
                            ? "#e11d48"
                            : "#64748b",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "16px 28px", textAlign: "right" }}>
                  {title === "User Registry" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "6px",
                      }}
                    >
                      <input
                        placeholder="Reason..."
                        value={alertMessages[row.sub] || ""}
                        onChange={(e) =>
                          setAlertMessages({
                            ...alertMessages,
                            [row.sub]: e.target.value,
                          })
                        }
                        style={{
                          fontSize: "10px",
                          padding: "5px 8px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          outline: "none",
                          width: "90px",
                          background: "#f8fafc",
                        }}
                      />
                      {[
                        {
                          label: "Alert",
                          bg: "#fefce8",
                          color: "#ca8a04",
                          hbg: "#ca8a04",
                        },
                        {
                          label: "Block",
                          bg: "#f8fafc",
                          color: "#475569",
                          hbg: "#1e293b",
                        },
                        {
                          label: "Del",
                          bg: "#fff1f2",
                          color: "#e11d48",
                          hbg: "#e11d48",
                        },
                      ].map((btn) => {
                        const [bHov, setBHov] = useState(false);
                        return (
                          <button
                            key={btn.label}
                            onClick={() =>
                              alert(
                                `${btn.label.toUpperCase()} for ${row.sub}\nReason: ${alertMessages[row.sub] || "None"}`,
                              )
                            }
                            onMouseEnter={() => setBHov(true)}
                            onMouseLeave={() => setBHov(false)}
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "5px 10px",
                              borderRadius: "8px",
                              background: bHov ? btn.hbg : btn.bg,
                              color: bHov ? "#fff" : btn.color,
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: rHov ? "#0d9488" : "#94a3b8",
                        background: rHov ? "#f0fdfa" : "none",
                        border: rHov
                          ? "1px solid #ccfbf1"
                          : "1px solid transparent",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      View →
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LotView() {
  const spots = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    isOccupied: [2, 4, 5, 7, 9, 11].includes(i + 1),
  }));
  const occupied = spots.filter((s) => s.isOccupied).length;
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Active Parking Zones
          </h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Zone", "Location", "Occupancy", "Status"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 20px",
                    fontSize: "9px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#94a3b8",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Koramangala Hub",
                loc: "Block 4, Bangalore",
                occ: "88%",
                status: "Open",
                ok: true,
              },
              {
                name: "Indiranagar Point",
                loc: "12th Main, Bangalore",
                occ: "12%",
                status: "Closed",
                ok: false,
              },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  {r.name}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  {r.loc}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  {r.occ}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: r.ok ? "#f0fdf4" : "#fff1f2",
                      color: r.ok ? "#16a34a" : "#e11d48",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          background: "#0a0f1e",
          borderRadius: "24px",
          padding: "28px",
          border: "1px solid #1e293b",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              Zone A-1 Visualizer
            </h3>
            <p
              style={{ color: "#475569", fontSize: "11px", margin: "4px 0 0" }}
            >
              Koramangala Hub · Real-time
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#2dd4bf",
              }}
            />
            <span
              style={{
                color: "#2dd4bf",
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Live
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {[
            { val: occupied, label: "Occupied", color: "#f43f5e" },
            { val: 12 - occupied, label: "Available", color: "#10b981" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontSize: "26px",
                  fontWeight: "900",
                  color: s.color,
                  margin: 0,
                }}
              >
                {s.val}
              </p>
              <p
                style={{
                  fontSize: "9px",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: "700",
                  margin: "4px 0 0",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "8px",
            flex: 1,
          }}
        >
          {spots.map((spot) => (
            <div
              key={spot.id}
              style={{
                height: "60px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                border: `1px solid ${spot.isOccupied ? "rgba(244,63,94,0.25)" : "rgba(16,185,129,0.25)"}`,
                background: spot.isOccupied
                  ? "rgba(244,63,94,0.08)"
                  : "rgba(16,185,129,0.08)",
              }}
            >
              {spot.isOccupied ? (
                <div
                  style={{
                    position: "absolute",
                    inset: "4px",
                    background: "rgba(30,41,59,0.8)",
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                  }}
                >
                  🚗
                </div>
              ) : (
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    color: "rgba(52,211,153,0.5)",
                  }}
                >
                  P-{spot.id}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          {[
            { c: "#10b981", l: "Available" },
            { c: "#f43f5e", l: "Occupied" },
          ].map((leg, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: leg.c,
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  color: "#475569",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                {leg.l}
              </span>
            </div>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: "9px",
              color: "#334155",
              fontStyle: "italic",
            }}
          >
            Updated 2 min ago
          </span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const data = [
    { day: "Mon", val: 45 },
    { day: "Tue", val: 52 },
    { day: "Wed", val: 38 },
    { day: "Thu", val: 65 },
    { day: "Fri", val: 48 },
    { day: "Sat", val: 80 },
    { day: "Sun", val: 95 },
  ];
  const [hov, setHov] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {[
          {
            label: "Peak Occupancy",
            val: "94%",
            bar: 94,
            color: "#0d9488",
            text: "#0d9488",
          },
          {
            label: "Avg. Booking Duration",
            val: "4.2 hrs",
            bar: 60,
            color: "#3b82f6",
            text: "#2563eb",
          },
          {
            label: "Revenue per Slot",
            val: "₹142.50",
            bar: 72,
            color: "#10b981",
            text: "#16a34a",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {s.label}
            </p>
            <h4
              style={{
                fontSize: "26px",
                fontWeight: "900",
                color: s.text,
                margin: "6px 0 0",
              }}
            >
              {s.val}
            </h4>
            <div
              style={{
                marginTop: "14px",
                height: "4px",
                background: "#f1f5f9",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${s.bar}%`,
                  background: s.color,
                  borderRadius: "99px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
              }}
            >
              Weekly Traffic Analysis
            </h3>
            <p
              style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}
            >
              Total check-ins across all parking zones
            </p>
          </div>
          <button
            style={{
              padding: "9px 16px",
              background: "#0f172a",
              color: "#fff",
              borderRadius: "12px",
              border: "none",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ↓ Download Report
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            height: "180px",
          }}
        >
          {data.map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#64748b",
                  opacity: hov === i ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              >
                {item.val}
              </span>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  width: "100%",
                  background: hov === i ? "#0d9488" : "#f1f5f9",
                  borderRadius: "10px 10px 4px 4px",
                  height: `${(item.val / 95) * 160}px`,
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#94a3b8",
                }}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div
          style={{
            background: "#0a0f1e",
            borderRadius: "24px",
            padding: "28px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-32px",
              right: "-32px",
              width: "180px",
              height: "180px",
              background: "rgba(13,148,136,0.08)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
          <h4
            style={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "800",
              margin: "0 0 4px",
            }}
          >
            Location Hotspots
          </h4>
          <p style={{ color: "#475569", fontSize: "11px", margin: "0 0 20px" }}>
            Bangalore Central: 40% higher demand
          </p>
          {[
            { name: "Indiranagar", pct: 88, color: "#2dd4bf" },
            { name: "Koramangala", pct: 62, color: "#60a5fa" },
            { name: "MG Road", pct: 74, color: "#a78bfa" },
          ].map((loc, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontWeight: "700",
                  marginBottom: "5px",
                }}
              >
                <span style={{ color: "#cbd5e1" }}>{loc.name}</span>
                <span style={{ color: loc.color }}>{loc.pct}%</span>
              </div>
              <div
                style={{
                  height: "3px",
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "99px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${loc.pct}%`,
                    background: loc.color,
                    borderRadius: "99px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg,#f0fdfa,#eff6ff)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              marginBottom: "14px",
              border: "1px solid #e2e8f0",
            }}
          >
            🤖
          </div>
          <h4
            style={{
              fontSize: "15px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            AI Predictive Insights
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              lineHeight: 1.6,
              margin: "0 0 18px",
              padding: "0 16px",
            }}
          >
            Expect <strong>20% more traffic</strong> tomorrow due to a Cricket
            Match at Chinnaswamy Stadium.
          </p>
          <button
            style={{
              padding: "9px 20px",
              background: "#0d9488",
              color: "#fff",
              borderRadius: "12px",
              border: "none",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
            }}
          >
            View Full Report →
          </button>
        </div>
      </div>
    </div>
  );
}

function SupportView() {
  const tickets = [
    {
      id: "#T-441",
      user: "Priya Nair",
      issue: "Unable to cancel booking after payment",
      priority: "High",
      time: "5 min ago",
    },
    {
      id: "#T-440",
      user: "Rahul Kumar",
      issue: "App crashed during payment at Indiranagar slot",
      priority: "Medium",
      time: "32 min ago",
    },
    {
      id: "#T-439",
      user: "Deepa S.",
      issue: "Wrong parking slot assigned by app",
      priority: "High",
      time: "1 hr ago",
    },
    {
      id: "#T-438",
      user: "Arjun Mehta",
      issue: "Refund not received after 3 days",
      priority: "Low",
      time: "3 hrs ago",
    },
  ];
  const pMap = {
    High: ["#fff1f2", "#e11d48"],
    Medium: ["#fffbeb", "#d97706"],
    Low: ["#f8fafc", "#64748b"],
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {[
          { label: "Open Tickets", val: "14", color: "#e11d48" },
          { label: "Resolved Today", val: "28", color: "#16a34a" },
          { label: "Avg. Response Time", val: "12 min", color: "#2563eb" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {s.label}
            </p>
            <h4
              style={{
                fontSize: "30px",
                fontWeight: "900",
                color: s.color,
                margin: "6px 0 0",
              }}
            >
              {s.val}
            </h4>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "22px 28px", borderBottom: "1px solid #f1f5f9" }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "900",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Support Queue
          </h3>
        </div>
        {tickets.map((t, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={i}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "14px 28px",
                borderTop: "1px solid #f8fafc",
                background: hov ? "#fafafa" : "",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#94a3b8",
                  flexShrink: 0,
                }}
              >
                {t.id}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  {t.user}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "2px 0 0",
                  }}
                >
                  {t.issue}
                </p>
              </div>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: pMap[t.priority][0],
                  color: pMap[t.priority][1],
                  flexShrink: 0,
                }}
              >
                {t.priority}
              </span>
              <span
                style={{ fontSize: "10px", color: "#94a3b8", flexShrink: 0 }}
              >
                {t.time}
              </span>
              <button
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "6px 12px",
                  background: "#0d9488",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Respond
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsView() {
  const [maintenance, setMaintenance] = useState(false);
  const [autoAlerts, setAutoAlerts] = useState(true);
  const Toggle = ({ val, set }) => (
    <button
      onClick={() => set(!val)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "99px",
        background: val ? "#0d9488" : "#e2e8f0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.3s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          width: "18px",
          height: "18px",
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          left: val ? "23px" : "3px",
          transition: "left 0.3s",
        }}
      />
    </button>
  );
  return (
    <div
      style={{
        maxWidth: "860px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 20px" }}
          >
            💰 Financial Configuration
          </h3>
          {[
            { label: "Platform Commission (%)", val: "12" },
            { label: "GST / Tax Rate (%)", val: "18" },
            { label: "Penalty Fee (₹/hr)", val: "50" },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#94a3b8",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                {f.label}
              </label>
              <input
                type="number"
                defaultValue={f.val}
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: "700",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 20px" }}
          >
            🛡️ Security & Access
          </h3>
          {[
            {
              label: "Maintenance Mode",
              sub: "Disable all new bookings",
              val: maintenance,
              set: setMaintenance,
            },
            {
              label: "Auto Fraud Alerts",
              sub: "Flag suspicious accounts",
              val: autoAlerts,
              set: setAutoAlerts,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                background: "#f8fafc",
                borderRadius: "14px",
                marginBottom: "10px",
                border: "1px solid #f1f5f9",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    margin: "2px 0 0",
                  }}
                >
                  {s.sub}
                </p>
              </div>
              <Toggle val={s.val} set={s.set} />
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
            <button
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#e11d48",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              🔒 Revoke All API Sessions
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "28px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 20px" }}>
          📧 Automated Notifications
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#94a3b8",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Welcome Email Body
            </label>
            <textarea
              defaultValue="Welcome to ParkEase! Your journey to hassle-free parking starts here."
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "14px",
                fontSize: "12px",
                height: "120px",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              background: "linear-gradient(135deg,#f8fafc,#f0fdfa)",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.7 }}>
              Use tags like{" "}
              <code
                style={{
                  background: "#fff",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  color: "#0d9488",
                  fontSize: "11px",
                }}
              >
                {"{user_name}"}
              </code>{" "}
              or{" "}
              <code
                style={{
                  background: "#fff",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  color: "#0d9488",
                  fontSize: "11px",
                }}
              >
                {"{booking_id}"}
              </code>
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          style={{
            padding: "11px 24px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Discard
        </button>
        <button
          style={{
            padding: "11px 24px",
            background: "#0d9488",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        color: "#1e293b",
      }}
    >
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "252px",
          background: "#0a0f1e",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          boxShadow: "4px 0 30px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ padding: "24px 20px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg,#2dd4bf,#0d9488)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "16px",
                fontStyle: "italic",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(13,148,136,0.35)",
              }}
            >
              P
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: "900",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                ParkEase
              </div>
              <div
                style={{
                  color: "#2dd4bf",
                  fontSize: "9px",
                  fontWeight: "700",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                HQ Admin
              </div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
          <NavItem
            icon="📊"
            label="Dashboard"
            active={activeTab}
            setActive={setActiveTab}
          />
          <div
            style={{
              margin: "16px 0 6px 8px",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#334155",
              fontWeight: "900",
            }}
          >
            Management
          </div>
          <NavItem
            icon="👤"
            label="Users"
            active={activeTab}
            setActive={setActiveTab}
          />
          <NavItem
            icon="🏢"
            label="Parking Lots"
            active={activeTab}
            setActive={setActiveTab}
          />
          <NavItem
            icon="🎫"
            label="Bookings"
            active={activeTab}
            setActive={setActiveTab}
          />
          <div
            style={{
              margin: "16px 0 6px 8px",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#334155",
              fontWeight: "900",
            }}
          >
            Operations
          </div>
          <NavItem
            icon="📈"
            label="Analytics"
            active={activeTab}
            setActive={setActiveTab}
          />
          <NavItem
            icon="💬"
            label="Support"
            active={activeTab}
            setActive={setActiveTab}
          />
          <NavItem
            icon="⚙️"
            label="Settings"
            active={activeTab}
            setActive={setActiveTab}
          />
        </nav>
        <div style={{ padding: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "11px 12px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(13,148,136,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "11px",
                color: "#2dd4bf",
                border: "1px solid rgba(13,148,136,0.25)",
              }}
            >
              JD
            </div>
            <div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                John Doe
              </div>
              <div style={{ color: "#475569", fontSize: "10px" }}>
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main
        style={{
          marginLeft: "252px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(240,244,248,0.9)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(226,232,240,0.7)",
            padding: "13px 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "900",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {activeTab}
            </h2>
            <p
              style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}
            >
              ParkEase HQ · Live Dashboard
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              style={{
                position: "relative",
                padding: "10px",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              🔔
              <span
                style={{
                  position: "absolute",
                  top: "7px",
                  right: "7px",
                  width: "7px",
                  height: "7px",
                  background: "#f43f5e",
                  borderRadius: "50%",
                  border: "1.5px solid #f0f4f8",
                }}
              />
            </button>
            <button
              style={{
                padding: "10px 20px",
                background: "#0d9488",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
              }}
            >
              + New Action
            </button>
          </div>
        </header>
        <div style={{ flex: 1, padding: "32px 36px" }}>
          {activeTab === "Dashboard" && <DashboardView />}
          {activeTab === "Users" && <TableView title="User Registry" />}
          {activeTab === "Parking Lots" && <LotView />}
          {activeTab === "Bookings" && <TableView title="Bookings" />}
          {activeTab === "Analytics" && <AnalyticsView />}
          {activeTab === "Support" && <SupportView />}
          {activeTab === "Settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
