<?php
header("Access-Control-Allow-Origin: *");
mysql_connect("localhost", "root", "mateus");
//Select Database
mysql_select_db("zimbra") or die(mysql_error());
// escape variables for security

$user = $_GET['user'];
$sql = sprintf("SELECT * FROM spams WHERE User='%s'", $user);

//Execute query
$qry_result = mysql_query($sql) or die(mysql_error());

$display_string = "";

while($row = mysql_fetch_array($qry_result)){
	$display_string .= $row['spam'] . "&";
}
echo $display_string;
?>