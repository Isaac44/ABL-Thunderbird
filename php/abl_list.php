<?php
header("Access-Control-Allow-Origin: *");
$con = mysqli_connect("localhost", "root", "", "zimbra");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// escape variables for security
$user = mysqli_real_escape_string($con, $_GET['user']);
$sql = "SELECT * FROM spams WHERE User='$user'";

//Execute query
$qry_result = mysqli_query($con, $sql) or die(mysql_error());


$display_string = "";
while($row = mysqli_fetch_array($qry_result))
{
	$v = $row['Spam'];
	
	if (strrpos($display_string, $v) === false) {
		$display_string .= $v . "&";
	}

}
echo $display_string;

mysqli_close($con);
?>