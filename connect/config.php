<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/18/19
 * Time: 7:58 PM
 */

header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");

$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

$server = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);


//$server = 'ds330project.ck1eg5mfvf0k.us-east-2.rds.amazonaws.com';
//$username = 'admin';
//$password = '12345678';
//$db = 'ds330final';


define("DB_MAIN_HOST", $server);
define("DB_MAIN_USER", $username);
define("DB_MAIN_PASS", $password);
define("DB_MAIN_NAME", $db);
