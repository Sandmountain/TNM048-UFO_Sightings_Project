function worldMap(data) {

    // mapid is the id of the div where the map will appear
var map = L
  .map('mapid')
  .setView([10, 15], 1);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/'
        +'tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 6,
    }).addTo(map);

// Add a svg layer to the map
L.svg().addTo(map);

// Select the svg area and add circles:
d3.select("#mapid")
  .select("svg")
  .selectAll("myCircles")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d){     
            return map.latLngToLayerPoint([d.latitude, d.longitude]).x; 
    })
    .attr("cy", function(d){      
            return map.latLngToLayerPoint([d.latitude, d.longitude]).y;              
    })
    .attr("r", 1)
    .style("fill", "red")
    .attr("stroke", "red")
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4)

// Function that update circle position if something change
function update() {
  d3.selectAll("circle")
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y })
}

// If the user change the map (zoom or drag), I update circle position:
map.on("moveend", update)


/*
    d3.json("circles.json", function(collection) {
        /* Add a LatLng object to each item in the dataset */
        /*
        collection.objects.forEach(function(d) {
            d.LatLng = new L.LatLng(d.circle.coordinates[0],
                                    d.circle.coordinates[1])
        })
        
        var feature = g.selectAll("circle")
            .data(collection.objects)
            .enter().append("circle")
            .style("stroke", "black")  
            .style("opacity", .6) 
            .style("fill", "red")
            .attr("r", 20);  
        
        

        
    })           
*/

        //console.log(data);
    /*
    var map = L.map('mapid').setView([42.6525000, -73.7566667], 10);
//42.6525000,-73.7566667
    L.tileLayer('https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/'
        +'tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg', {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);
       
    //Tidsformat 10/10/1949 20:30
    //ar parseTime = d3.timeParse("%m/%d/%Y %H:%M");

    /*  Find the earliest and latest time in the range */
    //var maxDate = 
    //var minDate = d3.min(data, function (d) { return parseTime(d.datetime) });
    //var xScale =  d3.scaleTime().range([0,width]);
/*
    var w = $("#mapid").width();
    var h = $("#mapid").height();     

     
    //var projection = d3.geoMercator()
    //    .scale(w / 2 / Math.PI)
    //    .translate([w / 2, h / 2])

    function latLong(x,y)
    {      
        //console.log(x + ' and ' + y);
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }  

    var svg_map = d3.select(map.getPanes().overlayPane)
            .append("svg")
            .attr("width", w)
            .attr("height", h);
    

    L.circle([42.6525000,-73.7566667], {radius: 100}).addTo(map)
    L.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
    /*           
    svg_map.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            var coords = projection([d.longitude, d.latitude]);
            //console.log(coords[0]);
            return coords[0];
            //var coords = latLong(d.longitude, d.latitude);
            //return coords.x;
            })
        .attr("cy", function(d) {
            var coords = projection([d.longitude, d.latitude]);
            
            return coords[1];
            //var coords = latLong(d.longitude, d.latitude);
            //return coords.y;        
            })
        .attr("r", function(d) {
            return 2;
         })
    */
    


         //  var path = d3.geoPath()
        //.projection(projection);

    //console.log(transform);

   




    /*     
    var transform = d3.geoTransform({point:latLong}),
        d3path = d3.geoPath().projection(transform),  
        g = svg_map.append("g").attr("class", "leaflet-zoom-hide");

    d3_features = g.selectAll("d3path")
            .data(geoShape.features)
            .enter().append("d3path");
    */     
    //map.on("viewreset", reset);
    //reset();

