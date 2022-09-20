import { FormEvent, useEffect, useRef, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../contexts/authContext'
import { useTodo } from '../contexts/todoContext'

const Admin = () => {
	const router = useRouter()
	const { user } = useAuth()
	const { todos, addTodo, removeTodo } = useTodo()
	const todoRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!user) {
			router.push('/login')
		}
	}, [router, user])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (todoRef.current?.value) {
			await addTodo(todoRef.current.value)
			todoRef.current.value = ''
		}
	}

	return (
		<Flex
			h={'100vh'}
			w={'100vw'}
			justify={'center'}
			align={'center'}
			flexDir={'column'}
		>
			<Text>Admin</Text>
			<Text>This should not be seen without logging in.</Text>
			<hr />
			<h3>Add Todo</h3>

			<form onSubmit={handleSubmit}>
				<input type='text' ref={todoRef} />
				<button type='submit'>Add Todo</button>
			</form>

			<ul>
				{todos.map(todo => (
					<li key={todo.id || `key:${Math.random()}`}>
						{todo.title}
						<button onClick={() => removeTodo(todo.id)}>X</button>
					</li>
				))}
			</ul>
		</Flex>
	)
}

export default Admin
