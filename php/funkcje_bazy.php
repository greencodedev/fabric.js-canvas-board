<?php 

$debug_mode = 0; //WARNING - WALUE 1 USE ONY ONLY ON TESTING SERVER

include_once('funkcje_uwierz.php');

function lacz_bd()

{
	
$wynik = @new mysqli ('localhost', 'najwww_app2', '0%2hgfgUik', 'najwww_app2');	
//$wynik = @new mysqli ('localhost', 'root', 'root', 'supermodne');
						//localhost, sklep, haslo, sklep
						//'host', 'uzytkownik', 'haslo', 'nazwa bazy')

	if (mysqli_connect_errno()) {
    echo '<h2 style="color: red;">Database error</h2><h3>Please inform us about the error.</h3>';
    exit();
	}
	 $wynik2 = $wynik->query("SET NAMES 'utf8'"); // niezbedne, aby dzialaly polskie znaki
   if (!$wynik)
      return false;

   return $wynik;
}

function filtruj($zmienna){
//sprawdza czy get_magic_quotes_gpc jesli nie dodaje addslashes jesli tak pozostawia zmienna bez zmian
//zabezpiecza przez podwojnym dodaniem slashy
//funkcja get_magic_quotes_gpc zwaraca 0 jesli jest to ustawieniej est wylaczone na serwerze, 1 w przeciwnym wypadku. 
$zmienna = (! get_magic_quotes_gpc ()) ? addslashes ($zmienna) : $zmienna;
return $zmienna;
}
	
function filtruj_out($zmienna){
$zmienna = stripslashes (htmlspecialchars ($zmienna)); /*htmlentites nie pozwala wyswietlac polskich znakow*/
echo $zmienna;
}

function parse($zmienna){
$zmienna = (! get_magic_quotes_gpc ()) ? addslashes ($zmienna) : $zmienna;
return $zmienna;
}

function parse_out($zmienna){
$zmienna = stripslashes (htmlspecialchars ($zmienna)); 
echo $zmienna;
}

//sprawdza wystapienie bledu w zapytanie, jesli wystapilo zapisuje w logu zapytanie, aktualny czas oraz ip
//zwraca true jesli zapytanie bylo poprawne oraz false, jesli wystapil blad
function sprawdz_sql($wynik, $sql){
	if(!$wynik){echo '<h2 style="color: red;">Wystąpił błąd bazy podczas wykonywania</h2>';
	$plik = fopen("errorlog.txt", "a");
	if(!$plik){
	echo "Błąd zapisu do pliku!";
	exit;
	}
	$teraz=time();
	$ip=getIp();
	fputs($plik,"$sql;$teraz;$ip\r\n");
	fclose($plik);
	echo '<h2>Zapisano w logach.</h2>';
	return false;
	}
return true;
}
  
function email_notify($subject, $content) {

mail("info@setstyle.pl","$subject", $content, "From: no-reply@setstyle.pl");
}

function do_sql($sql){
$lacz = lacz_bd();
$wynik = $lacz->query($sql);
if (!$wynik){echo " Wystąpił błąd bazy danych podczas wykonywania <pre>$sql</pre>";} 
else {
echo '<h2>Poprawnie wykonano polecenie SQL</h2>';
}
}

?>