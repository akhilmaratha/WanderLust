mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const marker= new mapboxgl.Marker({color:"black"})
.setLngLet(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset:24, popupOffsets, className: 'my-class'})
.setLngLat(e.lngLat)
.setHTML(`<h4>${location.title}</h4><p>Exact Location will be provided after booking</p>`))
.addTo(map)