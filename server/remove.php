<?php
header("Access-Control-Allow-Origin: *");
$con=mysqli_connect("localhost","root","mateus","zimbra");
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$spam = mysqli_real_escape_string($con, $_GET['spam']);
$user = mysqli_real_escape_string($con, $_GET['user']);
$query = sprintf("DELETE FROM spams WHERE Spam='%s' AND User='%s'", $spam, $user);
mysqli_query($con, $query);

echo "1 record removed";
mysqli_close($con);
?>