
var width = 1000,
    height = 600,
    color = d3.scale.category20c();

var red_range    = ["#F5B3B3", "#DE9292", "#C97777", "#B55C5C", "#9E3C3C"],
    blue_range   = ["#CDE6FA", "#A4C5E0", "#89ACC9", "#6992B3", "#416D91"],
    gray_range   = ["#e0e0e0", "#c0c0c0", "#a0a0a0", "#808080", "#606060"],
    green_range  = ["#BBF0D8", "#ADDEC8", "#9DC9B6", "#8BB09F", "#7FA191"],
    orange_range = ["#F5E4C4", "#E3CEA6", "#CCB385", "#B89C69", "#A88C58"];

var continent = {
    'Africa'       : d3.scale.ordinal().range(red_range),
    'Asia'         : d3.scale.ordinal().range(blue_range),
    'Europe'       : d3.scale.ordinal().range(gray_range),
    'NorthAmerica' : d3.scale.ordinal().range(green_range),
    'SouthAmerica' : d3.scale.ordinal().range(orange_range)
};


function color_selector(d) {
    if (d.children && d.depth > 1) {
      var cont_name = d.parent.name.replace(/ /g, '');
      var fn = continent[cont_name];
      if (fn) {
          var clr = fn(d.name);
          return clr;
      } else {
console.log("not there: " + cont_name);
      }
    }
    return null;
}

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
      .style("background", color_selector)
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

