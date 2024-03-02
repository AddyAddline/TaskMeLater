function calculatePriority(dueDate) {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
  
    // Calculate the difference in days between today and the due date
    const timeDiff = dueDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
    // Determine priority based on the number of days until the due date
    if (dayDiff === 0) {
      return 0; // Due date is today
    } else if (dayDiff <= 2) {
      return 1; // Due date is between tomorrow and day after tomorrow
    } else if (dayDiff <= 4) {
      return 2; // Due date is 3-4 days away
    } else {
      return 3; // Due date is 5+ days away
    }
  }
 module.exports = calculatePriority;