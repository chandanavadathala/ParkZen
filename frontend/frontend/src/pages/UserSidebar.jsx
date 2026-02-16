import { motion } from "framer-motion";

export default function UserSidebar({ user }) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="w-72 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-6 h-screen fixed left-0 top-0 z-50"
    >
      {/* User Profile */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
          {user.name[0]}
        </div>
        <h2 className="mt-2 text-lg font-semibold text-slate-800">
          {user.name}
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Vehicle Details */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Vehicle No:</span>
          <span className="font-semibold">{user.vehicle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Phone:</span>
          <span className="font-semibold">{user.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Membership:</span>
          <span className="font-semibold">{user.membership || "Standard"}</span>
        </div>
      </div>

      {/* Optional Buttons */}
      <div className="mt-auto flex flex-col gap-3">
        <button className="w-full bg-blue-600 text-white py-2 rounded-2xl shadow hover:bg-blue-700 transition">
          Edit Profile
        </button>
        <button className="w-full bg-red-500 text-white py-2 rounded-2xl shadow hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </motion.div>
  );
}