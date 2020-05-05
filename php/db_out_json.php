<?php


include("mysql.php");
//include("lib/Encoding.php");

$category = 0;
$subcategory = 0;
$brand = 0;
$color = 0;
$price = 0;
$start = 0;
$limit = 18;
$search = "";
$ids = "";

if( isset($_POST['category_url'])) 		{$category_url = addslashes($_POST['category_url']);}
if( isset($_POST['category'])) 		{$category = addslashes($_POST['category']);}


if( isset($_POST['subcategory'])) 	{$subcategory = addslashes($_POST['subcategory']);}
if( isset($_POST['brand'])) 		{$brand = addslashes($_POST['brand']);}
if( isset($_POST['color'])) 		{$color = addslashes($_POST['color']);}
if( isset($_POST['price'])) 		{$price = addslashes($_POST['price']);}
if( isset($_POST['start'])) 		{$start = addslashes($_POST['start']);}
if( isset($_POST['limit'])) 		{$limit = addslashes($_POST['limit']);}
if( isset($_POST['search'])) 		{$search = addslashes($_POST['search']);}
if( isset($_POST['ids'])) 		{$ids = addslashes($_POST['ids']);}

if( isset($_GET['category_url'])) 		{$category_url = addslashes($_GET['category_url']);}
if( isset($_GET['category'])) 		{$category = addslashes($_GET['category']);}
if( isset($_GET['subcategory'])) 	{$subcategory = addslashes($_GET['subcategory']);}
if( isset($_GET['brand'])){$brand = addslashes($_GET['brand']);}
if( isset($_GET['color'])){$color = addslashes($_GET['color']);}
if( isset($_GET['price'])) 			{$price = addslashes($_GET['price']);}
if( isset($_GET['start'])) 			{$start = addslashes($_GET['start']);}
if( isset($_GET['limit'])) 			{$limit = addslashes($_GET['limit']);}
if( isset($_GET['search'])) 		{$search = addslashes($_GET['search']);}
if( isset($_GET['ids'])) 		{$ids = addslashes($_GET['ids']);}


//$category = Encoding::fixUTF8($category);
//echo $category;


$array = array();
$qarray = array();
if($category !== 0) {$array['category'] = $category;} else { $qarray['category'] = 'category';}
if($subcategory !== 0) {$array['subcategory1'] = $subcategory;} else { $qarray['subcategory1'] = 'subcategory';}
if($brand !== 0) {$array['brand'] = $brand;} else { $qarray['brand'] = 'brand';}
if($color !== 0) {$array['color_eng'] = $color; } else { $qarray['color_eng'] = 'color';}
if($price !== 0) {$array['price_range'] = $price;} else { $qarray['price_range'] = 'price';}

$conquery = "";
$n = 0;      
foreach( $array as $key => $value ){
	if($n !== 0) { $conquery .= " AND ";} else {$conquery = "WHERE ";}
    $conquery .= "`products`.`".$key."` = '".$value."'";
    $n++;
}

if($search !== "")
{
	if($conquery == "")
	{
		$conquery .= " WHERE `products`.`name` LIKE '%".$search."%' ";
	}
	else
	{
		$conquery .= " AND `products`.`name` LIKE '%".$search."%' ";
	}
	
}

if($ids !== "")
{
	if($conquery == "")
	{
		$conquery .= " WHERE `products`.`product_id` IN (".$ids.") ";
	}
	else
	{
		$conquery .= " AND `products`.`product_id` IN (".$ids.") ";
	}
}

$infoblock = "";
foreach ($qarray as $key => $value) {
	$dequery = "SELECT DISTINCT (`".$key."`) AS `".$key."` FROM `products` ".$conquery;
	$infoblock .= "\t\"".$value."\":[\n";
	$deq = mysqli_query($linkID, $dequery) or die("Data not found.");
	$n = 0;
	while ( $line = mysqli_fetch_assoc($deq))
	{
		if( $n!==0 && $line[$key] !== "") {$infoblock .= ",";}
		if($line[$key] !== "")
		{
			$infoblock .= "\n\t\t{\"value\":\"".$line[$key]."\"}";
			$n++;
		}
		
	}
	$infoblock .= "\n\t],\n";
}


// count queries
$squery = "FROM `products` ".$conquery;

$numrows = getCount("SELECT COUNT(*) ".$squery, $linkID);

$query = "SELECT * ".$squery." ORDER BY `product_id` desc LIMIT ".$start.", ".$limit." ";

$before = "before";
$after = "after";
$result = mysqli_query($linkID, $query) or die("Data not found."); 



$json_output = "{\n"; 
$json_output .= "\"info\":{\n";
$json_output .= $infoblock;
$json_output .= "\t\"total\":\"".$numrows."\"";
$json_output .= "\n";
$json_output .= "},\n";
$json_output .= "\"products\":[\n"; 


while ( $line = mysqli_fetch_assoc($result))
{
	$json_output .= "\t{\n";
		$json_output .= "\t\t \"product_id\": \"".$line["product_id"]."\",\n";
		$json_output .= "\t\t \"name\": \"".htmlspecialchars($line["name"])."\",\n";
		$json_output .= "\t\t \"description\": \"".htmlspecialchars($line["description"])."\",\n";
		$json_output .= "\t\t \"category\": \"".$line["category"]."\",\n";
		$json_output .= "\t\t \"subcategory1\": \"".$line["subcategory1"]."\",\n";
		$json_output .= "\t\t \"brand\": \"".$line["brand"]."\",\n";
		$json_output .= "\t\t \"brand_url\": \"".$line["brand_url"]."\",\n";
		$json_output .= "\t\t \"color\": \"".$line["color_eng"]."\",\n";
		$json_output .= "\t\t \"price_range\": \"".$line["price_range"]."\",\n";
		$json_output .= "\t\t \"shop\": \"".htmlspecialchars($line["shop"])."\",\n";
		$json_output .= "\t\t \"shop_url\": \"".$line["deeplink"]."\",\n";
		$json_output .= "\t\t \"price\": \"".$line["price"]."\",\n";
		$json_output .= "\t\t \"smallImage\": \"".$line["image_url"].".png"."\",\n";
		$json_output .= "\t\t \"mediumImage\": \"".$line["image_url"].".png"."\",\n";
		$json_output .= "\t\t \"largeImage\": \"".$line["image_url"].".png"."\"\n";
	$json_output .= "\t},\n";
}
$json_output = rtrim($json_output,",\n");
$json_output .= "]\n"; 
$json_output .= "\n}\n"; 

echo $json_output; 
mysqli_close($linkID);

function getCount($aquery, $alink)
{
	$result  = mysqli_query($alink, $aquery) or die('Error, query failed');
	$row     = mysqli_fetch_row($result);
	$numrows = $row[0];
	return $numrows;
}


?> 
