<?php
/**
 * Created by IntelliJ IDEA.
 * User: psyanim
 * Date: 14.08.16
 * Time: 23:57
 */
$file = 'temp/filetest2.txt';
if($handle = fopen($file, 'w')) {
    $content = "123\n456";
    fwrite($handle, $content);
    fclose($handle);
} else {
    echo "Could not open file for writing.";
}
