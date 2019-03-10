function map(data){


    var margin = { top: 2, bottom: 2, left: 2, right:2}, 
        width = parseInt(d3.select('#usMap').style('width')), 
        width = width - margin.left - margin.right, 
        mapRatio = 0.5,
        resetFunction, 
        height = width * mapRatio, 
        active = d3.select(null),
        activeCounty = false,
        latestCounty = d3.select(null),
        topoJsonData,
        dataCities = scrubData(data),
        StateMeanValues = MeanStateData(data,"hi_mean",false),
        ZoomMenu, testPath,
        citiesData = (function () {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                dataType: "json",
                url: "./Database/citiesUS.json",
                mimeType: "application/json",
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();
    
    function scrubData(data){
        var scrubbed = [];
        for(var i = 0; i < data.length; i++)
        {
            if(i == 0){
                scrubbed.push([]);
                scrubbed[scrubbed.length-1].push(data[i]);
            }
            else if(scrubbed[scrubbed.length-1][0].city != data[i].city){
                if(data[i].pop > 4000)
                    scrubbed.push([]);
                    scrubbed[scrubbed.length-1].push(data[i]);
            }
            else
            {   
                    scrubbed[scrubbed.length-1].push(data[i]);
            }
        }
        return scrubbed;
    };

        var scaleQuantColor = d3.scaleQuantile()
                .domain([0, 12000, 20000, 50000, 100000, 400000, 800000])
                .range(d3.schemeBlues[8]);

        var scaleQuantRad = d3.scaleQuantile()
                .domain([0, 12000, 20000, 40000, 200000, 500000, 600000])
                //.range([2,3,4,5,6,7,8])
                .range([0.2, 0.3, 0.4, 0.5, 1, 2, 4]);

        var stateColors = d3.scaleQuantile()
                .domain([40000, 50000, 60000, 70000, 80000, 90000, 100000])
                .range(d3.schemeBlues[8]);


        var svg = d3.select('#usMap').append('svg')
            .attr('class', 'center-container')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right);

        svg.append('rect')
            .attr('class', 'background center-container')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
            .on('click', clickedState);

        Promise.resolve(d3.json('./Database/us-counties.topojson'))
            .then(ready);

        var projection = d3.geoAlbersUsa()
            .translate([width /2 , height / 2])
            .scale(width);

        var path = d3.geoPath()
            .projection(projection);
        
        //Length of the domain
        var domainLength = d3.scaleLinear()
            .domain([1, 8])
            .rangeRound([600, 800]);
        
        //Color for the legend
        var color = d3.scaleThreshold()
            .domain(d3.range(1, 8))
            .range(d3.schemeBlues[8]);
        
        // Create element for legend
        var legendText = svg.append("g")
            .attr("transform", "translate(200,40)");
        
        // Legend color scale
        legendText.selectAll("rect")
          .data(color.range().map(function(d) {
              d = color.invertExtent(d);
              if (d[0] == null) d[0] = domainLength.domain()[0];
              if (d[1] == null) d[1] = domainLength.domain()[1];
              return d;
            }))
          .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return domainLength(d[0]); })
            .attr("width", function(d) { return domainLength(d[1]) - domainLength(d[0]); })
            .attr("fill", function(d) { return color(d[0]); });
        
        // Legend title 
        legendText.append("text")
            .attr("class", "caption")
            .attr("x", domainLength.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Household income ($/year)");
        
        domainIncome = [40, 50, 60, 70, 80, 90, 100]

        // Legend markings 
        legendText.call(
            d3.axisBottom(domainLength)
            .tickSize(13)
            .tickFormat(function(x, i) { return domainIncome[i] + "k"; })
            .tickValues(d3.range(1, 8)))
          .select(".domain")
            .remove();

        var g = svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', 'translate('+margin.left+','+margin.top+')')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

     
        function ready(us) {
            topoJsonData = topojson.feature(us, us.objects.states);

            g.append("g")
                .attr("id", "counties")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "county-boundary")
                .on("mouseover", function(d) {
                    hoverCounty(d);      
                });
            
            //plotta punkter
            g.append("g")
                .attr("id","cityCircles")
                .selectAll("circle")
                .data(dataCities)
                .enter().append("circle")
                .attr("id","cityCircle")
                .attr("class", function(d){return d[0].UID}) //.attr("id",function(d){return d.id})
                .attr("cx", function (d) { 
                    if(projection([d[0].longitude,d[0].latitude])) {
                        return projection([d[0].longitude,d[0].latitude])[0];
                    }
                    else
                        return;
                })
                .attr("cy", function (d) {  
                    if(projection([d[0].longitude,d[0].latitude]))
                        return projection([d[0].longitude,d[0].latitude])[1]; 
                    else
                        return;
                    })
                .attr("r", function(d){
                    var totalPopulation = 0;
                    for(var i=0; i < d.length; i++)
                    {
                        totalPopulation += d[i].pop;
                    }
                    return scaleQuantRad(totalPopulation);
                })
                .attr("fill", function(d){
                    var totalPopulation = 0;
                    for(var i=0; i < d.length; i++)
                    {
                        totalPopulation += d[i].pop;
                    }
                    return scaleQuantColor(totalPopulation);
                })
                .on("mouseover", function(d){
                    $("." + d[0].UID).css({"stroke": "yellow", "stroke-width": "1px" });    
                })
                .on("mouseout", function(d){
                        $("." + d[0].UID).css({"stroke": "yellow", "stroke-width": "0px" });    
                });
            
           /*
           //Same Code as above, but the number of points aren't being filtered (i.e tons of small valued dots) takes very long to render
           g.append("g")
           .attr("id","cityCircles")
           .selectAll("circle")
           .data(data)
           .enter().append("circle")
           .attr("id","cityCircle")
           .attr("class", function(d){return d.UID}) //.attr("id",function(d){return d.id})
           .attr("cx", function (d) { 
               if(projection([d.longitude,d.latitude])) {
                   return projection([d.longitude,d.latitude])[0];
               }
               else
                   return;
           })
           .attr("cy", function (d) {  
               if(projection([d.longitude,d.latitude]))
                   return projection([d.longitude,d.latitude])[1]; 
               else
                   return;
               })
           .attr("r", function(d){
               var totalPopulation = 0;
               for(var i=0; i < d.length; i++)
               {
                   totalPopulation += d[i].pop;
               }
               return scaleQuantRad(totalPopulation);
           })
           .attr("fill", function(d){
               var totalPopulation = 0;
               for(var i=0; i < d.length; i++)
               {
                   totalPopulation += d.pop;
               }
               return stateColors(totalPopulation);
               })
           .on("mouseover", function(d){
               $("." + d.UID).css({"stroke": "red", "stroke-width": "1px" });    
            })
           .on("mouseout", function(d){
                $("." + d.UID).css({"stroke": "red", "stroke-width": "0px" });    
            });
            */

            g.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state")
                .attr("id", function(d){return returnState(d.id);})
                .attr("fill", function(d){
                    var thisState = returnState(d.id);
                   
                    for(let i = 0; i < StateMeanValues.length; i++)
                    {
                        if(thisState == StateMeanValues[i].state)
                        {                       
                            return stateColors(StateMeanValues[i].hi_mean);
                        }
                    }
                   
                })
                .on("click", clickedState)
                .on("mouseover", function(d) {
                    hoverState(d);      
                })
                

            g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", path);
        }

        //Handle the zoom menu
        $( "#ZoomOut" ).click(function() {
           reset();
        });
        $( "#ZoomIn" ).click(function() {
            var state = topoJsonData.features.filter(function(d) { return d.id === 20; })[0]
            var thisPath = d3.select("path#Kansas").node();
            var filteredArray = data.filter( data => data.stateID === state.id).map( obj => obj );

            updateGraphs(filteredArray);
            updateHTML(filteredArray, state.id);               
            transitionFunction(state,thisPath);
        });

        
        function clickedState(d) {    
            if (d3.select('.background').node() === this) return reset();
            if (active.node() === this) return reset();
            var filteredArray = data.filter( data => data.stateID === d.id).map( obj => obj );
            console.log(d);
            console.log(this);
            updateGraphs(filteredArray);
            updateHTML(filteredArray, d.id);
            transitionFunction(d,this);   
        }

        //Updating the graphs on the page according to the clicked state
        function updateGraphs(thisData){
            barChart(thisData, StateMeanValues);
            pieChart(thisData);
            IncomeGraph(thisData);
        }

        //Function that handles the transition zoom
        function transitionFunction(data, pressedObject){
            //Set the clicked state to be active
            active.classed("active", false);
            active = d3.select(pressedObject).classed("active", true);

            //Set the bounds to be inside the chosen state
            var bounds = path.bounds(data),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 0.9 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];
            
            //Transition to the new bounds
            g.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        //Function that updates the HTML on the page
        function updateHTML(filteredArray, thisID)
        {
            var clickedState = returnState(thisID);
            $("#cityCircles").fadeTo( "slow" , 1);

            //Set Div infromation             
            $( "#PaneHolder" ).show( "drop", { direction: "right" }, "fast" );
            $( "#scatterPlot" ).show( "drop", { direction: "down" }, "fast" );
           
            $(".TextInfromation").html(
                "In this state there are <b>" + MeanStateValues(filteredArray, "pop") + "</b> inhabitants on record. Out of those people, <b>" + MeanStateValues(filteredArray, "debt") + "</b> are in some sort of dept. The avarage house rent for a familiy in this area is <b>$" + MeanStateValues(filteredArray, "rent_mean",true) + "</b> and average yearly income is <b>$" + MeanStateValues(filteredArray, "hi_mean") + "</b>.There are <b>" + MeanStateValues(filteredArray, "male_pop") + "</b> men and <b>" + MeanStateValues(filteredArray, "female_pop") +"</b> women who lives here. <br></br> Out of the inhabitants, <b>" + MeanStateValues(filteredArray, "rent_gt_50") + "</b> are considered being underclass, and <b>" +  MeanStateValues(filteredArray,"hs_degree") + "</b> have a HS degree or higher."
            );

            $( "#CountyName" ).hide();
            $( "#StateName" ).html(clickedState);
            $("#flag").attr("src", "./Database/flags/" + clickedState.toLowerCase() + "-small.png");
        }

        


       
        function hoverCounty(d){
            //checks wether a county has been clicked or not 
            $.ajax({
                dataType: "json",
                url: "./Database/fips.json",
                mimeType: "application/json",
                success: function(counties){
                    var countyName = counties.find(item => item.FIPS === d.id);
        
                    //Set county tooltip
                    $( "#CountyLabel" ).html("<p class='countyText'>" + countyName.Name + " , " + countyName.State + "</p>").show();
                    
                    }
            });
        }

        function hoverRing(d){
            console.log(d);
        }
        function hoverState(d)
        {
            $( "#CountyLabel" ).html("<p class='stateText'>" + returnState(d.id)+ "</p>").show();
        }
        //Function to reset the position
        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            $( "#PaneHolder" ).hide( "drop", { direction: "right" }, "fast" );
            $( "#scatterPlot" ).hide( "drop", { direction: "down" }, "fast" );

            //transition back to the original position
            g.transition()
                .delay(100)
                .duration(750)
                .style("stroke-width", "1.5px")
                .attr('transform', 'translate('+margin.left+','+margin.top+')');

            $( "#CountyLabel" ).hide( "drop", { direction: "left" }, "fast" )
            $("#cityCircles").fadeTo( "fast" , 0);
        }

        function returnState(id){
          var state = {"10":"Delaware","11":"District of Columbia","12":"Florida","13":"Georgia","15":"Hawaii","16":"Idaho","17":"Illinois","18":"Indiana","19":"Iowa","20":"Kansas","21":"Kentucky","22":"Louisiana","23":"Maine","24":"Maryland","25":"Massachusetts","26":"Michigan","27":"Minnesota","28":"Mississippi","29":"Missouri","30":"Montana","31":"Nebraska","32":"Nevada","33":"New Hampshire","34":"New Jersey","35":"New Mexico","36":"New York","37":"North Carolina","38":"North Dakota","39":"Ohio","40":"Oklahoma","41":"Oregon","42":"Pennsylvania","44":"Rhode Island","45":"South Carolina","46":"South Dakota","47":"Tennessee","48":"Texas","49":"Utah","50":"Vermont","51":"Virginia","53":"Washington","54":"West Virginia","55":"Wisconsin","56":"Wyoming","1":"Alabama","2":"Alaska","4":"Arizona","5":"Arkansas","6":"California","8":"Colorado","9":"Connecticut"}
          return state[id];
        }
}

