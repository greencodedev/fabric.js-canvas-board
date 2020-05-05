<?php 
function losuj_kod($dlugosc){
	$znaki = array("a","b",
	               "c","d","e","f","g","h","i","j","k","l","m","n","o","p",
	               "q","r","s","t","u","v","w","x","y","z",
	               "1","2","3","4","5","6","7","8","9","0");
 
//dlugosc kodu
	$dlugosc_kodu = $dlugosc;
 
//kod wynikowy
	$kod = "";
	
//liczba pol w tablicy znakow
	$liczba_pol = count($znaki) - 1;
 
	for ($i = 0; $i < $dlugosc_kodu; $i++){
		$pole = rand(0, $liczba_pol);
		$kod = $kod . $znaki[$pole];
	}
 
return $kod;
}

function getIp()
{if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
	$ip_address=$_SERVER['HTTP_X_FORWARDED_FOR'];
	}

if (!isset($ip_address)){
		if (isset($_SERVER['REMOTE_ADDR']))	
		$ip_address=$_SERVER['REMOTE_ADDR'];
	}
return $ip_address;
}


?>