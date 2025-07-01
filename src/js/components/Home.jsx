import React, { useEffect, useState } from "react";

const Home = () => {
	// array of tasks 
	const [tasks, setTasks] = useState([]);
	// the Controlled input value
	const [inputValue, setInputValue] = useState("");
	const username = "haleymarieh";

	const getTasks = () => {
		fetch('https://playground.4geeks.com/todo/users/haleymarieh', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				// here i am checking if the request failed
				if (!response.ok) throw new Error(response.statusText);
				return response.json();
			})
			// here i am taking the json data and updating the tasks in the app
			.then(data => {
				// setting the tasks state to the todos array from the API or an empty array if i have no tasks
				setTasks(data.todos || []);
			})
			// logging the error if anyhting goes wrong
			.catch(error => console.error('Error fetching tasks:', error));
	}

	const addTask = () => {
		let data = {
			is_done: false,
			label: inputValue,
		}
		fetch("https://playground.4geeks.com/todo/todos/haleymarieh", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(result => console.log(result))
			.catch(error => console.log(error))
	}



	const updateTask = (id) => {
		fetch('https://playground.4geeks.com/todo/todos/' + id, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => {
				if (!res.ok) throw Error(res.statusText);
				return res.json();
			})
			.then(response => console.log('Success:', response))
			.catch(error => console.error(error));
	}

	// this is a function to delete a specifc task form the API using its ID
	const deleteTask = (id) => {
		// i am sending a request to the API to delete the task with the given ID
		fetch(`https://playground.4geeks.com/todo/todos/ ${id}`, {
			// i am using the delete method to tell the server to remove the task
			method: 'DELETE',
			// i am telling the server we're working with JSON data (even though im not sending anything)
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	// this is a function that deletes all the tasks
	const clearAllTasks = () => {
		// waits for all the tasks to be deleted by sending the delete request 
		Promise.all(tasks.map(task =>
			// send a request to the API to delete the task with the specific ID
			fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
				// used the delete method to remove the task from the server 
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		))
			// after all tasks are deleted, clear the task list in the app
			.then(() => {
				// set the tasks state to an empty array to show no tasks in the UI
				setTasks([]);
			})
			// if anything fails im logging the error 
			.catch(error => console.error(error));
	};


	return (
		<div className="todo-container">
			<h1>todos</h1>
			<div className="input-section">
				<input
					type="text"
					placeholder="What needs to be done?"
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<button onClick={() => addTask()}>Add</button>
			</div>
			<ul className="todo-list">
				{tasks.length === 0 ? (
					<li className="no-tasks">No tasks, add one!</li>
				) : (
					tasks.map((task) => (
						<li key={task.id}>
							{task.text}
							<button
								className="delete-btn"
								onClick={() => deleteTask(task.id)}
							>
								🗑️
							</button>
							<button
								className="update-btn"
								onClick={() => updateTask(task.id)}
							>
								✅
							</button>
						</li>
					))
				)}
				{tasks.length > 0 && (
					<li className="items-left">
						{tasks.length} item{tasks.length !== 1 ? "s" : ""} left
					</li>
				)}
			</ul>
			{tasks.length > 0 && (
				<button className="clear-btn" onClick={clearAllTasks}>
					Clean All Tasks
				</button>
			)}
		</div>
	);
};

export default Home;