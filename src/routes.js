import { randomUUID } from 'node:crypto'
import { buildRouteUrl } from './utils/build-route-url.js'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    url: buildRouteUrl('/tasks'),
    handle: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'title is required',
        }))
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'description is required.'
        }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      database.create('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    url: buildRouteUrl('/tasks'),
    handle: (req, res) => {
      const { search } = req.query

      const tasks = database.find('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    url: buildRouteUrl('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.findById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found.'
        }))
      }

      database.update('tasks', id, {
        ...task,
        ...(title && { title }),
        ...(description && { description }),
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    url: buildRouteUrl('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found.'
        }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    url: buildRouteUrl('/tasks/:id/complete'),
    handle: (req, res) => {
      const { id } = req.params

      const task = database.findById('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found.'
        }))
      }

      database.update('tasks', id, {
        ...task,
        completed_at: task.completed_at ? null : new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  }
]
