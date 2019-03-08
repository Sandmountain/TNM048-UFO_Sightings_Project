var firstCheck = 0,
    g, svg,xAxis,yAxis, xScale, yScale, xValue, yValue;

function barChart(filteredData,state_hi_mean_data)
{   
    xValue = d => d.state;
    yValue = d => d.hi_mean;
    const margin = {top: 30, right: 20, bottom: 70, left: 50};   
    const width = $("#barChart").width();
    const height = $("#barChart").height();
    var innerWidth = width - margin.right - margin.left;
    var innerHeight = height - margin.bottom -  margin.top;

    if(firstCheck == 0){
        xScale = d3.scaleBand()
            .domain(state_hi_mean_data.map(xValue))
            .range([0 , innerWidth])
            .padding(0.1);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(state_hi_mean_data, yValue)])
            .range([innerHeight, 0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        svg = d3.select("#barChart").append("svg")
            .attr("width", width)
            .attr("height", height);


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

        var barChart = g.append("g").attr("class", "bars")
            .selectAll("rect")
            .data(state_hi_mean_data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", function(d,i){
                if(d.state == filteredData[0].state)
                {
                    return "yellow";
                }
                else
                    return "steelblue";            
            })
            .attr("y", d => yScale(yValue(d)))
            .attr("x", d => xScale(xValue(d)))
            .attr("height", d => yScale(0) - yScale(yValue(d)))
            .attr("width", xScale.bandwidth());
            
            firstCheck = 1;
        }
        
    else{
        
        console.log("hej")
        updateData(filteredData,state_hi_mean_data);
    }

    function updateData(filteredData,state_hi_mean_data){
        d3.selectAll(".bars").remove();

        var barChart = g.append("g").attr("class", "bars")
            .selectAll("rect")
            .data(state_hi_mean_data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", function(d,i){
                if(d.state == filteredData[0].state)
                {
                    return "yellow";
                }
                else
                    return "steelblue";            
            })
            .attr("y", d => yScale(yValue(d)))
            .attr("x", d => xScale(xValue(d)))
            .attr("height", d => yScale(0) - yScale(yValue(d)))
            .attr("width", xScale.bandwidth());
    }
    
}