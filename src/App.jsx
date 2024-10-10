import React, { useReducer, useState } from 'react';
//import ReactDOM from 'react-dom';
import './App.css'

const initialState = {
    todos: [],
};
 

function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return { ...state, todos: [{ id: Date.now(), text: action.payload, completed: false }, ...state.todos] };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                ),
            };
        case 'DELETE_TODO':
            return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
        case 'EDIT_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
                ),
            };
        default:
            return state;
    }
}
 

function TodoList() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState('');
 
    
    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            dispatch({ type: 'ADD_TODO', payload: newTodo });
            setNewTodo('');
        }
    };
 
    
    const handleEditTodo = (id, text) => {
        setEditingTodo(id);
        setEditingText(text);
    };
 
    
    const handleSaveTodo = (id) => {
        dispatch({ type: 'EDIT_TODO', payload: { id, text: editingText } });
        setEditingTodo(null);
        setEditingText('');
    };
 
    return (
        <div>
            <h1>Todo List</h1>
            <form onSubmit={handleAddTodo}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo"
                />
                <button type="submit">Add Todo</button>
            </form>
            <ul>
                {state.todos.map(todo => (
                    <li key={todo.id}>
                        {editingTodo === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button onClick={() => handleSaveTodo(todo.id)}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                                />
                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {todo.text}
                                </span>
                                <button onClick={() => handleEditTodo(todo.id, todo.text)}>Edit</button>
                                <button
                                    onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                                    disabled={!todo.completed}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default TodoList