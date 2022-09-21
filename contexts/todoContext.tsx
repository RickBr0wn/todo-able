import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import { db } from '../lib/firebase.config'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	setDoc
} from 'firebase/firestore'
import { useAuth } from './authContext'

export interface _Todo {
	id: string
	title: string
	completed: boolean
}

interface _TodoContextData {
	todos: _Todo[]
	isLoading: boolean
	error: string
	addTodo: (todo: string) => Promise<void>
	removeTodo: (todo: _Todo) => Promise<void>
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

	const collectionReference = collection(db, `${user?.uid}/`)

	useEffect(() => {
		const unsubscribe = onSnapshot(
			collectionReference,
			querySnapshot => {
				// const todos = querySnapshot.docs.map(doc => doc.data() as _Todo)
				const todos = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				})) as _Todo[]

				setTodos(todos)
			},
			error => console.log('error: ' + error)
		)

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
			const collectionReference = collection(db, user.uid)
			await addDoc(collectionReference, newTodo)
			setIsLoading(false)
		} catch (error) {
			setError('Error adding todo')
		}
	}

	async function removeTodo(todo: _Todo): Promise<void> {
		if (!user) {
			return
		}

		const documentReference = doc(db, user.uid, todo.id)
		await deleteDoc(documentReference)
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
