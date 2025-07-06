<?php
$host = "localhost";
$username = "root";  // Default user for XAMPP
$password = "";      // Default is empty for XAMPP
$dbname = "music_db";  // Your database name

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$mood = $_GET['mood'];

$sql = "SELECT title, artist, thumbnail, file_path FROM songs WHERE mood = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $mood);
$stmt->execute();
$result = $stmt->get_result();

$songs = [];
while ($row = $result->fetch_assoc()) {
    $songs[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($songs);
?>
