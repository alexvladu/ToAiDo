import React, { useContext, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';

const TodoPage: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('TodoPage must be used within a TodoProvider');
  }

  const { todos, addTodo, updateTodo, deleteTodo } = context;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [aiSearchInput, setAiSearchInput] = useState('');

  // State pentru adăugare todo
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString());
  const [newStatus, setNewStatus] = useState<'pending' | 'completed'>('pending');

  const handleAddTodo = () => {
    // Resetăm valorile când deschidem formularul
    setNewTitle('');
    setNewDescription('');
    setNewDueDate(new Date().toISOString());
    setNewStatus('pending');
    setIsAddModalOpen(true);
  };

  const handleAiSearch = async () => {
    try {
      // Verifică dacă aiSearchInput are o valoare validă
      if (!aiSearchInput) {
        console.error("Promptul este gol!");
        return;
      }
      const sendData='You will receive an input. You should determine the type of operation: create/update/delete\n'+
                      'For create you shoud determine the title and the deadline and report the following json:\n'+
                      '{valid, type, title, description, deadline, status}, or report invalid!\n'+
                      'For update you should determine the title, description, status, deadline, this values are optional and report!\n'+
                      'the following json:{valid, type, id, title, description, deadline, status, deadline}\n'+
                      'For delete you should determine the id and return {valid, type, id}\n The prompt is:'+aiSearchInput+"\n"+
                      'ATTENTION! RETURN ONLY THE JSON STARTS WITH { AND ENDS WITH }!. valid poate fi doar true/false\n'+
                      '\nThe valid fiels is true if and only if all the data filed are correctly matched!\n'+
                      '\nJSON VALID TREBUIE SA FIE sa contina in jurul cheilor si a valorilor ghilimele duble. deadline vreau sa fie ISO 8601, foarte important!\n'+
                      '. Insist the first character MUST BE { and the last caracter MUST BE }';
                    
      // Creează cererea POST
      const response = await fetch("http://localhost:8000/api/groq/complete/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: sendData // Trimite aiSearchInput ca prompt
        }),
      });
  
      // Verifică dacă cererea a fost realizată cu succes
      if (!response.ok) {
        throw new Error(`Eroare HTTP: ${response.status}`);
      }
  
      // Obține răspunsul JSON
      const data = await response.json();
      console.log(data);
      const jsonResponse=JSON.parse(data.response);
      if(jsonResponse.valid==true){
        const user_id=localStorage.getItem("user_id");
        if(jsonResponse.type=='create'){
          console.log(jsonResponse);
          try {
            await addTodo({
              title: jsonResponse.title || null,
              description: jsonResponse.description || null,
              deadline: jsonResponse.deadline || null,
              status: jsonResponse.status || null,
              userId: String(user_id)
            });
          }
          catch(error){
            console.log(error);
          }
        }
        if(jsonResponse.type=='update'){
          try{
            await updateTodo(
              String(jsonResponse.id),{
              title: jsonResponse.title || null,
              description: jsonResponse.description || null,
              deadline: jsonResponse.deadline || null,
              status: jsonResponse.status || null,
              userId: String(user_id)
            });
          }
          catch(error){
            console.log(error);
          }
        }
        if(jsonResponse.type=='delete'){
          try {
            await deleteTodo(jsonResponse.id);
          }
          catch(error){
            console.log(error);
          }
        }
      }
      console.log(jsonResponse);
  
    } catch (error) {
      console.error("Eroare la cererea AI:", error);
      // Afișează eroarea în UI dacă este necesar
    }
  };

  const handleSaveTodo = async () => {
    const user_id=localStorage.getItem("user_id");
    try {
      await addTodo({
        title: newTitle,
        description: newDescription,
        deadline: newDueDate,
        status: newStatus,
        userId: String(user_id)
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Eroare la salvarea todo-ului:', error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Todo List</h1>

      {/* Lista Todo */}
      <div className="grid gap-6 max-w-screen-lg w-full">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">Nu există niciun todo momentan.</p>
          </div>
        ) : (
          todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>

      {/* Buton Adăugare */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleAddTodo}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-semibold transition-colors"
        >
          Adaugă Todo
        </button>
      </div>

      {/* Căutare AI */}
      <div className="mt-10 max-w-4xl w-full">
        <input
          type="text"
          placeholder="Ex: Arată-mi taskurile de finalizat până mâine"
          value={aiSearchInput}
          onChange={e => setAiSearchInput(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 shadow-sm text-lg"
        />
        <button
          onClick={handleAiSearch}
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base font-semibold transition-colors"
        >
          Caută cu AI
        </button>
      </div>

      {/* Modal Adăugare */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Adaugă Todo</h3>
            <TodoForm
              title={newTitle}
              setTitle={setNewTitle}
              description={newDescription}
              setDescription={setNewDescription}
              dueDate={newDueDate}
              setDueDate={setNewDueDate}
              status={newStatus}
              setStatus={setNewStatus}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl text-base font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTodo}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base font-semibold"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
