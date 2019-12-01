<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/18/19
 * Time: 7:04 PM
 */

require('api.php');

$company = $_GET["company"];

echo plot_map($company);