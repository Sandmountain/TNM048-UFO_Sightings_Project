function pieChart(data)
{
    function meanValState(data, state)
    {
        var filterData = data.filter(function(d)
        {
            return d.state === state;
        });
        
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
            {State: state, type: "hs_degree_male_mean", count: hs_degree_male_mean},
            {State: state, type: "no_hs_degree_male_mean", count: (1-hs_degree_male_mean)},
            {State: state, type: "hs_degree_female_mean", count: hs_degree_female_mean},
            {State: state, type: "no_hs_degree_female_mean", count: (1-hs_degree_female_mean)},
        ];
    }
    
        var width = $("#pieChart").width();
        var height = $("#pieChart").height();
    var radius = Math.min(width, height) / 2;
    
    var svg = d3.select("#pieChart").append("svg")
        .attr("id", "svgPie")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var color = d3.scaleOrdinal()
        .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"])
    
    var scaleQuantRad = d3.scaleQuantile()
        .domain([500, 1000, 2000, 4000, 6000, 8000, 10000])
        .range([2, 5, 7, 15, 20, 25, 30]);

    var scaleQuantColor = d3.scaleQuantile()
        .domain([500, 1000, 2000, 4000, 6000, 8000, 10000])
        .range(["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f", "#fef0d9","#00ff00", "#8B008B"]);


    meanHsDegree = meanValState(data, "Texas");
    //console.log(meanHsDegree);
  
    var pie = d3.pie()
        .value(function(d)
        {            
            return d.count;
        });
   
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var arc = g.selectAll("arc")
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
        .attr("transform", function(d)
        {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".10em")
        .text(function(d)
        {
            return d.data.type;
        });

}