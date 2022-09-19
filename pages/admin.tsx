import { Flex, Text } from '@chakra-ui/react'

const Admin = () => {
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
