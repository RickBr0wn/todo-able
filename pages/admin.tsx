import { FormEvent, useEffect, useRef, useState } from 'react'
import {
	Button,
	Flex,
	FormControl,
	Icon,
	Input,
	ListItem,
	Text,
	UnorderedList,
	useColorMode
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/authContext'
import { useTodo, _Todo } from '../contexts/todoContext'
import { MdDeleteForever, MdEdit, MdDone } from 'react-icons/md'

const Admin = () => {
	const router = useRouter()
	const { user } = useAuth()
	const { todos, addTodo } = useTodo()
	const todoRef = useRef<HTMLInputElement>(null)
	const { colorMode } = useColorMode()
	const isDarkMode = colorMode === 'dark'

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
		<Flex w={'100vw'} h={'100vh'} justify='center'>
			<Flex w={400} flexDir={'column'}>
				<Flex
					flexDir={'column'}
					bg={isDarkMode ? 'brand.paper.dark' : 'brand.paper.light'}
					borderRadius={'lg'}
					p={10}
					justify={'center'}
					align={'center'}
					mt={16}
				>
					<Flex flexDir={'column'} mb={6}>
						<Text fontSize={'3xl'}>Good Afternoon..</Text>
						<Text>{`You have ${todos.length} todos to complete.`}</Text>
					</Flex>

					<Flex>
						<FormControl>
							<form onSubmit={handleSubmit}>
								<Flex flexDir={'column'}>
									<Input
										placeholder='Enter new to-do'
										type='text'
										ref={todoRef}
										mr={4}
										mb={4}
									/>
									<Button colorScheme={'yellow'} type='submit' w={'100%'}>
										ADD
									</Button>
								</Flex>
							</form>
						</FormControl>
					</Flex>
				</Flex>
				<Flex
					overflowY={'scroll'}
					mt={6}
					flexDir={'column'}
					borderRadius={'lg'}
				>
					<UnorderedList w={'100%'} m={0} mb={20}>
						{todos.map((todo: _Todo) => (
							<ListItem key={todo.id} listStyleType={'none'}>
								<TodoItem todo={todo} />
							</ListItem>
						))}
					</UnorderedList>
				</Flex>
			</Flex>
		</Flex>
	)
}

interface _TodoItemProps {
	todo: _Todo
}

const TodoItem = function ({ todo }: _TodoItemProps): JSX.Element {
	const { removeTodo } = useTodo()
	const { colorMode } = useColorMode()
	const isDarkMode = colorMode === 'dark'

	return (
		<Flex
			bg={isDarkMode ? 'brand.paper.dark' : 'brand.paper.light'}
			padding={6}
			borderRadius={'lg'}
			mb={2}
			w={'100%'}
			justify={'space-between'}
			align={'center'}
		>
			{todo.title}

			<Flex gap={3}>
				<Icon
					as={MdDone}
					opacity={0.4}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'green.500' }}
				/>
				<Icon
					as={MdEdit}
					opacity={0.4}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'yellow.500' }}
				/>
				<Icon
					as={MdDeleteForever}
					opacity={0.4}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'red.500' }}
					onClick={() => removeTodo(todo)}
				/>
			</Flex>
		</Flex>
	)
}

export default Admin
