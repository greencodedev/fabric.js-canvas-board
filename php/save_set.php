<?php

include("mysql.php");

$desc = "no description";
$xml_desc = "error";
$name = "unnamed";
$price = 0;
$user_id = 0;
$contest_id = 0;
$category = "";

if (isset($_POST['set_description'])) {$desc = $_POST['set_description'];}
if (isset($_POST['xml_description'])) {$xml_desc = $_POST['xml_description'];}
if (isset($_POST['set_name'])) {$name = $_POST['set_name'];}
if (isset($_POST['total_price'])) {$price = $_POST['total_price'];}
if (isset($_POST['user_id'])) {$user_id = $_POST['user_id'];}
if (isset($_POST['img_b64'])) {$f = base64_decode($_POST['img_b64']);}
if (isset($_POST['img_b64'])) {$f2 = $_POST['img_b64'];}
if (isset($_POST['img_name'])) {$nom = $_POST['img_name'];}
if (isset($_POST['contest_id'])) {$contest_id = $_POST['contest_id'];}
if (isset($_POST['category'])) {$category = $_POST['category'];}
if (isset($_POST['set_id'])) {$set_id = $_POST['set_id'];} else { $set_id = 0;}

$img = $f2;
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$f = base64_decode($img);

$nom .= ".png";

if($user_id == 0)
{
	$temporary = 1;
}
else
{
	$temporary = 0;
}




$sql = "INSERT INTO  `".$database."`.`products_sets` (
`set_id` ,
`user_id` ,
`set_name` ,
`set_url` ,
`set_description` ,
`img_url` ,
`category` ,
`category_url` ,
`subcategory1` ,
`subcategory1_url` ,
`total_price` ,
`category_root` ,
`breadcrumb` ,
`updatecount` ,
`lastupdate` ,
`timestamp` ,
`crc` ,
`entrydate` ,
`status`,
`temporary`,
`xml_description`,
`contest_id`
)
VALUES (
NULL ,  '".$user_id."',  '".$name."', NULL ,  '".$desc."',  '".$nom."', '".$category."' , NULL , NULL , NULL ,  '".$price."', NULL , NULL , NULL , NULL , 
CURRENT_TIMESTAMP , NULL , NULL , NULL,'".$temporary."','".$xml_desc."','".$contest_id."'
)";

mysqli_query($linkID, $sql);

$sql="SELECT LAST_INSERT_ID()";
$r=mysqli_query($linkID,$sql);
$id=mysqli_result($r,0,0);

mysqli_close($linkID);

$file = fopen("temp/img/large/".$nom, "w");
chmod("temp/img/large/".$nom, 0744);



file_put_contents("temp/img/large/".$nom, $f);
//fclose($file);

include('SimpleImage.php');
   $image = new SimpleImage();
   $image->load("temp/img/large/".$nom);
   $image->resizeToHeight(320);
$thumb = "temp/img/small/";
$jpgThumb = $thumb.$nom.".jpg";
   $image->save($jpgThumb);



//$file = 'temp/image.png';
//$success = file_put_contents($file, $data);



echo '{"set":{"setId":'.$id.', "thumb":"php/'.$jpgThumb.'"}}';



?>