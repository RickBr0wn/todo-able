import {
	Button,
	Flex,
	FormControl,
	Heading,
	Input,
	Spinner,
	Text,
	useColorMode
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import { FormEvent, useRef, useState } from 'react'
import { useAuth } from '../contexts/authContext'

const Signup = () => {
	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const confirmPasswordRef = useRef<HTMLInputElement>(null)
	const displayNameRef = useRef<HTMLInputElement>(null)
	const { colorMode } = useColorMode()
	const isDarkMode = colorMode === 'dark'
	const { error, isLoading, signUp } = useAuth()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		signUp(
			emailRef.current?.value || '',
			displayNameRef.current?.value || '',
			passwordRef.current?.value || '',
			confirmPasswordRef.current?.value || ''
		)
	}

	return (
		<Flex justify={'center'} align={'center'} h={'100vh'}>
			<Flex
				data-testid='login-container'
				bg={isDarkMode ? 'brand.paper.dark' : 'brand.paper.light'}
				w={350}
				borderRadius={'lg'}
				p={8}
				flexDir={'column'}
				gap={10}
				shadow={'lg'}
			>
				<Flex gap={4} justify={'space-between'}>
					<Heading role={'heading'}>Sign Up</Heading>
					<Image
						src={'/../public/logo.png'}
						alt={'logo'}
						height={'50px'}
						width={'50px'}
						layout={'fixed'}
					/>
				</Flex>
				<FormControl>
					<form onSubmit={handleSubmit}>
						<Flex flexDir={'column'} gap={5}>
							<Input ref={emailRef} placeholder={'Email'} />
							<Input ref={displayNameRef} placeholder={'Display Name'} />
							<Input
								data-testid={'password'}
								ref={passwordRef}
								placeholder={'Password'}
								type={'password'}
							/>
							<Input
								data-testid={'confirm-password'}
								ref={confirmPasswordRef}
								placeholder={'Confirm Password'}
								type={'password'}
								mb={6}
							/>
							<Button
								isLoading={isLoading}
								loadingText='LOADING'
								colorScheme={'yellow'}
								type={'submit'}
							>
								SIGN UP
							</Button>
						</Flex>
					</form>
					<Text align={'center'}>
						{error && <p style={{ color: 'red', marginTop: '4px' }}>{error}</p>}
					</Text>
				</FormControl>

				<Text fontSize={'xs'} align={'center'} mt={'-20px'}>
					Already have an account?{' '}
					<Text as={'span'} color={'yellow.300'}>
						<Link href={'/login'}>
							<a>Log In</a>
						</Link>
					</Text>
				</Text>
			</Flex>
		</Flex>
	)
}

export default Signup
