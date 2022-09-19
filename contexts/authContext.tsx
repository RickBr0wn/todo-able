import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import { auth } from '../lib/firebase.config'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updatePassword,
	User,
	UserCredential
} from 'firebase/auth'

interface _AuthContextData {
	user: User | null
	signup: (email: string, password: string) => Promise<UserCredential>
	login: (email: string, password: string) => Promise<UserCredential>
	logout(): Promise<void>
	resetUserPassword(email: string): Promise<void>
	updateUserEmail: (email: string) => Promise<void> | undefined
	updateUserPassword(password: string): Promise<void> | undefined
}

interface _ContextProviderProps {
	children: ReactNode
}

const AuthContext = createContext<_AuthContextData>({} as _AuthContextData)

export function useAuth(): _AuthContextData {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export function AuthProvider({ children }: _ContextProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setUser(user)
			setLoading(false)
		})
		return unsubscribe
	}, [])

	function signup(email: string, password: string): Promise<UserCredential> {
		return createUserWithEmailAndPassword(auth, email, password)
	}

	function login(email: string, password: string): Promise<UserCredential> {
		return signInWithEmailAndPassword(auth, email, password)
	}

	function logout(): Promise<void> {
		return signOut(auth)
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

	const value = {
		login,
		logout,
		resetUserPassword,
		signup,
		updateUserEmail,
		updateUserPassword,
		user
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
