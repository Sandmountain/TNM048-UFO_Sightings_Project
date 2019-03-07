var worldMap, focus_plus_context, points;
//$( "#PaneHolder" ).hide();
$( "#CountyLabel" ).hide();

d3.csv("./Database/real_estate_db.csv", function(data) {
  return {
    city: data.city,
   	latitude: +data.lat,
   	longitude: +data.lng,
   	state: data.state,
    stateID: +data.STATEID,
    countyID: data.county,
   	pop: +data.pop,
   	male_pop: +data.male_pop,
   	female_pop: +data.female_pop,
   	dept: +data.dept,
   	hs_degree: +data.hs_degree,
  	hs_degree_male: +data.hs_degree_male,
  	hs_degree_female: +data.hs_degree_female,
  	rent_mean: +data.rent_mean,
  	hc_mortgage_mean: +data.hc_mortgage_mean,
  	hc_mortgage_stdev: +data.hc_mortgage_stdev,
  	hi_mean: +data.hi_mean,
  	hi_samples: +data.hi_samples,
  	hi_stdev: +data.hi_stdev,
  };	
}).then(function(data){
	usMap = new map(data);
  
}); 
  