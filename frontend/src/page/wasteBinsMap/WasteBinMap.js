import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function WasteBinMap() {
  const [wasteBins, setWasteBins] = useState([]);

  useEffect(() => {
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

  return (
    <>
      <h1>Waste Bin Locations</h1>
      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {wasteBins.map(bin => (
          <Marker
            key={bin._id}
            position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
            icon={bin.image ? binIcon(bin.image) : undefined}
          >
            <Popup>
              <div>
                <strong>{bin.name}</strong>
                {bin.image && <img src={bin.image} alt={bin.name} style={{ width: '100px', height: 'auto' }} />}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default WasteBinMap;
