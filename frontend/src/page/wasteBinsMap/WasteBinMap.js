import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

function LocationMarker({ setUserLocation, setNearestBin }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setUserLocation([lat, lng]);

      axios.get(`http://localhost:5000/api/bins/nearest?latitude=${lat}&longitude=${lng}`)
        .then(response => {
          setNearestBin(response.data); 
        })
        .catch(error => {
          console.error('Error fetching nearest waste bin:', error);
        });
    },
  });

  return null; 
}

function WasteBinMap() {
  const [wasteBins, setWasteBins] = useState([]);
  const [nearestBin, setNearestBin] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
   // Function to handle search
   const handleSearch = async () => {
    const provider = new OpenStreetMapProvider();

    const results = await provider.search({ query: searchTerm });
    if (results && results.length > 0) {
      const { x, y } = results[0]; 
      const newLocation = [y, x];

      setUserLocation(newLocation);

      axios.get(`http://localhost:5000/api/bins/nearest?latitude=${y}&longitude=${x}`)
        .then(response => {
          setNearestBin(response.data); 
        })
        .catch(error => {
          console.error('Error fetching nearest waste bin:', error);
        });
    } else {
      console.error('No results found for this search term');
    }
  };

  useEffect(() => {
    // Attempt to fetch all waste bins
    axios.get('http://localhost:5000/api/bins')
      .then(response => {
        setWasteBins(response.data);
      })
      .catch(error => {
        console.error('Error fetching waste bin data:', error);
      });
  }, []);

  const binIcon = (imageUrl) => {
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [35, 35], 
      iconAnchor: [17, 35], 
      popupAnchor: [0, -35] 
    });
  };

  const userIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Twitter_default_profile_400x400.png/640px-Twitter_default_profile_400x400.png', // URL to a user location icon image
    iconSize: [50, 50], 
  iconAnchor: [25, 50], 
  popupAnchor: [0, -50]
  });

  return (
    <>
      <h1>Waste Bin Locations</h1>
         {/* Search input */}
         <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a location"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setUserLocation={setUserLocation} setNearestBin={setNearestBin} />
        {wasteBins.map(bin => (
          <Marker
            key={bin._id}
            position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
            icon={binIcon(bin.image)}
          >
            <Popup>
              <strong>{bin.name}</strong>
              {bin.image && <img src={bin.image} alt="" style={{ width: '100px', height: 'auto' }} />}
              <strong>{bin.type}</strong>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {nearestBin && userLocation && (
          <Polyline
            positions={[
              userLocation,
              [nearestBin.location.coordinates[1], nearestBin.location.coordinates[0]]
            ]}
            color="red"
          />
        )}
      </MapContainer>
    </>
  );
}

export default WasteBinMap;
