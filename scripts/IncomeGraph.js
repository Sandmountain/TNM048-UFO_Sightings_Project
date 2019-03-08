function IncomeGraph(data){
    var margin = {top: 20, right: 20, bottom: 150, left: 40};
    const svgWidth = $("#scatterPlot").width();
    const svgHeight = $("#scatterPlot").height();
    
    var innerWidth = svgWidth - margin.right - margin.left;
    var innerHeight = svgHeight - margin.bottom - margin.top;

    var svg = d3.select("#scatterPlot").append("svg")
        .attr("id", "scatterPlotGraph")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    /*
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    */

    var scatterPlot = svg.append("g")
        .attr("class", "scatterPlot")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    

    var filteredArray = data.filter( data => data.state === "Florida" ).map( obj => obj); 
    var clusters = dbScan('hi_mean','hc_mortgage_mean', 2000, 100, filteredArray);
    console.log("Cluster lengh: "+ clusters.length);
    console.log(clusters);

    //Setting scale parameters
    var maxIncome = d3.max(filteredArray, d => d.hi_mean);
    var minIncome = d3.min(filteredArray, d => d.hi_mean);

    var maxDept = d3.max(filteredArray, d => d.hc_mortgage_mean);
    var minDept = d3.min(filteredArray, d => d.hc_mortgage_mean);

    var xScale = d3.scaleLinear()
        .range([0, innerWidth])
        .domain([minIncome, maxIncome]);

    var yScale = d3.scaleLinear()
        .range([innerHeight,0])
        .domain([minDept, maxDept]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var dots = scatterPlot.append("g")
        .attr("clip-path", "url(#clip)");

    scatterPlot.append("g")
        .attr("class", "axis axis--x")
        .call(xAxis)
        .attr("transform", "translate("+ 0 +","+ innerHeight + ")");


    scatterPlot.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    // "Texas" bestämmer vilken stat som ska tittas på går att ändra.
    
    
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
            if (isNaN(xScale(d.hi_mean))) 
            {
                return 0;
            }
            else
            {
                return xScale(d.hi_mean);
            }
            
            
            /*
            for (let index = 0; index < clusters.length; index++) 
            {
                if (clusters[index].parts.includes(i)) 
                {
                    return xScale(clusters[index].x);
                }
            }
            */
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
            if (isNaN(yScale(d.hc_mortgage_mean))) 
            {
                return 0;
            }
            else
            {
                return yScale(d.hc_mortgage_mean);
            }
            
            /*
            for (let index = 0; index < clusters.length; index++) 
            {
                if (clusters[index].parts.includes(i)) 
                {
                    return yScale(clusters[index].y);
                }
            }
            return yScale(d.hc_mortgage_mean);
            */
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
    /*d3.select(".legend")
        .style('left', "170px")
        .style('top', '300px');*/
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