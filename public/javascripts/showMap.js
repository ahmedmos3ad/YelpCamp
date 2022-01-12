mapboxgl.accessToken = mapToken;

//since I stringified my data with JSON I have to parse it, otherwise it will give undefined for some reason
const parsedCamp = JSON.parse(camp)

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parsedCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(parsedCamp.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${parsedCamp.title}</h3><p>${parsedCamp.location}</p>`)
    )
    .addTo(map);