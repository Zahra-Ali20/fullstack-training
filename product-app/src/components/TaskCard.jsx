import { memo } from 'react'
function TaskCard({ task, onTaskClick }) {
  return (
    <article>
     <h2 onClick={() => onTaskClick(task.id)}>
       {task.title}
       </h2>
        <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>
        Assigned to: {task.assigned_to_name ?? 'Unassigned'}
      </p>
    </article>
  )
}

export default memo(TaskCard)