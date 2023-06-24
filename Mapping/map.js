// map object
const myMap =  {
    coordinates: [],
    businesses: [],
    map: {},
    markers: [],
    // build map
    buildMap(){
        this.map = L.map('map',{
            center: this.coordinates,
            zoom: 11,
        });
    // add tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // create location marker
    const marker = L.marker(this.coordinates)
    marker
    .addTo(this.map)
    .bindPopup('<p1>You are here</p1>')
    .openPopup()
    },

    // business Markers
    businessMarkers(){
        for(var i=0; i < this.businesses.length; i++){
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }
    }
}



// get coordinates via geolocation
async function getCoordinates(){
    const location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return[location.coords.latitude, location.coords.longitude]
}
// get foursquare businesses
async function getBusiness(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization:  'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8=',
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}
// proccess foursquare array
function proccessBusinesses(data){
    let businesses = data.map((element) => {
        let loc = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude,
        };
        return loc
    })
    return businesses
}

//event handlers
//window load
window.onload = async () => {
   coords =  await getCoordinates()
   myMap.coordinates = coords
   myMap.buildMap()
}
// business submit button
document.getElementById('submit-business').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business-select').value
    let data = await getBusiness(business)
    myMap.businesses = proccessBusinesses(data)
    myMap.businessMarkers()
})