import { fireEvent, screen } from '@testing-library/react'
import { render } from '../test-utils'

import Login from '../pages'

describe('Login', () => {
	it('should render a login-container', () => {
		render(<Login />)
		const loginContainer = screen.getByTestId('login-container')
		expect(loginContainer).toBeInTheDocument()
	})

	it('should render a text Login', () => {
		render(<Login />)
		const loginText = screen.getByRole('heading')
		expect(loginText).toBeInTheDocument()
	})

	it('should render an input field for email', () => {
		render(<Login />)
		const emailInput = screen.getByPlaceholderText(/email/i)
		expect(emailInput).toBeInTheDocument()
	})

	it('should render an input field for password', () => {
		render(<Login />)
		const passwordInput = screen.getByTestId('password')
		expect(passwordInput).toBeInTheDocument()
	})

	it('should render an input field for confirm password', () => {
		render(<Login />)
		const confirmPasswordInput = screen.getByTestId('confirm-password')
		expect(confirmPasswordInput).toBeInTheDocument()
	})

	it('should render a button for login', () => {
		render(<Login />)
		const loginButton = screen.getByRole('button', { name: /login/i })
		expect(loginButton).toBeInTheDocument()
	})

	it('should render a text Forgot Password', () => {
		render(<Login />)
		const forgotPasswordText = screen.getByText(/forgot password/i)
		expect(forgotPasswordText).toBeInTheDocument()
	})

	it('should render a link to Reset Password', () => {
		render(<Login />)
		const resetPasswordText = screen.getByRole('link', {
			name: /reset password/i
		})
		expect(resetPasswordText).toBeInTheDocument()
	})

	it('should render a link to Sign Up', () => {
		render(<Login />)
		const dontHaveAccountText = screen.getByRole('link', { name: /sign up/i })
		expect(dontHaveAccountText).toBeInTheDocument()
	})

	it('should display text when typed into email input', () => {
		render(<Login />)
		const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
		const typedText = 'TEST_STRING'
		fireEvent.change(emailInput, { target: { value: typedText } })
		expect(emailInput.value).toBe(typedText)
	})

	it('should display text when typed into password input', () => {
		render(<Login />)
		const passwordInput = screen.getByTestId('password') as HTMLInputElement
		const typedText = 'TEST_STRING'
		fireEvent.change(passwordInput, { target: { value: typedText } })
		expect(passwordInput.value).toBe(typedText)
	})

	it('should display text when typed into confirm password input', () => {
		render(<Login />)
		const confirmPasswordInput = screen.getByTestId(
			'confirm-password'
		) as HTMLInputElement
		const typedText = 'TEST_STRING'
		fireEvent.change(confirmPasswordInput, { target: { value: typedText } })
		expect(confirmPasswordInput.value).toBe(typedText)
	})

	// it('should display error message when email input is empty', () => {
	// 	render(<Login />)
	// 	const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement
	// 	const errorMessage = 'Email is required'
	// 	fireEvent.blur(emailInput)
	// 	const error = screen.getByText(errorMessage)
	// 	expect(error).toBeInTheDocument()
	// })
})
