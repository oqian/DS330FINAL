<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/29/19
 * Time: 8:11 PM
 */

require ('api.php');

$lat = $_GET["lat"];
$long = $_GET["long"];
$company = $_GET["company"];

echo plot_ratings($lat, $long, $company);