/*


    function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
    }

    function applyLatLngToLayer(d) {
        var x = d.longitude;
        var y = d.latitude;
        //Remove comment when reached task 19
        return map.latLngToLayerPoint(new L.LatLng(y, x));
    }

*/



    //var g = svg_map.append("g").attr("class","leaflet-zoom-hide");

    /**
     * Task 17 - Create a function that projects lat/lng points on the map.
     * Use latLngToLayerPoint, remember which goes where. 
     */
     /*
    function latLong(x,y)
    {      
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

        var transform = d3.geoTransform({point:latLong});
        var d3path = d3.geoPath().projection(transform);

    function applyLatLngToLayer(d) {
        var x = d.longitude;
        var y = d.latitude;
        //Remove comment when reached task 19
        return map.latLngToLayerPoint(new L.LatLng(y, x));
    }



    $("svg").css({position:'absolute'});
   //d3.select("#TimeLine").attr("align","center");
    var xScale = d3.scale.linear()
                     .domain([0, d3.max(data, function (d) { return parseTime(d.datetime) })])
                     //.range([0, w]);

    svg.append("g")
        .call(d3.svg.axis()
                .scale(xScale)
                .orient("bottom"));               


	//Create a timeline
	/*
    var margin = { top: 0, right: 0, bottom: 20, left: 0 },
        margin2 = { top: 150, right: 0, bottom: 10, left: 0 },
        width = $("#TimeLineHolder").width(),
        height = 500 - margin.top - margin.bottom,
        height2 = 200 - margin2.top - margin2.bottom;


	var svg = d3.select("#TimeLine").append("svg")
        .attr("postion", "fixed")
        .attr("width", "99%")
        .attr("height", height + margin.top + margin.bottom);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var context = svg.append("g")
        .attr("class", "TimeLine")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var timeTst = d3.timeParse("%m/%d/%Y %H:%M");
    
	
 	var xScale =  d3.scaleTime().range([0,width]);
    var yScale =  d3.scaleLinear().range([height , 0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var navXScale = d3.scaleTime().range([0,width]);
    var navYScale = d3.scaleLinear().range([height2, 0]);
    var navXAxis = d3.axisBottom(navXScale);

    var brush = d3.brushX().extent([[0, 0], [width, height2]]).on("brush end", brushed);
						 
    var maxDate = d3.max(data, function (d) { return timeTst(d.datetime) });
    var minDate = d3.min(data, function (d) { return timeTst(d.datetime) });
    var maxMag = d3.max(data, function (d) { return d.durationSeconds });
    var minMag = d3.min(data, function (d) { return d.durationSeconds })

    //Calculate todays date.
    maxDate_plus = new Date(maxDate.getTime() + 300 * 144000000)
    */
    /**
     * Task 5 - Set the axes scales, both for focus and context. 
     */
     /*
    xScale.domain([minDate,maxDate_plus]);
    yScale.domain([minMag,maxMag]);

    navXScale.domain(xScale.domain()); 
    navYScale.domain(yScale.domain());

    var dots = context.append("g");
    dots.attr("clip-path", "url(#clip)");
    
    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(navXAxis)
        //here..


    small_points = dots.selectAll("dot")
        //here..
        .data(data)
        .enter().append("circle")
            .attr("class", "dotContext")
        .filter(function (d) { return d.durationSeconds != null })
        .attr("cx", function (d) {
		
            return navXScale(timeTst(d.datetime));
        })
        .attr("cy", function (d) {

            return navYScale(d.durationSeconds);
        });


    points.plot(small_points, 10,10);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(navXAxis)

    context.append("g")
            .attr("class", "brush")
            .call(brush)
            //.call(brush.move, d3.scaleTime(xScale).range())
            //
            .call(brush.move)

//Brush function for filtering through the data.
    function brushed(){
        //Function that updates scatter plot and map each time brush is used
        var s = d3.event.selection || navXScale.range();
        xScale.domain(s.map(navXScale.invert, navXScale));
        focus.selectAll(".dot")
            .filter(function (d) { return d.durationSeconds != null })
            .attr("cx", function (d) {
                return xScale(timeTst(d.datetime));
            })
            .attr("cy", function (d) {
                return yScale(d.durationSeconds);
            })

        focus.select(".axis--x").call(xAxis);

        if (d3.event.type == "end") {
            var curr_view_erth = []
            d3.selectAll(".dot").each(
                function (d, i) {
                    if (timeTst(d.datetime) >= xScale.domain()[0] && 
                        timeTst(d.datetime) <= xScale.domain()[1]) {
                        //curr_view_erth.push(d.id.toString());
                    }
                });
          
            curr_points_view = worldMap.change_map_points(curr_view_erth)
        }
    }
    */


}