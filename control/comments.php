<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/30/19
 * Time: 1:08 AM
 */

require ('api.php');

$lat = $_GET["lat"];
$long = $_GET["long"];
$company = $_GET["company"];

echo extract_raw_reviews($lat, $long, $company);