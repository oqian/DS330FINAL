function findMaxY(data) {
    var maxYValues = data.map(function (d) {
        if (d.visible) {
            return d3.max(d.values, function (value) {
                return value.rating;
            })
        }
    });
    return d3.max(maxYValues);
}

function LinePlot(queryParams) {
    var margin = {top: 20, right: 200, bottom: 100, left: 50},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = 1260 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;
    var bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left;

    var xScale = d3.time.scale()
            .range([0, width]),

        xScale2 = d3.time.scale()
            .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);


    var color = d3.scale.ordinal().range(["#19a338", "#a32b35", "#a133a3", "#262fa3", "#16c8b4", "#121d0c"]);

    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom"),

        xAxis2 = d3.svg.axis()
            .scale(xScale2)
            .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
            return xScale(d.date);
        })
        .y(function (d) {
            return yScale(d.rating);
        })
        .defined(function (d) {
            return d.rating;
        });

    var maxY;

    var svg = d3.select("#line_plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create invisible rect for mouse tracking
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white");

    // for slider part-----------------------------------------------------------------------------------

    var context = svg.append("g")
        .attr("transform", "translate(" + 0 + "," + 410 + ")")
        .attr("class", "context");

    // append clip path for lines plotted, hiding those part out of bounds
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // end slider part-----------------------------------------------------------------------------------
    var url = '../control/ratings.php?' + queryParams;

    d3.json(url, function (error, data) {

        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "date";
        }));

        data.forEach(function (d) {
            d.date = parseDate(d.date);
        });

        var categories = color.domain().map(function (name) {

            return {
                name: name,
                values: data.map(function (d) {
                    return {
                        date: d.date,
                        rating: +(d[name]),
                    };
                }),
                visible: (name === "Overall Rating" ? true : false)
            };
        });

        xScale.domain(d3.extent(data, function (d) {
            return d.date;
        }));

        yScale.domain([0, 6]);

        xScale2.domain(xScale.domain());

        // for slider part-----------------------------------------------------------------------------------

        var brush = d3.svg.brush()
            .x(xScale2)
            .on("brush", brushed);

        context.append("g")
            .attr("class", "x axis1")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        var contextArea = d3.svg.area()
            .interpolate("monotone")
            .x(function (d) {
                return xScale2(d.date);
            })
            .y0(height2)
            .y1(0);

        // plot the rect as the bar at the bottom
        context.append("path")
            .attr("class", "area")
            .attr("d", contextArea(categories[0].values))
            .attr("fill", "#F1F1F2");

        // append the brush for the selection of subsection
        context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("height", height2)
            .attr("fill", "#E6E7E8");
        // end slider part-----------------------------------------------------------------------------------

        // draw line graph
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("x", -10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Rating");

        var issue = svg.selectAll(".issue")
            .data(categories)
            .enter().append("g")
            .attr("class", "issue");

        issue.append("path")
            .attr("class", "line")
            .style("pointer-events", "none")
            .attr("id", function (d) {
                return "line-" + d.name.replace(" ", "").replace("/", "");
            })
            .attr("d", function (d) {
                return d.visible ? line(d.values) : null;
            })
            .attr("clip-path", "url(#clip)")
            .style("stroke", function (d) {
                return color(d.name);
            })
            .style("stroke-width", 5);

        // draw legend
        var legendSpace = 450 / categories.length;

        issue.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", width + (margin.right / 3) - 15)
            .attr("y", function (d, i) {
                return (legendSpace) + i * (legendSpace) - 8;
            })
            .attr("fill", function (d) {
                return d.visible ? color(d.name) : "#F1F1F2";
            })
            .attr("class", "legend-box")

            .on("click", function (d) {
                d.visible = !d.visible;

                maxY = findMaxY(categories);
                yScale.domain([0, 6]);
                svg.select(".y.axis")
                    .transition()
                    .call(yAxis);

                issue.select("path")
                    .transition()
                    .attr("d", function (d) {
                        return d.visible ? line(d.values) : null;
                    })

                issue.select("rect")
                    .transition()
                    .attr("fill", function (d) {
                        return d.visible ? color(d.name) : "#F1F1F2";
                    });
            })

            .on("mouseover", function (d) {

                d3.select(this)
                    .transition()
                    .attr("fill", function (d) {
                        return color(d.name);
                    });

                d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
                    .transition()
                    .style("stroke-width", 5);
            })

            .on("mouseout", function (d) {

                d3.select(this)
                    .transition()
                    .attr("fill", function (d) {
                        return d.visible ? color(d.name) : "#F1F1F2";
                    });

                d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
                    .transition()
                    .style("stroke-width", 1.5);
            })

        issue.append("text")
            .attr("x", width + (margin.right / 3))
            .attr("y", function (d, i) {
                return (legendSpace) + i * (legendSpace);
            })
            .text(function (d) {
                return d.name;
            });

        // Hover line
        var hoverLineGroup = svg.append("g")
            .attr("class", "hover-line");

        var hoverLine = hoverLineGroup
            .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10)
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none")
            .style("opacity", 1e-6);

        var hoverDate = hoverLineGroup
            .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height - 40))
            .attr("x", width - 150)
            .style("fill", "#E6E7E8");

        var columnNames = d3.keys(data[0])

            .slice(1);

        var focus = issue.select("g")
            .data(columnNames)
            .enter().append("g")
            .attr("class", "focus");

        focus.append("text")
            .attr("class", "tooltip")
            .attr("x", width + 20)
            .attr("y", function (d, i) {
                return (legendSpace) + i * (legendSpace);
            });

        // Add mouseover events for hover line.
        d3.select("#mouse-tracker")
            .on("mousemove", mousemove)
            .on("mouseout", function () {
                hoverDate
                    .text(null)

                d3.select("#hover-line")
                    .style("opacity", 1e-6);
            });

        function mousemove() {
            var mouse_x = d3.mouse(this)[0];
            var graph_x = xScale.invert(mouse_x);

            var format = d3.time.format('%b %Y');

            hoverDate.text(format(graph_x));

            d3.select("#hover-line")
                .attr("x1", mouse_x)
                .attr("x2", mouse_x)
                .style("opacity", 1);

            var x0 = xScale.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),

                d0 = data[i - 1],
                d1 = data[i],

                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus.select("text").text(function (columnName) {

                return (d[columnName]);
            });
        };

        //for brusher of the slider bar at the bottom
        function brushed() {

            xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());

            svg.select(".x.axis")
                .transition()
                .call(xAxis);

            maxY = findMaxY(categories);
            yScale.domain([0, 6]);

            svg.select(".y.axis")
                .transition()
                .call(yAxis);

            issue.select("path")
                .transition()
                .attr("d", function (d) {
                    return d.visible ? line(d.values) : null;
                });

        };

    });
}

