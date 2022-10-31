import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import { auth, db } from '../lib/firebase.config'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updatePassword,
	updateProfile,
	User
} from 'firebase/auth'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'

interface _AuthContextValue {
	user: User | null
	isLoading: boolean
	error: string
	signUp: (
		email: string,
		displayName: string,
		password: string,
		confirmPassword: string
	) => Promise<void>
	login: (email: string, password: string) => Promise<void>
	logout(): Promise<void>
	resetUserPassword(email: string): Promise<void>
	updateUserEmail: (email: string) => Promise<void> | undefined
	updateUserPassword(password: string): Promise<void> | undefined
}

interface _ContextProviderProps {
	children: ReactNode
}

const AuthContext = createContext<_AuthContextValue>({} as _AuthContextValue)

export function useAuth(): _AuthContextValue {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export function AuthProvider({ children }: _ContextProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>('')

	const router = useRouter()
	const toast = useToast()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			user => {
				setUser(user)
				setIsLoading(false)
				setError('')
			},
			error => {
				setError('Error in onAuthStateChanged: ' + error.message)
			}
		)
		return unsubscribe
	}, [])

	async function signUp(
		email: string,
		displayName: string,
		password: string,
		confirmPassword: string
	): Promise<void> {
		if (email === '') {
			return setError('A valid email is required.')
		}

		if (displayName === '') {
			return setError('Display name is required.')
		}

		if (password === '') {
			return setError('A password is required.')
		}

		if (confirmPassword === '') {
			return setError('A confirmation password is required.')
		}

		if (password !== confirmPassword) {
			return setError('Passwords do not match.')
		}

		try {
			setError('')
			setIsLoading(true)
			const credentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			await updateProfile(credentials.user, { displayName })

			toast({
				title: 'Account created.',
				description: `We've created your account for you.`,
				status: 'success',
				duration: 3000,
				isClosable: true
			})

			router.push('/admin')
		} catch (error) {
			return setError('Failed to create an account.')
		}

		setIsLoading(false)
	}

	async function login(email: string, password: string): Promise<void> {
		if (email === '') {
			return setError('A valid email is required.')
		}

		if (password === '') {
			return setError('A password is required.')
		}

		try {
			setError('')
			setIsLoading(true)

			await signInWithEmailAndPassword(auth, email, password)

			toast({
				title: 'Logged In.',
				description: `Welcome back, ${email}.`,
				status: 'success',
				duration: 3000,
				isClosable: true
			})

			router.push('/admin')
		} catch (error) {
			setError('Failed to sign in')
		}

		setIsLoading(false)
	}

	async function logout(): Promise<void> {
		toast({
			title: 'Logged Out.',
			description: `You've been logged out.`,
			status: 'success',
			duration: 3000,
			isClosable: true
		})
		await signOut(auth)
	}

	function resetUserPassword(email: string): Promise<void> {
		return sendPasswordResetEmail(auth, email)
	}

	function updateUserEmail(email: string): Promise<void> | undefined {
		if (!user) return
		return updateEmail(user, email)
	}

	function updateUserPassword(password: string): Promise<void> | undefined {
		if (!user) return
		return updatePassword(user, password)
	}

	const value: _AuthContextValue = {
		login,
		logout,
		resetUserPassword,
		signUp,
		updateUserEmail,
		updateUserPassword,
		user,
		isLoading,
		error
	}

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	)
}
