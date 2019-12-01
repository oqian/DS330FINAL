<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/18/19
 * Time: 6:13 PM
 */

require('basics/navbar.php');
require('../control/api.php');
?>

<script type="text/javascript" src="../js_files/functions.js"></script>
<script type="text/javascript" src="../js_files/table.js"></script>
<script type="text/javascript" src="../js_files/wordcloud.js"></script>
<script type="text/javascript" src="../js_files/lineplot.js"></script>
<script type="text/javascript" src="../js_files/pie.js"></script>
<script type="text/javascript" src="../js_files/map.js"></script>

<link rel="stylesheet" type="text/css" href="../css_files/style.css">
<link rel="stylesheet" type="text/css" href="../css_files/dataTables.bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="../css_files/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../css_files/custom.min.css">
<link rel="stylesheet" type="text/css" href="../css_files/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="../css_files/nprogress.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>


<div class="right_col" role="main" style="margin-left: 250px; height: 90%; background-color: #F7F7F7;">
    <div class="row" style="margin-left: 20px; display: inline-block;">
        <div class="company">
            <div class="tile_count">
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-primary" value="google">Google
                    </button>
                </div>
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-secondary" value="microsoft">
                        Microsoft
                    </button>
                </div>
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-success" value="apple">Apple
                    </button>
                </div>
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-danger" value="netflix">Netflix
                    </button>
                </div>
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-info" value="amazon">Amazon
                    </button>
                </div>
                <div class="col-md-2 col-sm-4">
                    <button style="width: 110%" type="button" class="btn btn-outline-dark" value="facebook">Facebook
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="map" style="margin-top: 20px; height: 100%"></div>

</div>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA7qQFHxq1Xv4kNSoRh8eazfmA6WQfHaRs&callback=initMap"></script>
<script src="../js_files/d3.layout.cloud.js"></script>
<script src="../js_files/d3.legend.js"></script>