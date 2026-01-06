import { useEffect, useState } from 'react'
import { useAuth, API_BASE } from '../auth/AuthContext'
import logo from '../assets/logo.png'

function DashboardPage() {
  const { user, token, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedTaskId, setExpandedTaskId] = useState(null)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const loadTasks = async () => {
    try {
      setError('')
      const res = await fetch(`${API_BASE}/tasks`, { headers })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to load tasks')
      }
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (token) {
      loadTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, description, status: 'pending' }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to create task')
      }
      setTitle('')
      setDescription('')
      await loadTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to delete task')
      }
      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleExpanded = (id) => {
    setExpandedTaskId((current) => (current === id ? null : id))
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString()
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>

      {user && (
        <p>
          Logged in as <strong>{user.email}</strong> ({user.role})
        </p>
      )}

      <section style={{ marginTop: '1rem' }}>
        <div className="dashboard-main">
          <div className="dashboard-task-column">
            <h3>Create Task</h3>
            <form
              onSubmit={handleCreate}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 420 }}
            >
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>
              <label>
                Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Add Task'}
              </button>
            </form>
          </div>
          <div className="dashboard-logo-panel">
            <div className="dashboard-hero-logo-wrap">
              <img src={logo} alt="App logo" className="dashboard-hero-logo" />
            </div>
            <p className="dashboard-welcome-text">Welcome to dashboard</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h3>Your Tasks</h3>
        {tasks.length === 0 && <p>No tasks yet.</p>}
        <ul>
          {tasks.map((t) => {
            const isExpanded = expandedTaskId === t.id
            const createdLabel = formatDateTime(t.created_at)
            return (
              <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                <div className="task-info">
                  <strong>{t.title}</strong>
                  <div className="task-meta">
                    {t.status}
                    {createdLabel && ` · Created ${createdLabel}`}
                  </div>
                  {t.description && (
                    <>
                      <div
                        className={`task-description ${
                          isExpanded ? '' : 'task-description--clamped'
                        }`}
                      >
                        {t.description}
                      </div>
                      <div
                        className="task-description-toggle"
                        onClick={() => toggleExpanded(t.id)}
                      >
                        {isExpanded ? 'Show less' : 'Show full description'}
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default DashboardPage