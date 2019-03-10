var firstCheckPie = 0,
    pieChartGroup, ledgends;

function pieChart(filteredArray)
{    
    var color = d3.scaleOrdinal()
            .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"])
        
        var scaleQuantRad = d3.scaleQuantile()
            .domain([500, 1000, 2000, 4000, 6000, 8000, 10000])
            .range([2, 5, 7, 15, 20, 25, 30]);

        var scaleQuantColor = d3.scaleQuantile()
            .domain([500, 1000, 2000, 4000, 6000, 8000, 10000])
            .range(["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f", "#fef0d9","#00ff00", "#8B008B"]);

    var width = $("#pieChart").width();
    var height = $("#pieChart").height();
    var radius = Math.min(width, height) / 2;
    
    var meanHsDegree = meanValState(filteredArray);

    if(firstCheckPie == 0){
        var svg = d3.select("#pieChart").append("svg")
            .attr("id", "svgPie")
            .attr("width", width)
            .attr("height", height);

        pieChartGroup = svg.append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);
   
        var pie = d3.pie()
            .value(function(d)
            {            
                return d.count;
            });

        var path = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        var arc = pieChartGroup.append("g").attr("class", "pieChart")
            .selectAll("arc")
            .data(pie(meanHsDegree))
            .enter()
            .append("g")
            .attr("class", "arc");
            
        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d)
            {
                return color(d.data.type);
            });
            
        arc.append("text")
            /*
            .attr("transform", function(d)
            {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            */
            .attr("x", function(d)
            {
                return labelArc.centroid(d)[0];
            })
            .attr("y", function(d)
            {
                return labelArc.centroid(d)[1];
            })
            //.attr("dy", ".10em")
            .style("font-size", 10);
            /*
            .text(function(d)
            {
                return Math.round((d.data.count * 100) * 100) / 100 + "%";
            });*/ 

            ledgends = svg.append("g").attr("transform", "translate(170,-15)")

            var legend = ledgends
                .selectAll(".ledgends")
                .data(meanHsDegree)
                .enter().append("g")
                .classed("ledgends", true)
                .attr("transform", function(d,i)
                {
                    return "translate(0," + (i+1)*25 + ")";
                });

            legend.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", function(d)
                {
                    return color(d.type);
                });

            legend.append("text")
                .text(function(d)
                {
                    return Math.round((d.count * 100) * 100) / 100 + "%  " + d.type;
                })
                .attr("fill", "black")
                .style("font-size", 12)
                .attr("x", 25)
                .attr("y", 15);
                
            firstCheckPie = 1;
    }
    else{
        updateData(filteredArray)
    }
    
    
    function updateData(filteredArray)
    {
        d3.selectAll(".pieChart").remove();
        d3.selectAll(".ledgends").remove();
        
        var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

        var pie = d3.pie()
        .value(function(d)
        {            
            return d.count;
        });

        var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

        var arc = pieChartGroup.append("g")
            .attr("class", "pieChart")
            .selectAll("arc")
            .data(pie(meanHsDegree))
            .enter()
            .append("g")
                .attr("class", "arc");
            
        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d)
            {
                return color(d.data.type);
            });
            
            arc.append("text")
            .attr("x", function(d)
            {
                return labelArc.centroid(d)[0];
            })
            .attr("y", function(d)
            {
                return labelArc.centroid(d)[1];
            })
            //.attr("dy", ".10em")
            .style("font-size", 10);
            /*
            .text(function(d)
            {
                return Math.round((d.data.count * 100) * 100) / 100 + "%";
            });*/              
            
            var legend = ledgends
                .selectAll(".ledgends")
                .data(meanHsDegree)
                .enter().append("g")
                .classed("ledgends", true)
                .attr("transform", function(d,i)
                {
                    return "translate(0," + (i+1)*25 + ")";
                });

            legend.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", function(d)
                {
                    return color(d.type);
                });

            legend.append("text")
                .text(function(d)
                {
                    return Math.round((d.count * 100) * 100) / 100 + "%  " + d.type;
                })
                .attr("fill", "black")
                .style("font-size", 12)
                .attr("x", 25)
                .attr("y", 15);
    }

    function meanValState(filterData)
    {
        
        var hs_degree_male_mean = 0; 
        var hs_degree_female_mean = 0;

        for (let i = 0; i < filterData.length; i++) 
        {
            if (isNaN(filterData[i].hs_degree_male) || isNaN(filterData[i].hs_degree_female)) 
            {
                continue;
            }
            else
            {
                hs_degree_male_mean += filterData[i].hs_degree_male;
                hs_degree_female_mean += filterData[i].hs_degree_female;
            }
        }

        hs_degree_male_mean /= filterData.length;
        hs_degree_female_mean /= filterData.length;

        return [
            {State: filterData[0].state, type: "Males with High School degree", count: hs_degree_male_mean},
            {State: filterData[0].state, type: "Males without High School degree", count: (1-hs_degree_male_mean)},
            {State: filterData[0].state, type: "Females with High School degree", count: hs_degree_female_mean},
            {State: filterData[0].state, type: "Females without High School degree", count: (1-hs_degree_female_mean)},
        ];
    }
}