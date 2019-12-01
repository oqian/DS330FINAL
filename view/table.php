
<body>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="../js_files/d3.legend.js"></script>
<script>

    var width = 960,
        height = 600,
        radius = Math.min(width, height) / 3;

    var color = d3.scale.ordinal()
        .range(["#19a338", "#a32b35", "#a133a3", "#262fa3", "#16c8b4", "#121d0c"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.json("data.json", function(d) {
        var counts = {};
        d.forEach(function(d) {
            // Retrieve the keywords from the JSON API response and count frequency of each one across all search results
            counts[d.rating] = d.cnt
        });
        console.log(counts);

        // Create array of objects of search results to be used by D3
        var data = [];
        for(var key in counts) {
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
            .attr("fill", function(d, i) { return color(i); })
            .transition()
            .ease("elastic")
            .duration(3000)
            .attrTween("d", tweenPie);

        // "extra" g to append legend
        g.append("path")
            .attr("d", arc)
            .attr("data-legend", function(d) { return d.data.rating; })
            .attr("data-legend-pos", function(d, i) { return i; })
            .style("fill", function(d) { return color(d.data.rating); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

        function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) { return arc(i(t)); };
        }

        var padding = 20,
            legx = radius + padding,
            legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + legx + ", 0)")
                .style("font-size", "12px")
                .call(d3.legend);

    });

</script>
