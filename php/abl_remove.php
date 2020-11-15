<?php
header("Access-Control-Allow-Origin: *");
$con = mysqli_connect("localhost", "root", "", "zimbra");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Escape variables for security
$spam = mysqli_real_escape_string($con, $_POST['spam']);
$user = mysqli_real_escape_string($con, $_POST['user']);

// Query
$sql = "DELETE FROM spams WHERE Spam='$spam' AND User='$user'";

if (!mysqli_query($con, $sql)) {
  die('Error: ' . mysqli_error($con));
}

mysqli_close($con);
?>