function worldMap(data) {

    var map = L.map('mapid').setView([10, 15], 2.2);

    L.tileLayer('https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

    var timeTst = d3.timeParse("%m/%d/%Y %H:%M");
    console.log((timeTst(data[0].datetime)));
    

}