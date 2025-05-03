import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  deadline: string;
  userId: string;
}

interface TodoContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  error: string;
  getTodos: () => Promise<void>;
  addTodo: (newTodo: Omit<Todo, "id">) => Promise<void>;
  updateTodo: (id: string, updatedTodo: Omit<Todo, "id">) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('No authentication token found');
        return;
      }
      const userId = localStorage.getItem("user_id");
      if(!userId){
        setError('No authentication user_id found');
      }
      const response = await axios.get(`http://localhost:8000/api/users/${userId}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch todos');
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (newTodo: Omit<Todo, "id">) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('No authentication token found');
        return;
      }
      const userId = localStorage.getItem("user_id");
      if(!userId){
        setError('No authentication user_id found');
      }
      console.log(newTodo);
      const response = await axios.post(`http://localhost:8000/api/users/${userId}/tasks/`, newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos([...todos, response.data]);
      setError('');
    } catch (error) {
      setError('Failed to add todo');
      console.error("Error adding todo:", error);
    }
  };

  const removeNullFields = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj
        .map(removeNullFields)
        .filter((item) => item !== null && item !== undefined);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .map(([key, value]) => [key, removeNullFields(value)])
          .filter(([_, value]) => value !== null && value !== undefined)
      );
    }
    return obj;
  };
  
  const updateTodo = async (id: string, updatedTodo: Omit<Todo, "id">) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('No authentication token found');
        return;
      }
      const userId = localStorage.getItem("user_id");
      if(!userId){
        setError('No authentication user_id found');
      }
      updatedTodo=removeNullFields(updatedTodo);
      console.log("aici??"+updatedTodo);
      const response = await axios.patch(`http://localhost:8000/api/users/${userId}/tasks/${id}/`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setTodos(todos.map((todo) => (todo.id == id ? response.data : todo)));
      setError('');
    } catch (error) {
      setError('Failed to update todo');
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('No authentication token found');
        return;
      }
      const userId = localStorage.getItem("user_id");
      if(!userId){
        setError('No authentication user_id found');
      }
      await axios.delete(`http://localhost:8000/api/users/${userId}/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.id != id));
      setError('');
    } catch (error) {
      setError('Failed to delete todo');
      console.error("Error deleting todo:", error);
    }
  };
  return (
    <TodoContext.Provider value={{ todos, setTodos, error, getTodos, addTodo, updateTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};