<?php
// Function to sanitize user input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to save login data to JSON file
function saveLoginData($username, $password) {
    $loginDataFile = 'login_data.json';

    try {
        // Read existing login data
        $existingData = file_get_contents($loginDataFile);
        $loginData = json_decode($existingData, true);

        if (!is_array($loginData)) {
            $loginData = [];
        }

        // Check if the username already exists
        foreach ($loginData as $entry) {
            if ($entry['username'] === $username) {
                // Handle duplicate username
                echo "Username already exists. Please choose a different username.";
                return;
            }
        }

        // Add new login attempt
        $loginData[] = array(
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'timestamp' => date('Y-m-d H:i:s')
        );

        // Save updated login data to the file
        file_put_contents($loginDataFile, json_encode($loginData, JSON_PRETTY_PRINT));

        // Redirect to a success page or perform further actions
        // For simplicity, let's redirect to a success message
        header("Location: tasks_handler.php");
        exit();
    } catch (Exception $e) {
        // Handle exceptions (e.g., file write errors)
        echo "Error: " . $e->getMessage();
    }
}

if (php_sapi_name() !== 'cli' && isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "POST") {
    // Get user input from the form
    $username = sanitizeInput($_POST["username"]);
    $password = sanitizeInput($_POST["password"]);

    if (empty($username) || empty($password)) {
        // Handle empty fields
        echo "Username and password are required.";
    } else {
        // Save login data
        saveLoginData($username, $password);

        // Redirect to a success page or perform further actions
        // For simplicity, let's redirect to a success message
        header("Location: tasks_handler.php");
        exit();
    }
}    
?> 