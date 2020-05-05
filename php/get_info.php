<?
include("mysql.php");


$uid = "";
$cmd = "";
if (isset($_POST['uid'])) {$uid = $_POST['uid'];}
if (isset($_GET['uid'])) {$uid = $_GET['uid'];}
if (isset($_POST['cmd'])) {$cmd = $_POST['cmd'];}
if (isset($_GET['cmd'])) {$cmd = $_GET['cmd'];}

$json_output = "";
$json_output .= "{\n";
if($uid !== "")
{
	if($cmd == "favs")
	{
		$query = "SELECT * FROM `users_favourites_products` WHERE `users_favourites_products`.`user_id` = \"".$uid."\" ";
		$result = mysqli_query($linkID, $query) or die("error");
	
		$json_output .= "\n \"favs\":\"";
		$n = 0;
		while ( $line = mysqli_fetch_assoc($result))
		{
			if($n > 0) {$json_output .= ",";}
			$json_output .= $line["product_id"];
			$n++;
		}
		$json_output .= "\"";
	}
	
}
$json_output .= "\n}";
echo $json_output;
?>