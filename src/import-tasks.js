import fs from 'node:fs'
import { parse } from 'csv'

const filePath = new URL('../tasks.csv', import.meta.url)

async function getTasksFromCsv() {
  const tasks = []

  const parser = fs.createReadStream(filePath).pipe(parse({
    from_line: 2
  }))

  for await (const record of parser) {
    tasks.push({
      title: record[0],
      description: record[1]
    })
  }

  return tasks
}

async function createTasks() {
  const tasks = await getTasksFromCsv()

  for (const task of tasks) {
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
  }
}

createTasks()
