import { Flex, Icon, Text, useColorMode } from '@chakra-ui/react'
import { useTodo } from '../contexts/todoContext'
import { MdDeleteForever, MdEdit, MdDone } from 'react-icons/md'
import { FC } from 'react'

type Props = {
	todo: _Todo
}

export const TodoItem: FC<Props> = function ({ todo }): JSX.Element {
	const { completeTodo, removeTodo } = useTodo()
	const { colorMode } = useColorMode()
	const isDarkMode = colorMode === 'dark'
	const iconSize = 5

	return (
		<Flex
			bg={isDarkMode ? 'brand.paper.dark' : 'brand.paper.light'}
			shadow={'lg'}
			padding={6}
			borderRadius={'lg'}
			mb={2}
			w={'100%'}
			justify={'space-between'}
			align={'center'}
		>
			<Text
				css={
					todo.completed
						? { textDecoration: 'line-through', opacity: 0.3 }
						: { textDecoration: 'none' }
				}
			>
				{todo.title}
			</Text>

			<Flex gap={3}>
				<Icon
					color={todo.completed ? 'green.500' : 'gray.500'}
					as={MdDone}
					opacity={todo.completed ? 1 : 0.2}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'green.500' }}
					h={iconSize}
					w={iconSize}
					onClick={() => completeTodo(todo)}
				/>
				<Icon
					as={MdEdit}
					opacity={0.2}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'yellow.500' }}
					w={iconSize}
					h={iconSize}
				/>
				<Icon
					as={MdDeleteForever}
					opacity={0.2}
					_hover={{ opacity: 1, cursor: 'pointer', color: 'red.500' }}
					w={iconSize}
					h={iconSize}
					onClick={() => removeTodo(todo)}
				/>
			</Flex>
		</Flex>
	)
}
