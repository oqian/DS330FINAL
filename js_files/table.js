function TextSample(queryParams) {
    var column_names = ["Comments", "Overall Rating"];
    var clicks = {comments_view: 0, rating_view: 0};

    // draw the table
    d3.select("#text_sample").append("div")
        .attr("id", "container");

    d3.select("#container").append("div")
        .attr("id", "FilterableTable");

    d3.select("#FilterableTable").append("div")
        .attr("class", "SearchBar")
        .append("p")
        .attr("class", "SearchBar")
        .text("Search By Key Words:");

    d3.select(".SearchBar")
        .append("input")
        .attr("class", "SearchBar")
        .attr("id", "search")
        .attr("type", "text")
        .attr("placeholder", "Search...");

    var table = d3.select("#FilterableTable").append("table");
    table.append("thead").append("tr");

    var headers = table.select("tr").selectAll("th")
        .data(column_names)
        .enter()
        .append("th")
        .text(function(d) { return d; });

    var rows, row_entries, row_entries_no_anchor, row_entries_with_anchor;

    var url = '../control/comments.php?'+queryParams;

    d3.json(url, function(data) { // loading data from server
        console.log(data);
        // draw table body with rows
        table.append("tbody");

        // data bind
        rows = table.select("tbody").selectAll("tr")
            .data(data, function(d){ return d.id; });

        // enter the rows
        rows.enter()
            .append("tr");

        // enter td's in each row
        row_entries = rows.selectAll("td")
            .data(function(d) {
                var arr = [];
                for (var k in d) {
                    if (d.hasOwnProperty(k)) {
                        if(d[k].length > 100)
                            d[k] = d[k].substring(0,100)+'...';
                        arr.push(d[k]);
                    }
                }
                return [arr[1],arr[2]];
            })
            .enter()
            .append("td");

        // draw row entries with no anchor
        row_entries_no_anchor = row_entries.filter(function(d) {
            return (/https?:\/\//.test(d) == false)
        })
        row_entries_no_anchor.text(function(d) { return d; })

        // draw row entries with anchor
        row_entries_with_anchor = row_entries.filter(function(d) {
            return (/https?:\/\//.test(d) == true)
        })
        row_entries_with_anchor
            .append("a")
            .attr("href", function(d) { return d; })
            .attr("target", "_blank")
            .text(function(d) { return d; })


        /**  search functionality **/
        d3.select("#search")
            .on("keyup", function() { // filter according to key pressed
                var searched_data = data,
                    text = this.value.trim();

                var searchResults = searched_data.map(function(r) {
                    // TODO: fix regexp to filter sentences with the key word in it
                    var regex = new RegExp(".*" + text + ".*");
                    if (regex.test(r.comments)) { // if there are any results
                        return regex.exec(r.comments)[0]; // return them to searchResults
                    }
                });

                // filter blank entries from searchResults
                searchResults = searchResults.filter(function(r){
                    return r != undefined;
                });

                // filter dataset with searchResults
                searched_data = searchResults.map(function(r) {
                    return data.filter(function(p) {
                        return p.comments.indexOf(r) != -1;
                    })
                });

                // flatten array
                searched_data = [].concat.apply([], searched_data);

                // data bind with new data
                rows = table.select("tbody").selectAll("tr")
                    .data(searched_data, function(d){ return d.id; })

                // enter the rows
                rows.enter()
                    .append("tr")
                    .style('width', '100%');

                // enter td's in each row
                row_entries = rows.selectAll("td")
                    .data(function(d) {
                        var arr = [];
                        for (var k in d) {
                            if (d.hasOwnProperty(k)) {
                                arr.push(d[k]);
                            }
                        }
                        return [arr[1],arr[2]];
                    })
                    .enter()
                    .append("td");

                // draw row entries with no anchor
                row_entries_no_anchor = row_entries.filter(function(d) {
                    return (/https?:\/\//.test(d) == false)
                })
                row_entries_no_anchor.text(function(d) { return d; })

                // draw row entries with anchor
                row_entries_with_anchor = row_entries.filter(function(d) {
                    return (/https?:\/\//.test(d) == true)
                })
                row_entries_with_anchor
                    .append("a")
                    .attr("href", function(d) { return d; })
                    .attr("target", "_blank")
                    .text(function(d) { return d; })

                // exit
                rows.exit().remove();
            })

        /**  sort functionality **/
        headers
            .on("click", function(d) {
                if (d == "Comments") {
                    clicks.comments_view++;
                    // even number of clicks
                    if (clicks.comments_view % 2 == 0) {
                        // sort ascending: alphabetically
                        rows.sort(function(a,b) {
                            if (a.comments.toUpperCase() < b.comments.toUpperCase()) {
                                return -1;
                            } else if (a.comments.toUpperCase() > b.comments.toUpperCase()) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        // odd number of clicks
                    } else if (clicks.comments_view % 2 != 0) {
                        // sort descending: alphabetically
                        rows.sort(function(a,b) {
                            console.log(a, b)
                            if (a.comments.toUpperCase() < b.comments.toUpperCase()) {
                                return 1;
                            } else if (a.comments.toUpperCase() > b.comments.toUpperCase()) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
                    }
                }
                if (d == "Overall Rating") {
                    clicks.rating_view++;
                    // even number of clicks
                    if (clicks.rating_view % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a,b) {
                            if (+a.rating < +b.rating) {
                                return -1;
                            } else if (+a.rating > +b.rating) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        // odd number of clicks
                    } else if (clicks.rating_view % 2 != 0) {
                        // sort descending: numerically
                        rows.sort(function(a,b) {
                            if (+a.rating < +b.rating) {
                                return 1;
                            } else if (+a.rating > +b.rating) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
                    }
                }
            }) // end of click listeners
    })
}
