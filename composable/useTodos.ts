// useTodos.ts
import { useState, useEffect } from 'react';

export interface TodoItem {
	id: string;
	task: string;
	completed: boolean;
	document: string;
	page: string;
}

// Helper functions for localStorage operations
const getTodosFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const todos = window.localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  }
  return [];
};

const saveTodosToLocalStorage = (todos: TodoItem[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  }
};

const filterTodosByTab = (todos: TodoItem[], tab: string) => {
  switch(tab) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

const groupTodosByDocumentAndPage = (todos: TodoItem[], currentTab: string) => {
  const filteredTodos = filterTodosByTab(todos, currentTab);

  const grouped = filteredTodos.reduce((acc: { document: string; page: string; todos: TodoItem[] }[], todo) => {
    // Find an existing group
    let group = acc.find((g) => g.document === todo.document && g.page === todo.page);

    // If the group exists, push the current todo into it
    if (group) {
      group.todos.push({
        id: todo.id,
        task: todo.task,
        completed: todo.completed,
        document: todo.document,
        page: todo.page
      });
    } else {
      // Otherwise, create a new group
      acc.push({
        document: todo.document,
        page: todo.page,
        todos: [{
          id: todo.id,
          task: todo.task,
          completed: todo.completed,
          document: todo.document,
          page: todo.page
        }]
      });
    }

    return acc;
  }, []);
  
  return grouped;
};

const useTodos = () => {
	const [todos, setTodos] = useState<TodoItem[]>(getTodosFromLocalStorage);
	const [newTodo, setNewTodo] = useState('');
	const [editingTodo, setEditingTodo] = useState('');
	const [editingText, setEditingText] = useState('');

	useEffect(() => {
		setTodos(getTodosFromLocalStorage());
	}, []);

	const createTodo = (todoText: string, documentTitle: string, pageTitle: string) => {
		const newTodo = { id: Date.now().toString(), task: todoText, completed: false, document: documentTitle, page: pageTitle };
		const updatedTodos = [...todos, newTodo];
		setTodos(updatedTodos);
		saveTodosToLocalStorage(updatedTodos);
		setNewTodo('');
	};

	const updateTodo = (id: string, task: string) => {
		const updatedTodos = todos.map((todo) =>
			todo.id === id ? { ...todo, task: task } : todo
		);
		setTodos(updatedTodos);
		saveTodosToLocalStorage(updatedTodos);
		setEditingTodo('');
		setEditingText('');
	};

	const toggleCompletion = (id: string) => {
		const updatedTodos = todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		setTodos(updatedTodos);
		saveTodosToLocalStorage(updatedTodos);
	};

	const deleteTodo = (id: string) => {
		const updatedTodos = todos.filter((todo) => todo.id !== id);
		setTodos(updatedTodos);
		saveTodosToLocalStorage(updatedTodos);
	};

	return {
		todos,
		newTodo,
		setNewTodo,
		createTodo,
		updateTodo,
		toggleCompletion,
		deleteTodo,
		editingTodo,
		setEditingTodo,
		editingText,
		setEditingText,
		groupTodosByDocumentAndPage,
	};
};

export default useTodos;
