import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const LocationPicker = ({ setLatLng, initialLocation }) => {
    const defaultPosition = [30.0444, 31.2357];
    const [position, setPosition] = useState(
        initialLocation
            ? [initialLocation.latitude, initialLocation.longitude]
            : null
    );

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                setLatLng({ latitude: lat, longitude: lng });
            },
        });
        return position ? <Marker position={position} /> : null;
    };

    return (
        <MapContainer
            center={position || defaultPosition}
            scrollWheelZoom={false}
            zoom={position ? 13 : 6}
            style={{ height: 300, width: "100%" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {position && <Marker position={position} />}
        </MapContainer>
    );
};

export default LocationPicker;
