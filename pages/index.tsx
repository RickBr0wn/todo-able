import { Flex, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Home: NextPage = () => {
	return (
		<Flex
			role='main'
			h={'100vh'}
			w={'100vw'}
			justify={'center'}
			align={'center'}
			flexDir={'column'}
		>
			<Text>Home</Text>
			<Text>This page should be visable by all.</Text>
		</Flex>
	)
}

export default Home
