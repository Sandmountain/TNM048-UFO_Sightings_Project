var firstCheck = 0,
    g, svg,xAxis,yAxis, xScale, yScale, xValue, yValue;

function barChart(filteredData,state_hi_mean_data)
{   
    xValue = d => d.state_ab;
    yValue = d => d.hi_mean;
    const margin = {top: 30, right: 20, bottom: 70, left: 60};   
    const width = $("#barChart").width();
    const height = $("#barChart").height();
    var innerWidth = width - margin.right - margin.left;
    var innerHeight = height - margin.bottom -  margin.top;
    
    state_hi_mean_data2 = state_hi_mean_data.sort(function(a,b){return (a.hi_mean)>( b.hi_mean)}).reverse();
  
    if(firstCheck == 0){
        xScale = d3.scaleBand()
            .domain(state_hi_mean_data2.map(xValue))
            .range([0 , innerWidth])
            .padding(0.1);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(state_hi_mean_data2, yValue)])
            .range([innerHeight, 0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
        //Creates the svg holder for the barchart
        svg = d3.select("#barChart").append("svg")
            .attr("width", width)
            .attr("height", height);


        svg.append("text")
            .attr('class', "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr('x', -30)
            .attr('text-anchor', "end")
            .attr('dy', ".75em")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Yearly income($): ");
        
        svg.append("text")
            .attr('class', "axis-label")
            .attr("y", 160)
            .attr("x", 95)
            .attr('text-anchor', "end")
            .attr('dy', ".75em")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("State: ");

        g = svg.append("g")
            .attr("transform", "translate("+ margin.left + "," + margin.top + ")")
            .attr("class", "barChart");

        g.append("g")
            .call(yAxis);

        g.append("g")
            .call(xAxis)
            .attr("transform", "translate("+ 0 + "," + innerHeight + ")")
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-85)");
        //Plots the bars on the bar chart
        var barChart = g.append("g").attr("class", "bars")
            .selectAll("rect")
            .data(state_hi_mean_data2)
            .enter()
            .append("rect")
            .attr("class", "bar")
                .style("fill", function(d,i){
                    if(d.state == filteredData[0].state)
                    {
                        return "#f0c862";
                    }
                    else
                        return "steelblue";            
                })
                .attr("y", d => yScale(yValue(d)))
                .attr("x", d => xScale(xValue(d)))
                .attr("height", d => yScale(0) - yScale(yValue(d)))
                .attr("width", xScale.bandwidth())
                .on("mouseover", function(d, i)
                {
                    var current_pos = d3.mouse(this);
                    
                    d3.select(this)
                        .style("fill", "#12b259");

                        var tooltipDiv = document.getElementById('tooltip-group');
                        var tooltipState = document.getElementById("state-tooltip");
                        var tooltipHimean = document.getElementById("hi_mean-tooltip");
                        tooltipState.innerHTML = d.state;
                        tooltipHimean.innerHTML = "<b>" + Math.round(d.hi_mean) + "</b>";
                        tooltipDiv.style.top = "130px";
                        tooltipDiv.style.left = current_pos[0]+'px';
                        tooltipDiv.style.display = "block";
                })
                .on("mouseout", function(d,i)
                {
                    d3.select(this)
                        .style("fill", function(d,i){
                            if(d.state == filteredData[0].state)
                            {
                                return "#f0c862";
                            }
                            else
                                return "steelblue";            
                        });

                    var tooltipDiv = document.getElementById('tooltip-group');
                    tooltipDiv.style.display = "none";
                })
            firstCheck = 1;
        }
        
    else{
        
        updateData(filteredData,state_hi_mean_data2);
    }

    function updateData(filteredData,state_hi_mean_data2){
        d3.selectAll(".bars").remove();
         //Plots the bars on the bar chart
        var barChart = g.append("g").attr("class", "bars")
            .selectAll("rect")
            .data(state_hi_mean_data2)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", function(d,i){
                if(d.state == filteredData[0].state)
                {
                    return "#f0c862";
                }
                else
                    return "steelblue";            
            })
            .attr("y", d => yScale(yValue(d)))
            .attr("x", d => xScale(xValue(d)))
            .attr("height", d => yScale(0) - yScale(yValue(d)))
            .attr("width", xScale.bandwidth())
            .on("mouseover", function(d, i)
                {
                    var current_pos = d3.mouse(this);
                    
                    d3.select(this)
                        .style("fill", "#12b259");

                        var tooltipDiv = document.getElementById('tooltip-group');
                        var tooltipState = document.getElementById("state-tooltip");
                        var tooltipHimean = document.getElementById("hi_mean-tooltip");
                        tooltipState.innerHTML = d.state;
                        tooltipHimean.innerHTML = "<b>" + Math.round(d.hi_mean) + "</b>";
                        tooltipDiv.style.top = "130px";
                        tooltipDiv.style.left = current_pos[0]+'px';
                        tooltipDiv.style.display = "block";
                })
                .on("mouseout", function(d,i)
                {
                    d3.select(this)
                        .style("fill", function(d,i){
                            if(d.state == filteredData[0].state)
                            {
                                return "#f0c862";
                            }
                            else
                                return "steelblue";            
                        });

                    
                    
                    var tooltipDiv = document.getElementById('tooltip-group');
                    tooltipDiv.style.display = "none";
                    
                });
    }
    
}