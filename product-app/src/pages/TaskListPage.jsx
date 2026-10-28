
import { useEffect,useState,useMemo,useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks } from '../features/tasks/tasksSlice'
import TaskCard from '../components/TaskCard'
import { useNavigate } from 'react-router-dom'
function TaskListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleTaskClick = useCallback((taskId) => {
  navigate(`/tasks/${taskId}`)
}, [navigate])
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const { items: tasks, status, error } = useSelector(
    (state) => state.tasks
  )

const filteredTasks = useMemo(() => {
  return tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter

    return matchesStatus && matchesPriority
  })
}, [tasks, statusFilter, priorityFilter])

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks())
    }
  }, [dispatch, status])

  if (status === 'loading') {
    return <p>Loading tasks...</p>
  }

  if (status === 'failed') {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchTasks())}>
          Retry
        </button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return <p>No tasks available.</p>
  }

  return (
    <main>
      <h1>Tasks</h1>

<label htmlFor="status-filter">Filter by status:</label>

<select
  id="status-filter"
  value={statusFilter}
  onChange={(event) => setStatusFilter(event.target.value)}
>
  <option value="all">All</option>
  <option value="pending">Pending</option>
  <option value="in_progress">In Progress</option>
  <option value="completed">Completed</option>
</select>

<label htmlFor="priority-filter">Filter by priority:</label>

<select
  id="priority-filter"
  value={priorityFilter}
  onChange={(event) => setPriorityFilter(event.target.value)}
>
  <option value="all">All</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</select>


{filteredTasks.length === 0 ? (
  <p>No tasks found matching your filters.</p>
) : (

  filteredTasks.map((task) => (
  <TaskCard key={task.id} task={task}
    onTaskClick={handleTaskClick}
/>
))
)}


    </main>
  )
}

export default TaskListPage
