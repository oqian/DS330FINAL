<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/30/19
 * Time: 5:41 PM
 */

require ('api.php');

$lat = $_GET["lat"];
$long = $_GET["long"];
$rating = $_GET["rating"];
$company = $_GET["company"];

echo plot_piechart($lat, $long, $rating, $company);