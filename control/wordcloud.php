<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/28/19
 * Time: 7:12 AM
 */

require ('api.php');

$lat = $_GET["lat"];
$long = $_GET["long"];
$company = $_GET["company"];

echo extract_reviews($lat, $long, $company);