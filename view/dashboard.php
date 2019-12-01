<?php
/**
 * Created by PhpStorm.
 * User: karen
 * Date: 11/30/19
 * Time: 7:46 PM
 */

require('basics/navbar.php');
require('../control/api.php');

$lat = $_GET["lat"];
$long = $_GET["long"];
$company = $_GET["company"];

function DECtoDMS($latitude, $longitude)
{
    $latitudeDirection = $latitude < 0 ? 'S': 'N';
    $longitudeDirection = $longitude < 0 ? 'W': 'E';

    $latitudeNotation = $latitude < 0 ? '-': '';
    $longitudeNotation = $longitude < 0 ? '-': '';

    $latitudeInDegrees = floor(abs($latitude));
    $longitudeInDegrees = floor(abs($longitude));

    $latitudeDecimal = abs($latitude)-$latitudeInDegrees;
    $longitudeDecimal = abs($longitude)-$longitudeInDegrees;

    $_precision = 3;
    $latitudeMinutes = round($latitudeDecimal*60,$_precision);
    $longitudeMinutes = round($longitudeDecimal*60,$_precision);

    return sprintf('%s%s° %s %s,  %s%s° %s %s',
        $latitudeNotation,
        $latitudeInDegrees,
        $latitudeMinutes,
        $latitudeDirection,
        $longitudeNotation,
        $longitudeInDegrees,
        $longitudeMinutes,
        $longitudeDirection
    );

}
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

<div class="right_col" role="main" style="margin-left: 250px; margin-top: 20px; height: 90%">
    <div class="row" style="display: inline-block;">
    </div>

    <div class="row">
        <div class="col-md-11 col-sm-11">
            <div class="dashboard_graph">

                <div class="row x_title">
                    <div class="col-md-6">
                        <h3><?php echo strtoupper($company)." (".DECtoDMS($lat, $long).")"?></h3>
                    </div>
                </div>

                <div class="col-md-9 col-sm-9 ">
                    <div id="chart_plot_01" class="demo-placeholder" style="height: 500px;">
                        <div id="line_plot"></div>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
        </div>

    </div>
    <br/>


    <div class="row">
        <div class="col-md-4 col-sm-4 ">
            <div class="x_panel">
                <div class="x_title">
                    <div id="text_sample" style="width: 100%"></div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>


        <div class="col-md-8 col-sm-8 ">

            <div class="row">

                <div class="col-md-11 col-sm-11">
                    <div class="x_panel">
                        <div class="x_title">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-primary" id="overall-ratings" value="Overall Rating">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-secondary" id="work-balance-stars" value="Work Life Balance">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-success" id="culture-values-stars" value="Culture Values">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-danger" id="carrer-opportunities-stars"
                                   value="Career Opportunities">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-info" id="comp-benefit-stars" value="Compensation Benefits">
                            <input style="width: 15%; font-size: xx-small; text-align: center" type="button"
                                   class="btn btn-outline-dark" id="senior-mangemnet-stars" value="Senior Management">
                            <div id="pie_chart" style="height: 700px"></div>
                            <div class="clearfix"></div>
                        </div>

                    </div>
                </div>

            </div>
            <div class="row">


                <!-- Start to do list -->
                <div class="col-md-11 col-sm-11">
                    <div class="x_panel">
                        <div class="x_title">
                            <div id="wordcloud_plot"></div>

                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
                <!-- End to do list -->

            </div>
        </div>
    </div>

</div>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA7qQFHxq1Xv4kNSoRh8eazfmA6WQfHaRs&callback=initMap"></script>
<script src="../js_files/d3.layout.cloud.js"></script>
<script src="../js_files/d3.legend.js"></script>

<script>
    document.getElementById('line_plot').innerHTML =
        "<div id=\"line_plot\"></div>";
    document.getElementById('wordcloud_plot').innerHTML =
        "<div id=\"wordcloud_plot\"></div>";
    document.getElementById('text_sample').innerHTML =
        "<div id=\"text_sample\"></div>";
    document.getElementById('pie_chart').innerHTML =
        "<div id=\"pie_chart\"></div>";

    const params = { lat: '<?php echo $lat; ?>',
                     long: '<?php echo $long; ?>',
                     company: '<?php echo $company; ?>'};
    console.log(params);
    const queryParams = createQueryParams(params);

    // comments sample table
    TextSample(queryParams);

    // wordcloud plot
    WordCloud(queryParams);

    // line plot
    LinePlot(queryParams);

    // pie chart
    PieChart('<?php echo $lat; ?>',
             '<?php echo $long; ?>',
             '<?php echo $company; ?>');
</script>

