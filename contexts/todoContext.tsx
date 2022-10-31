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
import { useToast } from '@chakra-ui/react'

interface _TodoContextData {
	todos: _Todo[]
	isLoading: boolean
	error: string
	addTodo: (todo: string) => Promise<void>
	completeTodo: (todo: _Todo) => void
	removeTodo: (todo: _Todo) => Promise<void>
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

	const toast = useToast()

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
			// const collectionReference = collection(db, user.uid)
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

	async function completeTodo(todo: _Todo): Promise<void> {
		if (!user) {
			return
		}

		const documentReference = doc(db, user.uid, todo.id)

		await setDoc(
			documentReference,
			{ completed: !todo.completed },
			{ merge: true }
		)
	}

	const value: _TodoContextData = {
		todos,
		isLoading,
		error,
		addTodo,
		completeTodo,
		removeTodo
	}

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
