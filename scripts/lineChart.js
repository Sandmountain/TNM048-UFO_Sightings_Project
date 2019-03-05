function lineChart(data)
{
    var svgWidth = 600, svgHeight = 400;
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#lineChart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var g = svg.append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height,0]);
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var line = d3.line()
        .x(function(d)
        {
            return x(d.hi_mean);
        })
        .y(function(d)
        {
            return y(d.rent_mean);
        });
    
    x.domain(d3.extent(data, function(d)
    {
        return d.hi_mean;
    }));

    y.domain(d3.extent(data, function(d)
    {
        return d.rent_mean;
    }));

    

    g.append("g")
        .attr("transform", "translate(0,"+ height + ")")
        .call(xAxis);

    g.append("g")
        .call(yAxis);

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke","blue")
        .attr("stroke-width", 2)
        .attr("d",line);
}