<?php
include("mysql.php");



$id = $_GET['id'];

if (isset($_POST['id'])) {$id = $_POST['id'];}
if (isset($_GET['id'])) {$id = $_GET['id'];}

$query = "SELECT * FROM `".$database."`.`products_sets` WHERE `products_sets`.`set_id` = ".$id." LIMIT 1";

$result = mysqli_query($linkID, $query);


while($row =  mysqli_fetch_assoc($result))
{
    $xml_desc = $row['xml_description'];
	$set_desc = $row['set_description'];
	$set_name = $row['set_name'];
} 

mysqli_close($linkID);

$output = "";

$output .= "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n";
$output .= "<data> \n";
$output .= "<params> \n";
$output .= "<name>".$set_name."</name> \n";
$output .= "<desc>".$set_desc."</desc>";
$output .= "</params> \n";
$output .= $xml_desc;
$output .= "</data> \n";

echo $output;

?>