
function StatusBadge({ status, type = "status" }) {
    const badgeClass = `${type}-badge ${status.toLowerCase().replace(" ", "-")}`;
  
    return (
      <span className={badgeClass}>
        {status}
      </span>
    );
  }
  
  export default StatusBadge;
  