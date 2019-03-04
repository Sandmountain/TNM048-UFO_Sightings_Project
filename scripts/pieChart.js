function pieChart(data)
{
    
    var width = 500;
    var height = 300;
    var radius = Math.min(width, height) / 2;
    
    var svg = d3.select("#pieChart").append("svg")
        .attr("position", "relative")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var pie = d3.pie().value(function(d)
    {
        return d.hi_mean;
    });
    
    var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var arc = g.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");
        
    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d)
        {
            return color(d.data.hi_mean);
        });
        

}