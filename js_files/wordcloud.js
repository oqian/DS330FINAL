function wordcloud(selector) {

    var fill = d3.scale.category20();

    var svg = d3.select(selector).append("svg")
        .attr("width", 850)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(400,250)");

    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function(d) { return d.text; })

        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        cloud
            .transition()
            .duration(600)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        cloud.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }

    return {

        update: function(words) {
            d3.layout.cloud().size([800, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 45; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

function WordCloud(queryParams) {
    var url = '../control/wordcloud.php?'+queryParams;

    d3.json(url, function (error, data) {
        var words = data;
        function getWords(i) {
            return words[i]
                .replace(/[!\.,:;\?]/g, '')
                .split(' ')
                .map(function(d) {
                    return {text: d, size: 10 + Math.random() * 60};
                })
        }
        function showNewWords(vis, i) {
            i = i || 0;

            vis.update(getWords(i ++ % words.length));
            setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
        }
        var myWordCloud = wordcloud('#wordcloud_plot');
        showNewWords(myWordCloud);
    });
}
