import { FormEvent, useEffect, useRef } from 'react'
import {
	Button,
	Flex,
	FormControl,
	Input,
	ListItem,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Text,
	UnorderedList,
	useColorMode
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/authContext'
import { useTodo } from '../contexts/todoContext'
import { TodoItem } from '../components/TodoItem'

const Admin = () => {
	const router = useRouter()
	const { user } = useAuth()
	const { todos, addTodo } = useTodo()
	const todoRef = useRef<HTMLInputElement>(null)
	const { colorMode } = useColorMode()
	const isDarkMode = colorMode === 'dark'
	const uncompletedTodos: number = todos.filter(todo => !todo.completed).length
	const completedTodos: number = todos.filter(todo => todo.completed).length

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

	const getGreeting = () => {
		const displayName = user?.displayName || ''
		const capitalisedDisplayName =
			displayName.charAt(0).toUpperCase() + displayName.slice(1)

		const hour = new Date().getHours()
		if (hour < 12) {
			return `Good Morning ${capitalisedDisplayName}`
		} else if (hour < 18) {
			return `Good Afternoon ${capitalisedDisplayName}`
		} else {
			return `Good Evening${capitalisedDisplayName ? ' ' : ','}${
				capitalisedDisplayName ? capitalisedDisplayName + ',' : ''
			}`
		}
	}

	const amountOfTodos = () => {
		if (uncompletedTodos === 0) {
			return "You don't have any to-do's. Why not add one?"
		} else if (uncompletedTodos === 1) {
			return 'You only have 1 to-do left. Nearly there!'
		} else {
			return `You have ${uncompletedTodos} todos left. You can do it!`
		}
	}

	return (
		<Flex w={'100vw'} h={'100vh'} justify='center'>
			<Flex w={400} flexDir={'column'}>
				<Flex
					flexDir={'column'}
					bg={isDarkMode ? 'brand.paper.dark' : 'brand.paper.light'}
					shadow={'lg'}
					borderRadius={'lg'}
					p={10}
					justify={'center'}
					align={'center'}
					mt={16}
				>
					<Flex flexDir={'column'} mb={6}>
						<Text fontSize={'3xl'}>{getGreeting()}</Text>
						<Text>{amountOfTodos()}</Text>
						<Text as='i' fontSize='xs' opacity={0.3}>
							Completed: {completedTodos}
						</Text>
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
					mt={6}
					flexDir={'column'}
					borderRadius={'lg'}
					overflowY={'scroll'}
				>
					<Tabs isFitted width={400} colorScheme='yellow'>
						<TabList>
							<Tab>To-Do</Tab>
							<Tab>Completed</Tab>
							<Tab>All</Tab>
						</TabList>

						<TabPanels>
							<TabPanel>
								<UnorderedList w={'100%'} m={0} mb={20}>
									{todos
										.filter((todo: _Todo) => !todo.completed)
										.map((todo: _Todo) => (
											<ListItem key={todo.id} listStyleType={'none'}>
												<TodoItem todo={todo} />
											</ListItem>
										))}
								</UnorderedList>
							</TabPanel>

							<TabPanel>
								<UnorderedList w={'100%'} m={0} mb={20}>
									{todos
										.filter((todo: _Todo) => todo.completed)
										.map((todo: _Todo) => (
											<ListItem key={todo.id} listStyleType={'none'}>
												<TodoItem todo={todo} />
											</ListItem>
										))}
								</UnorderedList>
							</TabPanel>

							<TabPanel>
								<UnorderedList w={'100%'} m={0} mb={20}>
									{todos.map((todo: _Todo) => (
										<ListItem key={todo.id} listStyleType={'none'}>
											<TodoItem todo={todo} />
										</ListItem>
									))}
								</UnorderedList>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Admin