function MeanStateValues(filteredData, input)
{
    var amount = 0;
    var meanValue = 0;

    if(input == "pop" || input == "male_pop" || input == "female_pop")
    {
        for(let i = 0; i < filteredData.length; i++)
        {
        if (isNaN(filteredData[i][input])) 
            continue;
        else
            amount += filteredData[i][input];
        }
        meanValue = amount;
    }
    else{
        for(let i = 0; i < filteredData.length; i++)
        {
        if (isNaN(filteredData[i][input])) 
            continue;
        else
            amount += filteredData[i][input];
        }
    meanValue = amount / filteredData.length;
    }
    if(input == "debt" || input == "rent_gt_50" || input == "rent_gt_10" || input == "hs_degree")
    {
        return "" + Math.round(meanValue * 100 ) + "%";
    }  
    else{
        return "" + Math.round(meanValue);
    } 
}

function MeanStateData(data, input, isFiltered)
{
        
        var state = [
            {name:"Iowa", id: 0},
            {name: "Delaware",id: 1},
            {name:"District of Columbia",id: 2},
            {name:"Florida" ,id: 3},
            {name:"Georgia" ,id: 4},
            {name:"Hawaii" ,id: 5},
            {name:"Idaho" ,id: 6},
            {name:"Illinois" ,id: 7},
            {name:"Indiana" ,id: 8},
            {name:"Kansas" ,id: 9},
            {name:"Kentucky" ,id: 10},
            {name:"Louisiana" ,id: 11},
            {name:"Maine" ,id: 12},
            {name:"Maryland" ,id: 13},
            {name:"Massachusetts" ,id: 14},
            {name:"Michigan" ,id: 15},
            {name:"Minnesota" ,id: 16},
            {name:"Mississippi" ,id: 17},
            {name:"Missouri" ,id: 18},
            {name:"Montana" ,id: 19},
            {name:"Nebraska" ,id: 20},
            {name:"Nevada" ,id: 21},
            {name:"New Hampshire" ,id: 22},
            {name:"New Jersey" ,id: 23},
            {name:"New Mexico" ,id: 24},
            {name:"New York" ,id: 25},
            {name:"North Carolina" ,id: 26},
            {name:"North Dakota" ,id: 27},
            {name:"Ohio" ,id: 28},
            {name:"Oklahoma" ,id: 29},
            {name:"Oregon" ,id: 30},
            {name:"Pennsylvania" ,id: 31},
            {name:"Rhode Island" ,id: 32},
            {name:"South Carolina" ,id: 33},
            {name:"South Dakota" ,id: 34},
            {name:"Tennessee" ,id: 35},
            {name:"Texas" ,id: 36},
            {name:"Utah" ,id: 37},
            {name:"Vermont" ,id: 38},
            {name:"Virginia" ,id: 39},
            {name:"Washington" ,id: 40},
            {name:"West Virginia" ,id: 41},
            {name:"Wisconsin" ,id: 42},
            {name:"Wyoming" ,id: 43},
            {name:"Alabama" ,id: 44},
            {name:"Alaska" ,id: 45},
            {name:"Arizona" ,id: 46},
            {name:"Arkansas" ,id: 47},
            {name:"California" ,id: 48},
            {name:"Colorado" ,id: 49},
            {name:"Connecticut" ,id: 50}
        ];

            var filterData = [];
            for (let i = 0; i < state.length; i++) 
            {
                    
                var filterDataItem = data.filter(function(d)
                {
                    return d.state === state[i].name;
                    
                });   
                filterData[i] = filterDataItem;
                
            }
        

        var stateCount = filterData.length;
        var state_mean = [];
        
        for (let i = 0; i < stateCount; i++) 
        {
            state_mean[i] = {[input]: 0, state: ""};

            for (let j = 0; j < filterData[i].length; j++) 
            {
                if (isNaN(filterData[i][j][input])) 
                {
                    continue;
                }
                else
                {
                    state_mean[i][input] += filterData[i][j][input];
                    
                }
            }

            state_mean[i][input] /= filterData[i].length;
            state_mean[i].state = filterData[i][0].state;
        }
        return state_mean;
}




