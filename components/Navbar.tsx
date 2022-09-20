import { Flex, Spacer, Text } from '@chakra-ui/react'
import ToggleLightDark from './ToggleLightDark'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/authContext'

const LinksWhenLoggedIn = () => {
	const { logout } = useAuth()
	const router = useRouter()

	const handleLogout = async () => {
		await logout()
		router.push('/')
	}

	return (
		<ul>
			<Link href='/'>
				<a style={{ marginRight: '20px' }}>Home</a>
			</Link>
			<Link href='/admin'>
				<a style={{ marginRight: '20px' }}>Admin</a>
			</Link>
			<Link href='/'>
				<a onClick={handleLogout} style={{ marginRight: '12px' }}>
					Logout
				</a>
			</Link>
			<ToggleLightDark />
		</ul>
	)
}

const LinksWhenLoggedOut = () => {
	return (
		<ul>
			<Link href='/'>
				<a style={{ marginRight: '20px' }}>Home</a>
			</Link>
			<Link href='/login'>
				<a style={{ marginRight: '20px' }}>Login</a>
			</Link>
			<Link href='/signup'>
				<a style={{ marginRight: '12px' }}>Signup</a>
			</Link>
			<ToggleLightDark />
		</ul>
	)
}

const Navbar = () => {
	const { user } = useAuth()

	return (
		<Flex as={'nav'} pos={'fixed'} w={'100vw'} p={2}>
			<Spacer />
			{user ? <LinksWhenLoggedIn /> : <LinksWhenLoggedOut />}
		</Flex>
	)
}

export default Navbar
