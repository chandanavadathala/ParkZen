import { useState } from "react";

/* ===================== ADMIN DASHBOARD ===================== */

export default function AdminDashboard() {
   const [darkMode, setDarkMode] = useState(false);
  /* ---------- OVERVIEW ---------- */
  const metrics = {
    users: 1240,
    owners: 84,
    bookings: 312,
    revenue: 460000,
  };

  /* ---------- USERS ---------- */
 
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul",
      email: "rahul@gmail.com",
      phone: "9876543210",
      vehicle: "KA-01-AB-1234",
      bookings: 12,
      rating: 4.5,
      loyalty: 120,
      status: "Active",
    },
    {
      id: 2,
      name: "Amit",
      email: "amit@gmail.com",
      phone: "9123456780",
      vehicle: "TS-09-ZX-9876",
      bookings: 3,
      rating: 3.8,
      loyalty: 30,
      status: "Blocked",
    },
  ]);

  /* ---------- OWNERS ---------- */
  const [owners, setOwners] = useState([
    {
      id: 1,
      name: "Parking Hub",
      email: "hub@parking.com",
      phone: "9000000000",
      approved: true,
      lot: {
        name: "City Mall",
        location: "Hyderabad",
        slots: 80,
        rate: 40,
        occupancy: "78%",
        bookings: 420,
        revenue: 180000,
        active: true,
      },
    },
    {
      id: 2,
      name: "Smart Park",
      email: "smart@park.com",
      phone: "9888888888",
      approved: false,
      lot: {
        name: "Tech Park",
        location: "Bangalore",
        slots: 50,
        rate: 30,
        occupancy: "42%",
        bookings: 120,
        revenue: 60000,
        active: false,
      },
    },
  ]);

  /* ---------- BOOKINGS ---------- */
  const bookings = [
    { id: 1, user: "Rahul", lot: "City Mall", amount: 120, status: "Paid" },
    { id: 2, user: "Amit", lot: "Tech Park", amount: 60, status: "Unpaid" },
  ];

  /* ---------- SUPPORT ---------- */
  const tickets = [
    { id: 1, from: "User", issue: "Payment failed", status: "Open" },
    { id: 2, from: "Owner", issue: "Slot mismatch", status: "Resolved" },
  ];

  /* ---------- SETTINGS ---------- */
  const [tax, setTax] = useState(18);
  const [loyaltyRate, setLoyaltyRate] = useState(5);

  /* ---------- ACTIONS ---------- */
  const toggleUserStatus = (id) =>
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u
    ));

  const approveOwner = (id) =>
    setOwners(owners.map(o =>
      o.id === id ? { ...o, approved: true } : o
    ));

  const toggleLotStatus = (id) =>
    setOwners(owners.map(o =>
      o.id === id
        ? { ...o, lot: { ...o.lot, active: !o.lot.active } }
        : o
    ));

  return (
    <div className="min-h-screen p-8 space-y-16 transition-colors duration-300"
    style={{
      backgroundColor: darkMode ? "#0B2E33" : "#f8fafc",
      color: darkMode ? "#E6F6F8" : "#0B2E33",
    }}>
      {/* 🔹 TOP BAR */}
  <div className="flex justify-end">
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded-full text-sm font-medium transition"
      style={{
        backgroundColor: darkMode ? "#4F7C82" : "#0B2E33",
        color: "#FFFFFF",
      }}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  </div>

      {/* ================= OVERVIEW ================= */}
      <Section title="Admin Overview">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI title="Users" value={metrics.users} />
          <KPI title="Owners" value={metrics.owners} />
          <KPI title="Bookings" value={metrics.bookings} />
          <KPI title="Revenue" value={`₹${metrics.revenue}`} />
        </div>
      </Section>

      {/* ================= USER MANAGEMENT ================= */}
      <Section title="User Management">
        <input
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
           className="mb-5 w-full rounded-xl px-4 py-2 text-sm outline-none transition"
           style={{
           backgroundColor: "#b8E3E9",
           border: "1px solid #93B1B5",
           color: "#0B2E33",
          }}
        />
        <Table headers={["Name", "Email", "Vehicle", "Bookings", "Rating", "Status", "Action"]}>
          {users
            .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()))
            .map(u => (
              <tr key={u.id} className="transition cursor-pointer hover:bg-slate-50"
              style={{backgroundColor: darkMode ? "#0F3A40" : "#FFFFFF", }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8E3E9"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFFFFF"}>
                <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{u.name}</TD>
                <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{u.email}</TD>
                <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{u.vehicle}</TD>
                <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{u.bookings}</TD>
                <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{u.rating}</TD>
                <TD>
                  <StatusBadge status={u.status} />
                </TD>
                <TD>
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className="px-4 py-1.5 text-xs rounded-full font-medium transition"
            style={{
              backgroundColor: u.status === "Active" ? "#4F7C82" : "#0B2E33",
              color: "#FFFFFF",
            }}
                  >
                    {u.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </TD>
              </tr>
            ))}
        </Table>
      </Section>

      {/* ================= OWNER & PARKING ================= */}
      <Section title="Owner & Parking Lot Management">
        <div className="space-y-5">
          {owners.map(o => (
            <div
              key={o.id}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg transition"
        style={{ backgroundColor: "#b8E3E9" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg " style={{ color: "#0B2E33" }}>{o.name}</h3>
                  <p className="text-sm" style={{ color: "#93B1B5" }}>{o.email}</p>
                </div>
                {!o.approved && (
                  <button
                    onClick={() => approveOwner(o.id)}
                      className="px-5 py-2 rounded-full font-medium shadow-md transition"
              style={{
                background: "linear-gradient(90deg, #4F7C82, #0B2E33)",
                color: "#FFFFFF",
              }}
                  >
                    Approve
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-5 text-sm">
                <Stat label="Lot" value={o.lot.name} />
                <Stat label="Slots" value={o.lot.slots} />
                <Stat label="Rate" value={`₹${o.lot.rate}`} />
                <Stat label="Occupancy" value={o.lot.occupancy} />
                <Stat label="Bookings" value={o.lot.bookings} />
                <Stat label="Revenue" value={`₹${o.lot.revenue}`} />
              </div>

              <button
                onClick={() => toggleLotStatus(o.id)}
                className="mt-5 px-5 py-2 rounded-full font-medium shadow-sm transition"
          style={{
            backgroundColor: o.lot.active ? "#4F7C82" : "#93B1B5",
            color: "#FFFFFF",
          }}
              >
                {o.lot.active ? "Deactivate Lot" : "Activate Lot"}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ================= BOOKINGS ================= */}
      <Section title="Booking & Payment Oversight">
        <Table headers={["User", "Parking", "Amount", "Status"]}>
          {bookings.map(b => (
            <tr key={b.id} className="transition cursor-pointer"
        style={{ backgroundColor: "#FFFFFF" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b8E3E9"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFFFFF"}>
              <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{b.user}</TD>
              <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>{b.lot}</TD>
              <TD style={{ color: darkMode ? "#E6F6F8" : "#0B2E33" }}>₹{b.amount}</TD>
              <TD>
                <StatusBadge status={b.status} />
              </TD>
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= SUPPORT ================= */}
      <Section title="Support & Feedback">
        <Table headers={["From", "Issue", "Status"]}>
          {tickets.map(t => (
            <tr key={t.id} className="hover:bg-slate-50 transition">
              <TD>{t.from}</TD>
              <TD>{t.issue}</TD>
              <TD>
                <StatusBadge status={t.status} />
              </TD>
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= SETTINGS ================= */}
      <Section title="System Settings">
        <div className="max-w-md space-y-5 p-6 rounded-2xl shadow-md"
       style={{ backgroundColor: "#b8E3E9" }}>
          <Input label="Tax (%)" value={tax} onChange={setTax} />
          <Input label="Loyalty Rate (%)" value={loyaltyRate} onChange={setLoyaltyRate} />
        </div>
      </Section>

    </div>
  );
}

/* ===================== UI HELPERS ===================== */

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function KPI({ title, value }) {
  return (
    <div className="p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
         style={{ backgroundColor: "#b8E3E9" }}>
      <p className="text-sm font-medium" style={{ color: "#0B2E33" }}>{title}</p>
      <h3 className="text-3xl font-bold mt-1" style={{ color: "#4F7C82" }}>{value}</h3>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            {headers.map(h => (
              <th key={h} className="p-4 text-left font-medium text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TD({ children }) {
  return <td className="p-4 border-b border-slate-100">{children}</td>;
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1"
        style={{ color: "#0B2E33" }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-3 py-2 text-sm outline-none transition"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #93B1B5",
          color: "#0B2E33",
        }}
        onFocus={(e) =>
          (e.target.style.boxShadow = "0 0 0 2px rgba(79,124,130,0.4)")
        }
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
    </div>
  );
}

/* ===================== STATUS BADGE ===================== */
function StatusBadge({ status }) {
  const map = {
    Active: { bg: "#4F7C82", text: "#FFFFFF" },
    Blocked: { bg: "#0B2E33", text: "#FFFFFF" },
    Paid: { bg: "#4F7C82", text: "#FFFFFF" },
    Unpaid: { bg: "#93B1B5", text: "#0B2E33" },
    Open: { bg: "#b8E3E9", text: "#0B2E33" },
    Resolved: { bg: "#4F7C82", text: "#FFFFFF" },
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: map[status].bg,
        color: map[status].text,
      }}
    >
      {status}
    </span>
  );
}