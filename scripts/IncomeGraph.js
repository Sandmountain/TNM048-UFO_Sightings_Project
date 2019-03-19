
var firstCheckScatterPlot = 0,
    xAxisScatterPlot, yAxisScatterPlot, xScaleScatterPlot, yScaleScatterPlot, scatterPlot, xInput, yInput;

function IncomeGraph(filteredArray){
    var margin = {top: 20, right: 20, bottom: 150, left: 70};
    const svgWidth = $("#scatterPlot").width();
    const svgHeight = $("#scatterPlot").height();
    var innerWidth = svgWidth - margin.right - margin.left;
    var innerHeight = svgHeight - margin.bottom - margin.top;
    xInput = "hi_mean";
    yInput = "hs_degree";
    //Setting scale parameters
    var maxIncome = d3.max(filteredArray, d => d[xInput]);
    var minIncome = d3.min(filteredArray, d => d[xInput]);

    var maxDept = d3.max(filteredArray, d => d[yInput]);
    var minDept = d3.min(filteredArray, d => d[yInput]);

    xScaleScatterPlot = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([minIncome, maxIncome]);

    yScaleScatterPlot = d3.scaleLinear()
        .range([innerHeight,0])
        .domain([minDept, maxDept]);

    xAxisScatterPlot = d3.axisBottom(xScaleScatterPlot);
    yAxisScatterPlot = d3.axisLeft(yScaleScatterPlot);

    //TODO: räkna ut antalet
    var clusters = dbScan(xInput,yInput, 1000, 10, filteredArray);

    console.log("Cluster lengh: "+ clusters.length);
    console.log(clusters);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    if(firstCheckScatterPlot == 0)
    {
        //Creates svg holder for the scatter plot.
        var svg = d3.select("#scatterPlot").append("svg")
            .attr("id", "scatterPlotGraph")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        svg.append("text")
            .attr('class', "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr('x', -50)
            .attr('text-anchor', "end")
            .attr('dy', ".75em")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("High School Degree: ");

        svg.append("text")
            .attr('class', "axis-label")
            .attr("y", 280)
            .attr("x", 666)
            .attr('text-anchor', "middle")
            .attr('dy', ".75em")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Household mean income($): ");
        
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
        
        var dots = scatterPlot.append("g");
        //This draws the dots on the graph 
        dotContext = dots.selectAll("dot")
            .data(filteredArray)
            .enter().append("circle")
            .attr("class", function(d){return d.UID})
            .attr("id", "dotContext")
            .attr("cx", function(d,i) 
            {
                if (isNaN(xScaleScatterPlot(d[xInput]))) 
                {
                    return 0;
                }
                else
                {
                    return xScaleScatterPlot(d[xInput]);
                }
            })
            .attr("cy", function(d,i) 
            {
                if (isNaN(yScaleScatterPlot(d[yInput]))) 
                {
                    return 0;
                }
                else
                {
                    return yScaleScatterPlot(d[yInput]);
                }
            })
            .attr("r", function(d) 
            {
                return scaleQuantRad(d[xInput]);
            })
            .attr("fill", function(d,i)
            {
                
                for (let index = 0; index < clusters.length; index++) 
                {
                    if (clusters[index].parts.includes(i)) 
                    {
                        return colorScale(index);
                    }
                }
                return "#000000";
            })
            .on("mouseover", function(d){
                   $("." + d.UID).css({"stroke": "red", "stroke-width": "4px" });
                   scatterInfo(d);    
                   $( "#scatterInfo" ).show(); 
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
    
    var dots = scatterPlot.append("g");

        
    dotContext = dots.selectAll("dot")
        .data(filteredArray)
        .enter().append("circle")
        .attr("class", function(d){return d.UID})
        .attr("id", "dotContext")
        .attr("cx", function(d,i) 
        {
            if (isNaN(xScaleScatterPlot(d[xInput]))) 
            {
                return 0;
            }
            else
            {
                return xScaleScatterPlot(d[xInput]);
            }
        })
        .attr("cy", function(d,i) 
        {
            if (isNaN(yScaleScatterPlot(d[yInput]))) 
            {
                return 0;
            }
            else
            {
                return yScaleScatterPlot(d[yInput]);
            }
        })
        .attr("r", function(d) 
        {
            return scaleQuantRad(d[xInput]);
        })
        .attr("fill", function(d,i)
        {
            for (let index = 0; index < clusters.length; index++) 
            {
                    if (clusters[index].parts.includes(i)) 
                    {
                        return colorScale(index);
                    }
                
            }
            return "#000000";
        })
        .on("mouseover", function(d){
            $("." + d.UID).css({"stroke": "red", "stroke-width": "4px" });
            scatterInfo(d);  
            $( "#scatterInfo" ).show();  
            })
        .on("mouseout", function(d){
            $("." + d.UID).css({"stroke": "red", "stroke-width": "0px"  });    
        });
    }
}

//Update the tooltip if a point is hovered
function scatterInfo(data)
{
    $("#infoPanel").html("Point Info")
    var scatterInfo = d3.select("#scatterInfo")

    scatterInfo
        .select("#hi_mean_info")
        .html("Yearly income: $<b>" + Math.round(data[xInput])+ "</b>");
    scatterInfo
        .select("#pop_info")
        .html("Population: <b>" + data.pop+"</b> people");
    scatterInfo
        .select("#mortgage_info")
        .html("Average HS degree: <b>" + Math.round(data[yInput]*100) + "</b>%") ;
    scatterInfo
        .select("#city_info")
        .html("City: <b>" + data.city + "</b>");
    scatterInfo
        .select("#place_info")
        .html("Area: <b>" + data.place + "</b>");
    
}
    