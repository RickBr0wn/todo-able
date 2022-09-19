import { Flex, Text } from '@chakra-ui/react'
import { useAuth } from '../contexts/authContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Admin = () => {
	const router = useRouter()
	const { user } = useAuth()

	useEffect(() => {
		if (!user) {
			router.push('/login')
		}
	}, [router, user])

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
		</Flex>
	)
}

export default Admin
