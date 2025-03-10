<?php
if (php_sapi_name() !== 'cli' && isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];

    if ($action === 'addTask') {
        $taskName = $_POST['taskName'];
        if (!empty($taskName)) {
            // Process the taskName and store it in the tasks.json file
            $tasksFile = __DIR__ . '/tasks.json';  // Use __DIR__ to get the current script's directory

            // Read existing tasks data
            $existingData = file_get_contents($tasksFile);

            // If the file doesn't exist, initialize an empty array
            $tasks = $existingData ? json_decode($existingData, true) : [];

            // Add a new task
            $tasks[] = array(
                'Task' => $taskName,
                'Time_Stamp' => date('Y-m-d H:i:s')
            );

            // Save updated tasks data to the file
            file_put_contents($tasksFile, json_encode($tasks, JSON_PRETTY_PRINT));
        }
    }
}

// Retrieve and display existing tasks
$tasks = []; // Initialize an empty array

$tasksFile = __DIR__ . '/tasks.json';  // Use __DIR__ to get the current script's directory

// Read existing tasks data
$existingData = file_get_contents($tasksFile);

// If the file doesn't exist, initialize an empty array
$tasks = $existingData ? json_decode($existingData, true) : [];
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f4f4f4;
        }

        .todo-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            text-align: center;
        }

        h2 {
            color: #333;
            margin-bottom: 20px;
        }

        .task-input {
            width: 70%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-right: 10px;
        }

        button {
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }

        button:hover {
            background-color: #0056b3;
        }

        .todo-list {
            list-style: none;
            padding: 0;
            text-align: left;
            margin-top: 20px;
        }

        .todo-item {
            background-color: #f9f9f9;
            padding: 10px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            border-radius: 4px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            position: relative;
        }

        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #777;
        }

        .close:hover {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="todo-container">
        <h2>To-Do List</h2>

        <form action="tasks_handler.php" method="post">
            <input type="text" name="taskName" class="task-input" placeholder="Add a new task" required>
            <button type="submit" name="action" value="addTask">Add Task</button>
        </form>

        <button onclick="openModal()">Show Tasks</button>

        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>All Tasks</h2>
                <ul class="todo-list">
                    <?php foreach ($tasks as $index => $task): ?>
                        <li class="todo-item">
                            <div>
                                <strong>Task <?= $index + 1 ?>:</strong>
                                <?= htmlspecialchars($task['Task']); ?>
                            </div>
                            <div>
                                <strong>Time Stamp:</strong>
                                <?= htmlspecialchars($task['Time_Stamp']); ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>

    <script>
        function openModal() {
            document.getElementById('myModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('myModal').style.display = 'none';
        }
    </script>
</body>
</html>
