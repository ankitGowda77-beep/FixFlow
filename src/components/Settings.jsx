
import { useState } from "react";
import { Save, User, Bell } from "lucide-react";

function Settings() {
  const savedSettings = JSON.parse(
    localStorage.getItem("adminSettings")
  ) || {};

  const [name, setName] = useState(savedSettings.name || "Admin User");
  const [email, setEmail] = useState(savedSettings.email || "");
  const [organization, setOrganization] = useState(
    savedSettings.organization || "FixFlow Organization"
  );
  const [notifications, setNotifications] = useState(
    savedSettings.notifications ?? true
  );

  const handleSave = () => {
    localStorage.setItem(
      "adminSettings",
      JSON.stringify({
        name,
        email,
        organization,
        notifications
      })
    );

    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your administrator profile and preferences.</p>
      </div>

      <div className="settings-card">
        <h2><User size={20} /> Administrator Profile</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Organization Name</label>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Enter organization name"
          />
        </div>
      </div>

      <div className="settings-card">
        <h2><Bell size={20} /> Notification Preferences</h2>

        <label className="notification-option">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          Enable complaint notifications
        </label>
      </div>

      <button className="save-settings-button" onClick={handleSave}>
        <Save size={18} />
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
