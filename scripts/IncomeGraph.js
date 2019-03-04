function IncomeGraph(data){
    var margin = {top: 20, right: 20, bottom: 150, left: 40};
    var width = $("#IncomeGraph").parent().width();
    var height =  300;
    
    var svg = d3.select("#IncomeGraph").append("svg")
        .attr("position", "relative")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom);
    /*
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    */

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height,0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    //Setting scale parameters
    var maxIncome = d3.max(data, function(d){ return d.hi_mean});
    var minIncome = d3.min(data, function(d){return d.hi_mean});
    
    var maxDept = d3.max(data, function(d){ return d.hc_mortgage_mean});
    var minDept = d3.min(data, function(d){ return d.hc_mortgage_mean});

    console.log("maxIncome:" + maxIncome + " minIncome:" + minIncome + " maxDept:" + maxDept + " minDept:" + minDept);
    
    xScale.domain([minIncome, maxIncome]);
    yScale.domain([minDept, maxDept]);

    var dots = context.append("g")
        .attr("clip-path", "url(#clip)");
    
    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0,"+ height + ")")
        .call(xAxis);

    context.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    dots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .filter(function(d)
        {
            if(d.hc_mortgage_mean < 3200 && d.hi_mean > 200000)
            {
                return d;
            }   
        })
        .attr("class", "dotContext")
        .attr("cx", function(d) {
            return xScale(d.hi_mean);
            })
        .attr("cy", function(d) {
            return yScale(d.hc_mortgage_mean);
            })
        .attr("r", function(d) {
            return 2;
         });

    //Points.plot(scatterDots);
          //Add y axis label to the scatter plot
    d3.select(".legend")
        .style('left', "170px")
        .style('top', '300px');
    svg.append("text")
        .attr('class', "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr('x', -120)
        .attr('text-anchor', "end")
        .attr('dy', ".75em")
        .style("font-size", "20px")
        .text("Magnitude");
    
    
    


}