/*eslint-disable*/

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hpdmFtbXVuZGhyYSIsImEiOiJjazRvNXMxcXYxMG9pM29ud256bm9tbjNkIn0.GKN5e33-K264tEogrAcp-w';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shivammundhra/ck4o6c3fd6twn1cur8h0sv32q',
  scrollZoom: false
  // center: [-118.113491, 34.111745],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create Marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Place the Marker on the map
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popups for all locations
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //Extends the map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
