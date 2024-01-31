import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function LocationMarker({ setUserLocation, setNearestBin }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setUserLocation([lat, lng]);

      // Fetch the nearest waste bin given the new user's location
      axios.get(`http://localhost:5000/api/bins/nearest?latitude=${lat}&longitude=${lng}`)
        .then(response => {
          setNearestBin(response.data); // Set the nearest bin
        })
        .catch(error => {
          console.error('Error fetching nearest waste bin:', error);
        });
    },
  });

  return null; // This component does not render anything itself, but it does trigger side effects
}

function WasteBinMap() {
  const [wasteBins, setWasteBins] = useState([]);
  const [nearestBin, setNearestBin] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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
      iconSize: [35, 35], // Size of the icon
      iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -35] // Point from which the popup should open relative to the iconAnchor
    });
  };

  const userIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Twitter_default_profile_400x400.png/640px-Twitter_default_profile_400x400.png', // URL to a user location icon image
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });

  return (
    <>
      <h1>Waste Bin Locations</h1>
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
