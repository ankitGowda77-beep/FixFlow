
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ChartNoAxesColumnIncreasing,
  Settings,
  Wrench
} from "lucide-react";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <Wrench size={25} />
        <h2>FixFlow</h2>
      </div>

      {/* Navigation */}
      <div className="menu">
        <p className="menu-heading">MAIN MENU</p>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/complaints"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <ClipboardList size={20} />
          <span>Complaints</span>
        </NavLink>

        <NavLink
          to="/technicians"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <Users size={20} />
          <span>Technicians</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <ChartNoAxesColumnIncreasing size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      {/* Admin Profile */}
      <div className="admin-profile">
        <div className="avatar">A</div>
        <div>
          <h4>Admin User</h4>
          <p>Administrator</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
