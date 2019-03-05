function map(data){

var margin = { top: 2, bottom: 2, left: 2, right:2}, 
    width = parseInt(d3.select('#usMap').style('width')), 
    width = width - margin.left - margin.right, 
    mapRatio = 0.5, 
    height = width * mapRatio, 
    active = d3.select(null),
    activeCounty = false,
    latestCounty = d3.select(null);

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
                .on("click", clickedCounty);

            g.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state")
                .on("click", clickedState);

            g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", path);

        }

        function clickedState(d) {
            if (d3.select('.background').node() === this) return reset();
            if (active.node() === this) return reset();
            
            /*
            *  Update the lineChart(s) with current data infromation
            *  (data from dataset)
            */

            var filteredArray = data.filter( data => data.stateID === d.id ).map( obj => obj );
          

            lineChart(filteredArray); 

            /*
            *   Set Div infromation
            */
            var clickedState = returnState(d.id);
            $( "#PaneHolder" ).show("fast");
            $( "#CountyName" ).hide();
            $( "#StateName" ).html(clickedState);

            //Set the clicked state to be active
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            //Set the bounds to be inside the clicked state
            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];
            
            //Transition to the new bounds
            g.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        function clickedCounty(d){
            
            //checks wether a county has been clicked or not
            if(activeCounty == false){
                latestCounty = d3.select(this);
                latestCounty.style("fill", "red");                                   
            }
            else{
                d3.select(this).style("fill", "red");
                latestCounty.style("fill", "#aaa").on('mouseover', function(d){d3.select(this).style("fill", "orange")}).on('mouseout', function(d){d3.select(this).style("fill", "#aaa")});          
                latestCounty = d3.select(this);
                activeCounty = false;
            }
           
            var countyID = d.id;
            $.ajax({
                dataType: "json",
                url: "./Database/fips.json",
                mimeType: "application/json",
                success: function(counties){
                    var countyName = counties.find(item => item.FIPS === countyID);
                    activeCounty = true; 

                    var filteredArray = data.filter( data => data.county === countyName.Name ).map( obj => obj );
                    console.log(data[0].county);
                    lineChart(filteredArray); 
                    //Setting County Name
                    $( "#CountyName" ).html(countyName.Name).show();                  
                    }
            });
        }

        //Function to reset the position
        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            $( "#PaneHolder" ).hide("fast");

            //transition back to the original position
            g.transition()
                .delay(100)
                .duration(750)
                .style("stroke-width", "1.5px")
                .attr('transform', 'translate('+margin.left+','+margin.top+')');
        }

    function returnState(id){
      var state = {"10":"Delaware","11":"District of Columbia","12":"Florida","13":"Geogia","15":"Hawaii","16":"Idaho","17":"Illinois","18":"Indiana","19":"Iowa","20":"Kansas","21":"Kentucky","22":"Louisiana","23":"Maine","24":"Maryland","25":"Massachusetts","26":"Michigan","27":"Minnesota","28":"Mississippi","29":"Missouri","30":"Montana","31":"Nebraska","32":"Nevada","33":"New Hampshire","34":"New Jersey","35":"New Mexico","36":"New York","37":"North Carolina","38":"North Dakota","39":"Ohio","40":"Oklahoma","41":"Oregon","42":"Pennsylvania","44":"Rhode Island","45":"South Carolina","46":"South Dakota","47":"Tennessee","48":"Texas","49":"Utah","50":"Vermont","51":"Virginia","53":"Washington","54":"West Virginia","55":"Wisconsin","56":"Wyoming","1":"Alabama","2":"Alaska","4":"Arizona","5":"Arkansas","6":"California","8":"Colorado","9":"Connecticut"}
      return state[id];
    }


}