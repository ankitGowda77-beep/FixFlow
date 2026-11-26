
export function isOverdue(complaint) {
    if (complaint.status === "Resolved") {
      return false;
    }
  
    const reportedDate = new Date(complaint.date);
    const today = new Date();
  
    reportedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    const daysPassed = Math.floor(
      (today - reportedDate) / (1000 * 60 * 60 * 24)
    );
  
    return daysPassed > 3;
  }
  