import React from 'react';
interface TodoFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  status: 'pending' | 'completed';
  setStatus: (value: 'pending' | 'completed') => void;
}
const TodoForm: React.FC<TodoFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  status,
  setStatus
}) => {
  const formatDateTimeLocal = (date?: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };
  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Titlu"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />
      <textarea
        placeholder="Descriere"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />
      <input
        type="datetime-local"
        value={formatDateTimeLocal(dueDate)}
        onChange={e => setDueDate(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
        className="w-full p-3 border rounded-xl"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TodoForm;