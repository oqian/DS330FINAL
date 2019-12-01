<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/18/19
 * Time: 5:31 PM
 */
require (__DIR__ . '/../connect/connect.php');

function plot_map($company) {
    global $con;
    $query = "
       SELECT company, location, 
       `overall-ratings`,
       latitude, longitude from employee_review
       WHERE company='$company'
       ORDER BY rand()
        LIMIT 20;
        ";

    $result_set = mysqli_query($con, $query);
    $data = array();
    while ($result = mysqli_fetch_assoc($result_set)) {
        $data[]= $result;
    }

    return json_encode($data);
}

function extract_reviews($lat, $long, $company) {
    global $con;
    $query = "
       SELECT comments FROM employee_review
        WHERE abs(latitude-$lat)<0.001
        AND abs(longitude-$long)<0.001
        AND company='$company'
        ORDER BY rand()
        LIMIT 100;
        ";
    $result_set = mysqli_query($con, $query);
    $data = array();
    while ($result = mysqli_fetch_assoc($result_set)) {
        $data[]= preg_replace('/\d/', '', implode(" ",$result));
    }
    # return implode(", ", $data);
    return json_encode($data);
}

function plot_ratings($lat, $long, $company) {
    global $con;
    $query = "
       SELECT DATE_FORMAT(dates, '%Y%m%d') AS date,
          `work-balance-stars` AS `Work Life Balance`,
          `culture-values-stars` AS `Culture Values`,
          `carrer-opportunities-stars` AS `Career Opportunities`,
          `comp-benefit-stars` AS `Compensation Benefits`,
          `senior-mangemnet-stars` AS `Senior Management`,
          `overall-ratings` AS `Overall Rating` FROM employee_review
        WHERE abs(latitude-$lat)<0.001 AND abs(longitude-$long)<0.001 AND company='$company'
        ORDER BY date ASC";

    $result_set = mysqli_query($con, $query);
    $data = array();
    while ($result = mysqli_fetch_assoc($result_set)) {
        $data[]= $result;
    }

    return json_encode($data);
}

function extract_raw_reviews($lat, $long, $company) {
    global $con;
    $query = "
       SELECT id,
          if(length(raw_comments) <= 200, raw_comments, concat(substr(raw_comments, 1, 150), '  ...')) as comments,
          `overall-ratings` as rating FROM employee_review_raw_comments
        WHERE abs(latitude-$lat)<0.001
              AND abs(longitude-$long)<0.001
              AND company='$company'
        ORDER BY rand()
        LIMIT 20
        ";
    $result_set = mysqli_query($con, $query);
    $data = array();
    while ($result = mysqli_fetch_assoc($result_set)) {
        $data[]= $result;
    }

    return json_encode($data);
}

function plot_piechart($lat, $long, $rating, $company) {
    global $con;
    $query = "
       SELECT `$rating` as rating, count(*) as cnt
        FROM employee_review
        WHERE abs(latitude-$lat)<0.001 AND abs(longitude-$long)<0.001 AND company='$company'
        GROUP BY `$rating`
       ";
    $result_set = mysqli_query($con, $query);
    $data = array();
    while ($result = mysqli_fetch_assoc($result_set)) {
        $data[]= $result;
    }

    return json_encode($data);
}


?>






