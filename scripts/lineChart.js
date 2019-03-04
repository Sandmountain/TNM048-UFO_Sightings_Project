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

    var xScale = d3.scaleLinear().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height,0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    //Setting scale parameters
    var maxIncome = d3.max(data, function(d){ return d.hi_mean});
    var minIncome = d3.min(data, function(d){return d.hi_mean});
    
    var maxDept = d3.max(data, function(d){ return d.hc_mortgage_mean});
    var minDept = d3.min(data, function(d){ return d.hc_mortgage_mean});

    var line = d3.line()
        .x(function(d)
        {
            return xScale(d.hi_mean);
        })
        .y(function(d)
        {
            return yScale(d.hc_mortgage_mean);
        });
    
    xScale.domain(d3.extent(data, function(d)
    {
        return xScale(d.hi_mean);
    }));

    yScale.domain(d3.extent(data, function(d)
    {
        return yScale(d.hc_mortgage_mean);
    }));

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    g.append("g")
        .attr("transform", "translate(0,"+ height + ")")
        .call(xAxis);

    g.append("g")
        .call(yAxis);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke","steelblue")
        .attr("d",line);
}