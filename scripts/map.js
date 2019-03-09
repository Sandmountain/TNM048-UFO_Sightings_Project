function map(data){

var margin = { top: 2, bottom: 2, left: 2, right:2}, 
    width = parseInt(d3.select('#usMap').style('width')), 
    width = width - margin.left - margin.right, 
    mapRatio = 0.5, 
    height = width * mapRatio, 
    active = d3.select(null),
    activeCounty = false,
    latestCounty = d3.select(null),
    dataCities = scrubData(data),
    StateMeanValues = MeanStateData(data,"hi_mean"),
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
                if(data[i].pop > 6500)
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
                .domain([6500, 12000, 20000, 50000, 100000, 400000, 800000])
                .range(["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0","#0570b0", "#034e7b"]);

        var scaleQuantRad = d3.scaleQuantile()
                .domain([6500, 12000, 20000, 40000, 200000, 500000, 600000])
                //.range([2,3,4,5,6,7,8])
                .range([0.01, 0.05, 0.1, 0.3, 0.5, 1, 4]);

        var stateColors = d3.scaleQuantile()
                .domain([50000, 55000, 60000, 65000, 700000, 80000, 90000])
                .range(["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0","#0570b0", "#034e7b"]);


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

        var g = svg.append("g")
            .attr('class', 'center-container center-items us-state')
            .attr('transform', 'translate('+margin.left+','+margin.top+')')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        function ready(us) {

            g.append("g")
                .attr("id", "counties")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.counties).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "county-boundary")
                .on("mouseover", function(d) {
                    hoverCounty(d);      
                })
            
            //plotta punkter
            g.append("g")
                .attr("id","cityCircles")
                .selectAll("circle")
                .data(dataCities)
                .enter().append("circle")
                .attr("id","cityCircle") //.attr("id",function(d){return d.id})
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
                .on("mouseover", function(d) {
                        hoverRing(d);      
                    });


            g.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state")
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


            
            /*    
            g.append("g")
                .selectAll("circle")
                .data(citiesData)
                .enter().append("circle")
                .attr("id","largeCity")
                .attr("cx", function (d) { 
                    if(projection([d.long,d.lat])) {
                        return projection([d.long,d.lat])[0];
                    }
                    else
                        return;
                })
                .attr("cy", function (d) {  
                    if(projection([d.long,d.lat]))
                        return projection([d.long,d.lat])[1]; 
                    else
                        return;
                    })
                .attr("r", "2px")
            
            g.append("g")
                .selectAll("text")
                .data(citiesData)
                .enter().append("text")    
                .attr("id","cityName")
                .attr("x", function (d) { 
                    if(projection([d.lon,d.lat])) {
                        return projection([d.lon,d.lat])[0];
                    }
                    else
                        return;
                })
                .attr("y", function (d) {  
                    if(projection([d.lon,d.lat]))
                        return projection([d.lon,d.lat])[1]; 
                    else
                        return;
                    })
                .text(function(d){return d.place})
                .attr("font-size", "10px")
            */
        }
        

        function clickedState(d) {
            if (d3.select('.background').node() === this) return reset();
            if (active.node() === this) return reset();
            
            /*
            *  Update the lineChart(s) with current data infromation
            *  (data from dataset)
            */
            $("#cityCircles").fadeTo( "slow" , 1);
            
            var filteredArray = data.filter( data => data.stateID === d.id ).map( obj => obj );
          
            barChart(filteredArray, StateMeanValues);
            pieChart(filteredArray);
            IncomeGraph(filteredArray);

            //   Set Div infromation      
            var clickedState = returnState(d.id);
            $( "#PaneHolder" ).show( "drop", { direction: "right" }, "fast" );
            $( "#scatterPlot" ).show( "drop", { direction: "down" }, "fast" );
            
            $( "#CountyName" ).hide();
            $( "#StateName" ).html(clickedState);
            $("#flag").attr("src", "./Database/flags/" + clickedState.toLowerCase() + "-small.png");
            
            //Set the clicked state to be active
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            //Set the bounds to be inside the clicked state
            var bounds = path.bounds(d),
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


function MeanStateData(data, input)
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



