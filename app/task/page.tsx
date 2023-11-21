"use client";

import { figmaAPI } from "@/lib/figmaAPI";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import useTodos, { TodoItem } from "@/composable/useTodos";
import { Check, CheckCircle, CheckSquare, Circle, ListTodo, Plus, Square, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function WorkingTask() {
	const [tab, setTab] = useState('all');
	const [documentTitle, setDocumentTitle] = useState('Untitled');
	const [pageTitle, setPageTitle] = useState('Untitled');
	const [removeDialog, setRemoveDialog] = useState<boolean>(false);
	const [removableId, setRemovableId] = useState<string | number | null>(null);
	const [groupedTodos, setGroupedTodos] = useState<Array<{ document: string; page: string; todos: TodoItem[] }>>([]);
	const {
		todos,
		newTodo,
		editingTodo,
		editingText,
		setNewTodo,
		createTodo,
		updateTodo,
		toggleCompletion,
		deleteTodo,
		setEditingTodo,
		setEditingText,
		groupTodosByDocumentAndPage
	} = useTodos();

	const getDocumentDetail = async () => {
		const document = await figmaAPI.run(
			async (figma) => {
				return {
					title: figma.root.name, // Current document title
					page: figma.currentPage.name // Current page title
				};
			},
		);

		setDocumentTitle(document.title);
		setPageTitle(document.page);
	}

	useEffect(() => {
		getDocumentDetail();
		setGroupedTodos(groupTodosByDocumentAndPage(todos, tab))
	}, [groupTodosByDocumentAndPage, todos, tab])

	return (
		<>
			<AlertDialog open={removeDialog}>
				<AlertDialogContent className="max-w-xs">
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this task?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone and will permanently delete the task.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setRemoveDialog(false)}>Cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-red-600 hover:bg-red-700 text-red-100 border-red-500" onClick={() => {
							deleteTodo(removableId as string);
							setRemoveDialog(false);
						}}>
							Remove Task
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div className="flex items-center justify-center gap-x-2 border-b">
				<Input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Write down what you will do ..." className="border-0 shadow-none rounded-none focus-visible:ring-0 h-auto p-4" />
				<Button onClick={() => newTodo.length > 0 && createTodo(newTodo, documentTitle, pageTitle)} className="rounded-none border-0 py-7 px-6">
					<Plus></Plus>
				</Button>
			</div>

			<div className="flex divide-x border-b">
				<div onClick={() => setTab('all')} className={`cursor-pointer hover:bg-slate-100 w-1/3 px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${tab !== 'all' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
					<ListTodo className="w-3 h-3"></ListTodo>
					<div className="">All</div>
				</div>
				<div onClick={() => setTab('active')} className={`cursor-pointer hover:bg-slate-100 w-1/3 px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${tab !== 'active' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
					<Square className="w-3 h-3"></Square>
					<div className="">Active</div>
				</div>
				<div onClick={() => setTab('completed')} className={`cursor-pointer hover:bg-slate-100 w-1/3 px-3 py-1.5 text-xs flex gap-x-1 justify-center items-center ${tab !== 'completed' ? 'bg-white text-slate-700' : 'bg-slate-100 text-slate-600'}`}>
					<CheckSquare className="w-3 h-3"></CheckSquare>
					<div className="">Completed</div>
				</div>
			</div>

			<div className="h-[calc(100vh-203px)] overflow-x-hidden overflow-y-scroll divide-y">
				{Array.isArray(groupedTodos) && groupedTodos.map((group: any) => (
					<div key={`${group.document}-${group.page}`}>
						<div className="text-sm font-normal text-center py-2 text-slate-500 border-b">{group.document} - {group.page}</div>
						<div className="divide-y">
							{group.todos.map((todo: TodoItem) => (
								<div key={todo.id} className={`flex items-center w-full gap-2 pl-4 pr-2 text-sm py-2 ${todo.completed ? 'text-slate-400' : 'text-slate-600'}`}>
									<div className="cursor-pointer" onClick={(e) => toggleCompletion(todo.id)}>
										{todo.completed && (
											<CheckCircle className="w-[1.15rem] h-[1.15rem]" />
										)}
										{!todo.completed && (
											<Circle className="w-[1.15rem] h-[1.15rem]" />
										)}
									</div>
									{editingTodo === todo.id ? (
										<>
											<Textarea
												value={editingText}
												onChange={(e) => setEditingText(e.target.value)}
												onBlur={() => updateTodo(todo.id, editingText)} // Save the editing text when clicking outside
											/>
											<Button size={"icon"} variant={"ghost"} onClick={() => updateTodo(todo.id, editingText)}>
												<Check className="w-4 h-4" />
											</Button>
										</>
									) : (
										<>
											<span
												onDoubleClick={() => { setEditingTodo(todo.id); setEditingText(todo.task); }}
												style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
												className="w-full"
											>
												{todo.task}
											</span>
											<Button size={"icon"} variant={"ghost"} className="hover:bg-red-100 hover:text-red-600 text-red-600" onClick={() => {
												setRemoveDialog(true);
												setRemovableId(todo.id);
											}}>
												<Trash className="w-4 h-4" />
											</Button>
										</>
									)}
								</div>
							))}
						</div>
					</div>
				))}

				{Array.isArray(groupedTodos) && groupedTodos.length === 0 && (
					<div className="flex items-center justify-center h-[calc(100vh-251px)] max-w-sm mx-auto text-center">
						<div className="flex flex-col items-center justify-center">
							<div className="text-xl font-medium text-indigo-600">
								Write down your task here
							</div>
							<div className="text-slate-400">
								You can add your task by clicking &lsquo;Add Task&lsquo; button above.
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}