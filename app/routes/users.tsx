import { PrismaClient } from '@prisma/client'
import { ActionFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

const prisma = new PrismaClient()

type User = {
  id: number
  name: string
  email: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === 'create-user') {
    await prisma.user.create({
      data: {
        email: String(formData.get('email')),
        name: String(formData.get('name'))
      }
    })
  }

  if (intent === 'delete-user') {
    await prisma.user.delete({ where: { id: Number(formData.get('id')) } })
  }

  return null
}

export async function loader () {
  const users = await prisma.user.findMany()
  return users
}

export default function Users () {
  const users = useLoaderData<User[]>()

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - ({user.email})
            <Form method='post'>
              <input type='hidden' name='intent' value='delete-user' />
              <input type='hidden' value={user.id} name='id' />
              <button type='submit'>X</button>
            </Form>
          </li>
        ))}
      </ul>

      <Form method='post'>
        <input type='hidden' name='intent' value='create-user' />
        <input type='text' name='name' placeholder='name' />
        <input type='email' name='email' placeholder='email' />
        <button type='submit'>CREATE USER</button>
      </Form>
    </div>
  )
}
