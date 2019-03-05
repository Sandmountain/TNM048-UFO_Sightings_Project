var svgWidth = 600, svgHeight = 400;
        var margin = {top: 20, right: 20, bottom: 30, left: 50};
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;
        
        var x = d3.scaleLinear().rangeRound([0, width]),
            y = d3.scaleLinear().rangeRound([height,0]),
            xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y),
            firstCheck = 0,
            ChartWindow, g;

function lineChart(data)
{
    if(firstCheck == 0){

        ChartWindow = d3.select("#lineChart").append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight);

        g = ChartWindow.append("g")
                        .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

        updateData(data);

        firstCheck = 1;

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke","blue")
            .attr("stroke-width", 2)
            .attr("d",line);      
    }
    else{
        
        
        updateData(data);
    }

    function updateData(data){

        //Update lines with new data     
        line = d3.line()
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

        //Redraw the data
        g.selectAll("path")
            .datum(data)
            .attr("d",line)   

        //Remove old axis
        d3.select(".xAxis").remove();
        d3.select(".yAxis").remove();

        xAxis = d3.axisBottom(x);
        yAxis = d3.axisLeft(y);

        //redraw the axises
        g.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0,"+ height + ")")
            .call(xAxis);

        g.append("g")
            .attr("class", "yAxis")
            .call(yAxis);

        
    }


    g.exit().remove();
}
