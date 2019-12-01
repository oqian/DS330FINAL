function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: new google.maps.LatLng(39.5, -98.35),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow_loc = new google.maps.InfoWindow();

    $("button").click(function() {
        document.getElementById('map').innerHTML = "<div id=\"map\"></div>";
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(39.5, -98.35),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        document.getElementById("map").style["height"] = "100%";
        document.getElementById("map").style["width"] = "100%";
        var chosen_company = this.value;

        const params = { company : chosen_company};
        const queryParams = createQueryParams(params);
        var url = '../control/location.php?'+queryParams;
        console.log(url);

        d3.json(url, function (error, events) {
            events.forEach(function (marker) {
                generateIcon(marker['overall-ratings'], function (src) {
                    var pos = new google.maps.LatLng(parseFloat(marker['latitude']),
                        parseFloat(marker['longitude']));
                    map_marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: src
                    });
                    map_marker.location = "<span>Company: </span>" + marker['company'] +
                        '<br>' + "<span>Location: </span>" + marker['location'];


                    google.maps.event.addListener(map_marker, 'mouseover', (function (map_marker) {
                        return function () {
                            infowindow_loc.setContent(map_marker.location);
                            infowindow_loc.open(map, map_marker);
                        }
                    })(map_marker));

                    google.maps.event.addListener(map_marker, 'click', (function (map_marker) {
                        return function () {

                            var lat = parseFloat(marker['latitude']);
                            var long = parseFloat(marker['longitude']);
                            map.setCenter({lat: lat,
                                lng: long});
                            window.location = '../view/dashboard.php?lat=' + lat + '&long=' + long + '&company=' + chosen_company;
                        }
                    })(map_marker));

                });
            });
        })
    });
}
