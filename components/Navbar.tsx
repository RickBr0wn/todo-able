import { Flex, Spacer, Text } from '@chakra-ui/react'
import ToggleLightDark from './ToggleLightDark'
import Link from 'next/link'

const Navbar = () => {
	return (
		<Flex
			as={'nav'}
			role={'navigation'}
			width={'100%'}
			padding={4}
			pos={'fixed'}
		>
			<Spacer />
			<Flex align={'center'}>
				<Text mr={6}>
					<Link href={'/'}>
						<a>Home</a>
					</Link>
				</Text>
				<Text mr={6}>
					<Link href={'/signup'}>
						<a>Sign Up</a>
					</Link>
				</Text>
				<Text mr={6}>
					<Link href={'/login'}>
						<a>Login</a>
					</Link>
				</Text>
				<Text mr={6}>
					<Link href={'/admin'}>
						<a>Admin</a>
					</Link>
				</Text>
				<ToggleLightDark />
			</Flex>
		</Flex>
	)
}

export default Navbar
