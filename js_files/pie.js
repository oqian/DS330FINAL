function update(which_rating, which_rating_formal, lat, long, company) {
    const params = { lat: lat, long: long, rating: which_rating, company: company};
    const queryParams = createQueryParams(params);
    var url = '../control/count_ratings.php?'+queryParams;
    var width = 400,
        height = 250,
        radius = Math.min(width, height) / 3;

    var color = d3.scale.ordinal()
        .range(["#121d0c", "#1aa32c", "#4d95ff", "#ff7ead", "#ff4a5f"]);


    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.count;
        });

    var svg = d3.select("#pie_chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("margin-left", '-200px')
        .attr('id', which_rating)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("text")
        .attr("x", 0)
        .attr("y", -height/3)
        .style("text-anchor", "middle")
        .text(which_rating_formal);

    d3.json(url, function (d) {
        var counts = {};
        console.log(url, d);
        d.forEach(function (d) {
            // Retrieve the keywords from the JSON API response and count frequency of each one across all search results
            counts[d.rating] = d.cnt
        });
        console.log(counts);

        // Create array of objects of search results to be used by D3
        var data = [];
        for (var key in counts) {
            var val = counts[key];
            data.push({
                count: val,
                rating: key + ' stars'
            });
        }
        console.log(data);

        // Produce pie chart with data
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .attr("fill", function (d, i) {
                console.log(d.data.rating, i,
                    parseInt(d.data.rating.split(" ", 1))-1,
                    color(parseInt(d.data.rating.split(" ", 1))-1));
                console.log(color(0), color(1), color(2))
                return color(parseInt(d.data.rating.split(" ", 1))-1);
            })
            .transition()
            .ease("elastic")
            .duration(3000)
            .attrTween("d", tweenPie);

        // "extra" g to append legend
        g.append("path")
            .attr("d", arc)
            .attr("data-legend", function (d) {
                return d.data.rating;
            })
            .attr("data-legend-pos", function (d, i) {
                return color(parseInt(d.data.rating.split(" ", 1))-1);
            })
            .style("fill", function (d) {
                return color(parseInt(d.data.rating.split(" ", 1))-1);
            });

        g.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

        function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function (t) {
                return arc(i(t));
            };
        }

        var padding = 20,
            legx = radius + padding,
            legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + legx + ", 0)")
                .style("font-size", "12px")
                .call(d3.legend);

    })
}

function PieChart(lat, long, company) {
    update('overall-ratings', 'Overall Rating', lat, long, company);
    $("input").click(function() {
        var which_rating = this.id;
        var which_rating_formal = this.value;
        update(which_rating, which_rating_formal, lat, long, company);
    });
}

