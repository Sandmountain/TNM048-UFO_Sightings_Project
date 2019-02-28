var worldMap, focus_plus_context, points;

d3.csv("./Database/complete.csv", function(data) {
  return {
    datetime: data.datetime,
   	city: data.city,
   	country: data.country,
    state: data.state,
   	shape: data.shape,
   	duration: +data.durationSeconds,
   	comments: data.comments,
   	latitude: +data.latitude,
   	longitude: +data.longitude,
  };	
}).then(function(data){
    //points = new Points();
    
    worldMap = new worldMap(data);
    //focus_plus_context = new focusPlusContext(data);
    
});
