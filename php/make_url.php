<?php
function make_url($str) {
$str = strtolower($str);

$str = str_replace(' ?', '', $str);
$str = str_replace(' ', '-', $str);
$str = str_replace('.', '', $str);
$str = str_replace(',', '', $str);
$str = str_replace('`', '', $str);
$str = str_replace('/', '-', $str);
$str = str_replace('ä', 'a', $str);
$str = str_replace('ö', 'o', $str);
$str = str_replace('å', 'a', $str);
$str = str_replace('Ä', 'a', $str);
$str = str_replace('Ö', 'o', $str);

$str = str_replace('Å', 'a', $str);
$str = str_replace('ü', 'u', $str);
$str = str_replace('è', 'e', $str);
$str = str_replace('ã', '', $str);

$str = str_replace('ø', '', $str);
$str = str_replace('é', 'e', $str);
$str = str_replace('¬', '', $str);
$str = str_replace('º', '', $str);
$str = str_replace('»', '', $str);
$str = str_replace('â', 'a', $str);
$str = str_replace('³', '', $str);
$str = str_replace('µ', '', $str);
$str = str_replace('´', '', $str);

$str = str_replace('_', '-', $str);
$str = str_replace('---', '-', $str);
$str = str_replace('--', '-', $str);
$str = str_replace('è', 'e', $str);
$str = str_replace('¨', '', $str);
$str = str_replace('´', '', $str);

$str = str_replace('?', '', $str);
$str = str_replace('&', '-', $str);
$str = str_replace('---', '-', $str);
$str = str_replace('-–-', '-', $str);

$str = str_replace('\\', '', $str);

$str = str_replace('"', '', $str);

$str = str_replace('--', '-', $str);
$str = str_replace('>', '', $str);
$str = str_replace('-«', '-', $str);

$str = str_replace('ę', 'e', $str);
$str = str_replace('ó', 'o', $str);
$str = str_replace('ą', 'a', $str);
$str = str_replace('ś', 's', $str);
$str = str_replace('ł', 'l', $str);
$str = str_replace('ź', 'z', $str);
$str = str_replace('ż', 'z', $str);
$str = str_replace('ć', 'c', $str);
$str = str_replace('ń', 'n', $str);
$str = str_replace('Ę', 'e', $str);
$str = str_replace('Ó', 'o', $str);
$str = str_replace('Ą', 'a', $str);
$str = str_replace('Ś', 's', $str);
$str = str_replace('Ł', 'l', $str);
$str = str_replace('Ź', 'z', $str);
$str = str_replace('Ż', 'z', $str);
$str = str_replace('Ć', 'c', $str);
$str = str_replace('Ń', 'n', $str);
$str = str_replace('+', '', $str);

$str = str_replace('\'', '', $str);







//$str = trim($str, '-');
//$str = trim($str, '_');

return $str;
}
?>