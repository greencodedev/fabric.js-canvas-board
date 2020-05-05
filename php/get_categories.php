<?php
include("mysql.php");
$query = "SELECT `category`,COUNT(*) FROM `products` GROUP BY `category` HAVING COUNT(*) > 1 ORDER BY COUNT(*)";
$result = mysqli_query($linkID, $query) or die("Data not found."); 



$json_output = "{\n"; 
$json_output .= "\"categories\":[\n"; 

while ( $line = mysqli_fetch_assoc($result))
{
		if($line["category"] != "")
		{
			$json_output .= "\"".$line["category"]."\",";
		}
		
}
$json_output = rtrim($json_output, ",");
$json_output .= "]}\n"; 
echo $json_output;

?>