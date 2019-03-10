//g, svg,xAxis,yAxis, xScale, yScale, xValue, yValue;
var firstCheckScatterPlot = 0,
    xAxisScatterPlot, yAxisScatterPlot, xScaleScatterPlot, yScaleScatterPlot, scatterPlot;

function IncomeGraph(filteredArray){
    var margin = {top: 20, right: 20, bottom: 150, left: 40};
    const svgWidth = $("#scatterPlot").width();
    const svgHeight = $("#scatterPlot").height();
    var innerWidth = svgWidth - margin.right - margin.left;
    var innerHeight = svgHeight - margin.bottom - margin.top;

    //Setting scale parameters
    var maxIncome = d3.max(filteredArray, d => d.hi_mean);
    var minIncome = d3.min(filteredArray, d => d.hi_mean);

    var maxDept = d3.max(filteredArray, d => d.hc_mortgage_mean);
    var minDept = d3.min(filteredArray, d => d.hc_mortgage_mean);

    xScaleScatterPlot = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([minIncome, maxIncome]);

    yScaleScatterPlot = d3.scaleLinear()
        .range([innerHeight,0])
        .domain([minDept, maxDept]);

    xAxisScatterPlot = d3.axisBottom(xScaleScatterPlot);
    yAxisScatterPlot = d3.axisLeft(yScaleScatterPlot);

     //TODO: räkna ut antalet
     var clusters = dbScan('hi_mean','hc_mortgage_mean', 2000, 50, filteredArray);
     console.log("Cluster lengh: "+ clusters.length);
     console.log(clusters);

    if(firstCheckScatterPlot == 0)
    {
        var svg = d3.select("#scatterPlot").append("svg")
            .attr("id", "scatterPlotGraph")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        svg.append("text")
            .attr('class', "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr('x', -120)
            .attr('text-anchor', "end")
            .attr('dy', ".75em")
            .style("font-size", "20px")
            .text("Magnitude");
        
        scatterPlot = svg.append("g")
            .attr("class", "scatterPlot")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        scatterPlot.append("g")
            .attr("class", "axis axis--x")
            .call(xAxisScatterPlot)
            .attr("transform", "translate("+ 0 +","+ innerHeight + ")");

        scatterPlot.append("g")
            .attr("class", "axis axis--y")
            .call(yAxisScatterPlot);
        
        var scaleQuantRad = d3.scaleQuantile()
            .domain([20000, 50000, 100000, 150000])
            .range([2, 3, 4, 5]);
        
        var dots = scatterPlot.append("g")

        dots.selectAll("dot")
            .data(filteredArray)
            .enter().append("circle")
            .attr("class", function(d){return d.UID})
            .attr("id", "dotContext")
            .attr("cx", function(d,i) 
            {
                if (isNaN(xScaleScatterPlot(d.hi_mean))) 
                {
                    return 0;
                }
                else
                {
                    return xScaleScatterPlot(d.hi_mean);
                }
            })
            .attr("cy", function(d,i) 
            {
                if (isNaN(yScaleScatterPlot(d.hc_mortgage_mean))) 
                {
                    return 0;
                }
                else
                {
                    return yScaleScatterPlot(d.hc_mortgage_mean);
                }
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
            })
            .on("mouseover", function(d){
                   $("." + d.UID).css({"stroke": "yellow", "stroke-width": "2px" });    
                })
            .on("mouseout", function(d){
                    $("." + d.UID).css({"stroke": "yellow", "stroke-width": "0px" });    
            });
    firstCheckScatterPlot = 1;
    }
    else{
        updateData(filteredArray);
    }
    
    function updateData(filteredArray){
        d3.selectAll("#dotContext").remove();
        d3.selectAll()
        var scaleQuantRad = d3.scaleQuantile()
        .domain([20000, 50000, 100000, 150000])
        .range([2, 3, 4, 5]);
    
    var dots = scatterPlot.append("g")
        
    dots.selectAll("dot")
        .data(filteredArray)
        .enter().append("circle")
        .attr("class", function(d){return d.UID})
        .attr("id", "dotContext")
        .attr("cx", function(d,i) 
        {
            if (isNaN(xScaleScatterPlot(d.hi_mean))) 
            {
                return 0;
            }
            else
            {
                return xScaleScatterPlot(d.hi_mean);
            }
        })
        .attr("cy", function(d,i) 
        {
            if (isNaN(yScaleScatterPlot(d.hc_mortgage_mean))) 
            {
                return 0;
            }
            else
            {
                return yScaleScatterPlot(d.hc_mortgage_mean);
            }
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
        })
        .on("mouseover", function(d){
            $("." + d.UID).css({"stroke": "yellow", "stroke-width": "2px" });    
            })
        .on("mouseout", function(d){
            $("." + d.UID).css({"stroke": "yellow", "stroke-width": "0px"  });    
        });
    }
    


}