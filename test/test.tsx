'use client'

import React, { useState, useRef } from 'react';
import styles from './test.module.css';

// Define the structure of a Todo item
interface Todo {
  text: string;         // The text content of the todo item
  date: string;         // The creation date and time of the todo
  completed: boolean;   // Status to mark if the todo is completed
  isEditing: boolean;   // Flag to check if the todo is being edited
}

export default function Test(): JSX.Element {
  // State to store the input value for the new todo
  const [inputValue, setInputValue] = useState<string>('');
  // State to store the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State to store the current filter (all, active, completed)
  const [filter, setFilter] = useState<string>('all');
  // Ref to keep the input field focused after adding a todo
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to add a new todo to the list
  const handleAdd = () => {
    if (!inputValue.trim()) {
      alert("Please enter a to-do item!");  // Show an alert if the input is empty
      return;
    }
    const newTodo: Todo = {
      text: inputValue,
      date: new Date().toLocaleString(),  // Set the current date and time
      completed: false,
      isEditing: false
    };
    setTodos([...todos, newTodo]);  // Add the new todo to the list
    setInputValue('');              // Clear the input field
    inputRef.current?.focus();      // Keep the input field focused
  };

  // Function to delete a todo by index
  const handleDelete = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);  // Remove the todo by index
    setTodos(newTodos);
  };

  // Function to toggle the completion status of a todo
  const handleToggleComplete = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;  // Toggle the completed status
    setTodos(newTodos);
  };

  // Function to enable editing mode for a todo
  const handleEdit = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].isEditing = true;  // Set editing flag to true
    setTodos(newTodos);
  };

  // Function to save the edited todo and exit editing mode
  const handleSave = (index: number, newText: string) => {
    const newTodos = [...todos];
    newTodos[index].text = newText;  // Update the todo text with the new value
    newTodos[index].isEditing = false;  // Set editing flag to false
    setTodos(newTodos);
  };

  // Filter the todos based on the selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;  // Show only completed todos
    if (filter === 'active') return !todo.completed;   // Show only active (not completed) todos
    return true;  // Show all todos if 'all' is selected
  });

  // Function to handle Enter key to add todo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();  // Add todo when Enter key is pressed
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 My To-Do List</h1>

      {/* Input field and Add button */}
      <div className={styles.inputArea}>
        <input
          ref={inputRef}  // Keep input focused
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}  // Update the input value
          onKeyDown={handleKeyDown}  // Handle Enter key press
          placeholder="What do you need to do?"
          className={styles.input}
        />
        <button onClick={handleAdd} className={styles.addButton}>➕</button>
      </div>

      {/* Filter buttons to filter the todo list */}
      <div className={styles.filterArea}>
        <button
          onClick={() => setFilter('all')}  // Set filter to 'all'
          className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}  // Set filter to 'active'
          className={`${styles.filterButton} ${filter === 'active' ? styles.activeFilter : ''}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}  // Set filter to 'completed'
          className={`${styles.filterButton} ${filter === 'completed' ? styles.activeFilter : ''}`}
        >
          Completed
        </button>
      </div>

      {/* Display filtered todo list */}
      <ul className={styles.list}>
        {filteredTodos.map((todo, index) => (
          <li key={index} className={`${styles.listItem} ${todo.completed ? styles.completed : ''}`}>
            <div>
              {/* Checkbox to toggle completion status */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}  // Toggle completion status
              />
              {/* Display todo text, allow editing */}
              {todo.isEditing ? (
                <input
                  type="text"
                  defaultValue={todo.text}
                  onBlur={(e) => handleSave(index, e.target.value)}  // Save on blur
                  autoFocus  // Focus on input when editing
                />
              ) : (
                <span>{todo.text}</span>
              )}
              <span className={styles.date}>{todo.date}</span>  {/* Display creation date */}
            </div>
            <div>
              {/* Edit button to enable editing */}
              {!todo.isEditing && (
                <button onClick={() => handleEdit(index)} className={styles.editButton}>✏️</button>
              )}
              {/* Delete button */}
              <button onClick={() => handleDelete(index)} className={styles.deleteButton}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
