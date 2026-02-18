import React, { useState } from "react";

/* ===================== DESIGN SYSTEM ===================== */
const THEME = {
  primary: "#0D9488", // Teal 600
  dark: "#0F172A", // Slate 900
  light: "#F8FAFC", // Slate 50
  border: "#E2E8F0", // Slate 200
  textMain: "#1E293B", // Slate 800
  textMuted: "#64748B", // Slate 500
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1E293B]">
      {/* 🔹 SIDEBAR - FIXED LEFT */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] text-white flex flex-col shadow-2xl z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-teal-500/20">
              P
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              ParkEase <span className="text-teal-400">HQ</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem
            icon="📊"
            label="Dashboard"
            active={activeTab}
            setActive={setActiveTab}
          />
          <div className="mt-6 mb-2 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
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
          <div className="mt-6 mb-2 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
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

        <div className="p-6 bg-slate-900/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔹 MAIN CONTENT */}
      <main className="ml-72 flex-1 p-10">
        {/* TOP HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab}
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back. Here is what's happening with ParkEase today.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition">
              🔔
            </button>
            <button className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition flex items-center gap-2">
              <span>+</span> New Action
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT MODERATOR */}
        {activeTab === "Dashboard" && <DashboardView />}
        {activeTab === "Users" && (
          <TableView title="User Registry" data={USER_DATA} />
        )}
        {activeTab === "Parking Lots" && <LotView />}
        {activeTab === "Analytics" && <AnalyticsView />}
        {activeTab === "Settings" && <SettingsView />}
      </main>
    </div>
  );
}

/* ===================== SUB-VIEWS ===================== */

function DashboardView() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value="₹4,60,000"
          growth="+12.5%"
          icon="💰"
          color="bg-emerald-500"
        />
        <StatCard
          label="Active Users"
          value="1,240"
          growth="+4.2%"
          icon="👤"
          color="bg-blue-500"
        />
        <StatCard
          label="Avg. Occupancy"
          value="72%"
          growth="-2.1%"
          icon="🚗"
          color="bg-amber-500"
        />
        <StatCard
          label="Open Tickets"
          value="14"
          growth="Critical"
          icon="🎟️"
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* REVENUE CHART PLACEHOLDER */}
        <div className="col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Revenue Performance</h3>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-500 rounded-lg px-3 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {[40, 70, 55, 90, 65, 80, 95].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  ₹{h}k
                </div>
                <div
                  className="w-full bg-slate-100 rounded-t-xl group-hover:bg-teal-500 transition-all duration-300"
                  style={{ height: `${h * 2}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM ALERTS */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">System Health</h3>
          <div className="space-y-6">
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
    </div>
  );
}

/* ===================== COMPONENTS ===================== */

function NavItem({ icon, label, active, setActive }) {
  const isActive = active === label;
  return (
    <button
      onClick={() => setActive(label)}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
        isActive
          ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30 font-bold"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow"></div>
      )}
    </button>
  );
}

function StatCard({ label, value, growth, icon, color }) {
  const isNegative = growth.includes("-");
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center text-xl shadow-inner`}
        >
          {icon}
        </div>
        <span
          className={`text-[11px] font-black px-2 py-1 rounded-lg ${isNegative ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
        >
          {growth}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
        {label}
      </p>
      <h4 className="text-3xl font-black text-slate-900 mt-1">{value}</h4>
    </div>
  );
}

function AlertItem({ title, desc, status }) {
  const colors = {
    Critical: "bg-rose-500",
    Warning: "bg-amber-500",
    Normal: "bg-emerald-500",
  };
  return (
    <div className="flex gap-4 group">
      <div className={`w-1 self-stretch rounded-full ${colors[status]}`}></div>
      <div>
        <h5 className="text-sm font-bold text-slate-800">{title}</h5>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ===================== PLACEHOLDERS ===================== */
function TableView({ title, data }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <input
          placeholder="Filter results..."
          className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-teal-500/20 w-64"
        />
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50/50">
            <th className="px-8 py-4 font-bold">User / Email</th>
            <th className="px-8 py-4 font-bold">Registration</th>
            <th className="px-8 py-4 font-bold">Status</th>
            <th className="px-8 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="hover:bg-slate-50/80 transition group">
              <td className="px-8 py-5">
                <div className="font-bold text-slate-800">User_{i}00</div>
                <div className="text-xs text-slate-500 font-medium">
                  user{i}@example.com
                </div>
              </td>
              <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                Oct 12, 2025
              </td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                  Active
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="text-slate-300 group-hover:text-slate-900 transition font-bold text-lg">
                  •••
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LotView() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <TableView title="Parking Lots" />
      <div className="bg-teal-900 rounded-[2rem] p-10 text-white">
        Live Map Projection Placeholder
      </div>
    </div>
  );
}
function AnalyticsView() {
  return (
    <div className="p-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
      Advanced PowerBI-style Analytics loading...
    </div>
  );
}
function SettingsView() {
  return (
    <div className="max-w-xl bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
      <h3 className="font-bold text-xl mb-6">Global Config</h3>
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
        <div className="h-10 bg-slate-100 rounded-xl w-3/4"></div>
      </div>
    </div>
  );
}

const USER_DATA = []; // Mock
