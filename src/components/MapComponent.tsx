import { useEffect, useState } from "react"
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import Colonies from "./Colonies"
import Map from "./Map";

export default function MapComponent() {
  const [sectors, setSectors] = useState([] as any[])
  const [sectorsLoaded, setSectorsLoaded] = useState(false);

  useEffect(() => {
    console.log(sectorsLoaded)
  }, [sectorsLoaded]);

  return (
    <div className='map-component-container'>
      <div className='map-container'>
        <MapContainer center={[52.3849104, 16.8910757]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {sectorsLoaded &&
            sectors.map((sector, index) => {
              console.log('circle created')
              return (
                <Circle key={index + (Math.random() * 10)} center={sector['location']} radius={sector['radius']} >
                  <Popup>Colony {sector['name']}</Popup>
                </Circle>
              )
            })}
        </MapContainer>
      </div>
      <div className='colonies-cats-containers'>
        <Colonies setSectorsLoaded={setSectorsLoaded} setSectors={setSectors} mode='full'/>
      </div>
    </div>
  )
}