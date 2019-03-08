function IncomeGraph(data){
    var margin = {top: 20, right: 20, bottom: 150, left: 40};
    var width = $("#scatterPlot").width();
    var height =    $("#scatterPlot").height();
    
    var svg = d3.select("#scatterPlot").append("svg")
        .attr("id", "scatterPlotGraph")
        .attr("width", width)
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

    // "Texas" bestämmer vilken stat som ska tittas på går att ändra.
    var filteredArray = data.filter( data => data.state === "Texas" ).map( obj => obj); 
    var clusters = dbScan('hi_mean','hc_mortgage_mean', 2000, 100, filteredArray);
    console.log("Cluster lengh: "+ clusters.length);
    console.log(clusters);
    
    var scaleQuantRad = d3.scaleQuantile()
        .domain([20000, 50000, 100000, 150000])
        .range([2, 5, 7, 15]);
   

    dots.selectAll("dot")
        .data(filteredArray)
        .enter().append("circle")
            /*
            .filter(function(d)
            {
                if(d.state == "Texas")
                {
                    return d;
                }  
            })*/
        .attr("class", "dotContext")
        .attr("cx", function(d,i) 
        {
            //return xScale(d.hi_mean);
            for (let index = 0; index < clusters.length; index++) 
            {
                if (clusters[index].parts.includes(i)) 
                {
                    return xScale(clusters[index].x);
                }
            }
            return xScale(d.hi_mean);
            /*
            if (clusters[0].parts.includes(i)) 
            {
                console.log();
                return xScale(clusters[0].x);
            }
            else
            {
                return xScale(d.hi_mean);
            }
            */
            
        })
        .attr("cy", function(d,i) 
        {
            for (let index = 0; index < clusters.length; index++) 
            {
                if (clusters[index].parts.includes(i)) 
                {
                    return yScale(clusters[index].y);
                }
            }
            return yScale(d.hc_mortgage_mean);
            //return yScale(d.hc_mortgage_mean);
            /*
            if (clusters[0].parts.includes(i)) 
            {
                return yScale(clusters[0].y);
            }
            else
            {
                return yScale(d.hc_mortgage_mean);
            }
            */
        })
        .attr("r", function(d) 
        {
            return scaleQuantRad(d.hi_mean);
        })
        .attr("fill", function(d,i)
        {
            for (let index = 0; index < clusters.length; index++) 
            {
                if (clusters[index].parts.includes(i)) 
                {
                    if (index == 0) 
                    {
                        return "#ff0000";
                    }
                    else if(index == 1)
                    {
                        return "#00ff00";
                    }
                }
            }
            return "#000000";
            /*
            if (clusters[0].parts.includes(i)) 
            {
                return "#ff0000";
            }
            else
            {
                return "#000000";
            }
            */
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