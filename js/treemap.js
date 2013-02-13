
var width = 1000,
    height = 600,
    color = d3.scale.category20c();

var treemap = d3.layout.treemap()
                .size([width, height])
                .sticky(true)
                .value(function(d) { return d.pfreq; });

var div = d3.select("#chart").append("div")
            .style("position", "relative")
            .style("width", width + "px")
            .style("height", height + "px");


d3.json("data/ipumsi.json", function(json) {

  div.data([json]).selectAll("div")
      .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "cell")
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .call(cell)
      .text(function(d) { return d.children ? null : d.name; });


  d3.select("#pfreq").on("click", function() {
    div.selectAll("div")
        .data(treemap.value(function(d) { return d.pfreq; }))
      .transition()
        .duration(1500)
        .call(cell);

    d3.select("#pfreq").classed("active", true);
    d3.select("#hfreq").classed("active", false);
  });

  d3.select("#hfreq").on("click", function() {
    div.selectAll("div")
        .data(treemap.value(function(d) { return d.hfreq; }))
      .transition()
        .duration(1500)
        .call(cell);

    d3.select("#pfreq").classed("active", false);
    d3.select("#hfreq").classed("active", true);
  });

});


function cell() {
  this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

