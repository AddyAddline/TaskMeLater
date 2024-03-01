const TaskStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
  };
  
  const TaskPriority = {
    PRIORITY_0: 0,
    PRIORITY_1: 1,
    PRIORITY_2: 2,
    PRIORITY_3: 3,
  };
  
  const UserPriority = {
    HIGH_PRIORITY: 0,
    MID_PRIORITY: 1,
    LOW_PRIORITY: 2,
  };

  const SubTaskStatus = {
    INCOMPLETE: 0,
    COMPLETE: 1,
  };
  module.exports = {TaskStatus, TaskPriority, UserPriority,SubTaskStatus};