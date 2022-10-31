import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from '../theme'
import Layout from '../components/Layout'
import Head from 'next/head'
import { AuthProvider } from '../contexts/authContext'
import { TodoProvider } from '../contexts/todoContext'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<>
			<Head>
				<title>Todo-Able</title>
				<meta
					name='description'
					content='A simple todo app built with Next.js and Chakra UI'
				/>
				<link rel='shortcut icon' href='favicon.ico' />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='favicon-16x16.png'
				/>
				<link rel='manifest' href='/site.webmanifest' />
			</Head>

			<ChakraProvider theme={theme}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<AuthProvider>
					<TodoProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</TodoProvider>
				</AuthProvider>
			</ChakraProvider>
		</>
	)
}

export default MyApp
