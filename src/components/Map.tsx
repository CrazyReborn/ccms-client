import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

export default function Map() {
  return (
      <div className='map-container'>
        <MapContainer center={[52.3849104, 16.8910757]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[52.3849104, 16.8910757]}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
  )
}