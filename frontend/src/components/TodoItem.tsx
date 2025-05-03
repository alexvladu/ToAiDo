import React, { useContext, useState } from 'react';
import { TodoContext, Todo } from '../contexts/TodoContext';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('TodoItem must be used within a TodoProvider');
  }

  const { updateTodo, deleteTodo } = context;

  // Modal state for update
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(todo.title);
  const [updateDescription, setUpdateDescription] = useState(todo.description);
  const [updateDueDate, setUpdateDueDate] = useState(todo.deadline);
  const [updateStatus, setUpdateStatus] = useState<Todo['status']>(todo.status);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim()) return;

    try {
      await updateTodo(todo.id, {
        title: updateTitle,
        description: updateDescription,
        status: updateStatus,
        deadline: updateDueDate,
        userId: todo.userId
      });
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // lunile sunt 0-indexate
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <>
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col space-y-3 mr-6">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold transition-colors"
          >
            Update

          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-base font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
        <div className="flex-1">
          <h3>TaskId={todo.id}</h3>
          <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
          <p className="text-base text-gray-600 mt-2">{todo.description || 'No description'}</p>
          <p className="text-base text-gray-500 mt-2">
            Deadline: {formatDate(todo.deadline)}
          </p>
          <p className="text-base text-gray-500">
            Status:{' '}
            <span className={todo.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
              {todo.status}
            </span>
          </p>
        </div>
      </div>
      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Todo</h3>
            <TodoForm
              title={updateTitle}
              setTitle={setUpdateTitle}
              description={updateDescription}
              setDescription={setUpdateDescription}
              dueDate={updateDueDate}
              setDueDate={setUpdateDueDate}
              status={updateStatus}
              setStatus={setUpdateStatus}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl text-base font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;