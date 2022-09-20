import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import { db } from '../lib/firebase.config'
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useAuth } from './authContext'

export interface _Todo {
	id: string
	title: string
	author: string
	completed: boolean
}

interface _TodoContextData {
	todos: _Todo[]
	isLoading: boolean
	error: string
	addTodo: (todo: string) => Promise<void>
	removeTodo: (id: string) => void
	updateTodo: (todo: _Todo) => void
	clearTodos: () => void
}

interface _ContextProviderProps {
	children: ReactNode
}

const TodoContext = createContext<_TodoContextData>({} as _TodoContextData)

export function useTodo(): _TodoContextData {
	const context = useContext(TodoContext)

	if (!context) {
		throw new Error('useTodo must be used within a TodoContext')
	}

	return context
}

export function TodoProvider({ children }: _ContextProviderProps): JSX.Element {
	const [todos, setTodos] = useState<_Todo[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const { user } = useAuth()

	const collectionReference = collection(db, `todos/${user?.uid}/todos`)

	useEffect(() => {
		const unsubscribe = onSnapshot(collectionReference, querySnapshot => {
			const todos = querySnapshot.docs.map(doc => doc.data() as _Todo)
			setTodos(todos)
		})

		return unsubscribe
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function addTodo(todo: string) {
		if (!user) {
			return
		}

		const newTodo = {
			title: todo,
			completed: false
		}

		try {
			setIsLoading(true)
			await addDoc(collectionReference, newTodo)
			setIsLoading(false)
		} catch (error) {
			setError('Error adding todo')
		}
	}

	function removeTodo(id: string): void {
		setTodos(todos.filter((t: _Todo) => t.id !== id))
	}

	function updateTodo(todo: _Todo): void {
		setTodos(todos.map((t: _Todo) => (t.id === todo.id ? todo : t)))
	}

	function clearTodos(): void {
		setTodos([])
	}

	const value: _TodoContextData = {
		todos,
		isLoading,
		error,
		addTodo,
		removeTodo,
		updateTodo,
		clearTodos
	}

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
