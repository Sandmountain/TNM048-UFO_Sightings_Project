awesomeParse = d3.csv("./Database/scrubbed.csv", function(data) {
  return {
    datatime: data.Datetime, // convert "Year" column to Date
   	city: data.city,
   	country: data.country,
   	shape: data.shape,
   	duration: +data.durationSeconds,
   	comments: data.comments,
   	latitude: +data.latitude,
   	longitude: +data.longitude,
  };	
}).then(function(data){
    console.log(data);
});
