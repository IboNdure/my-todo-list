"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import useLocalStorageState from "use-local-storage-state";

const Todoh1 = styled.h1`
  color: gray;
  font-size: 50px;
  text-align: center;
`;

const TodoContainer = styled.div`
  max-width: 624px;
  padding: 20px;
  background-color: orange;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: greenyellow;
`;

const TodoInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 26px;
  font-size: 16px;
`;

const TodoButton = styled.button`
  padding: 10px 15px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  margin: 5px;
  font-size: 16px;

  &:hover {
    background-color: green;
  }
`;

const TodoText = styled.span`
  font-size: 20px;
  color: #333;
`;

export default function TodoList() {
  const [todos, setTodos] = useLocalStorageState("todos", { defaultValue: [] });
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [currentTodo, setCurrentTodo] = useState("");
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(
      "https://lottie.host/fd770d94-9514-4eb1-a1a6-75c7ee49f0de/aENtoxPgG1.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data);
      });
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newTodoItem = { id: Date.now(), text: newTodo };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const removeTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const startEditing = (id, text) => {
    setIsEditing(id);
    setCurrentTodo(text);
  };

  const updateTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: currentTodo } : todo
    );
    setTodos(updatedTodos);
    setIsEditing(null);
    setCurrentTodo("");
  };

  return (
    <>
      <AnimationContainer>
        {animationData && (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </AnimationContainer>

      <TodoContainer>
        <Todoh1>Todo App</Todoh1>

        <TodoInput
          type="text"
          placeholder="Neues Todo hinzufügen"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <TodoButton onClick={addTodo}>Hinzufügen</TodoButton>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {isEditing === todo.id ? (
                <>
                  <TodoInput
                    type="text"
                    value={currentTodo}
                    onChange={(e) => setCurrentTodo(e.target.value)}
                  />
                  <TodoButton onClick={() => updateTodo(todo.id)}>
                    Speichern
                  </TodoButton>
                  <TodoButton onClick={() => setIsEditing(null)}>
                    Abbrechen
                  </TodoButton>
                </>
              ) : (
                <>
                  <TodoText>{todo.text}</TodoText>
                  <TodoButton onClick={() => startEditing(todo.id, todo.text)}>
                    Bearbeiten
                  </TodoButton>
                  <TodoButton onClick={() => removeTodo(todo.id)}>
                    Löschen
                  </TodoButton>
                </>
              )}
            </li>
          ))}
        </ul>
      </TodoContainer>
    </>
  );
}
