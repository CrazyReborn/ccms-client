import { useEffect, useState } from "react"
import { Circle, MapContainer, Popup, TileLayer, useMapEvent } from "react-leaflet"
import Colonies from "./Colonies";
import LoadingSpinner from "./LoadingSpinnner";

function FlyToCircle({ activeSector }: any) {
  const map = useMapEvent('click', () => {
    map.flyTo({lat: activeSector['location'][0], lng: activeSector['location'][1]}, 13);
  })
 
  return null;
}

export default function MapComponent() {
  const [sectors, setSectors] = useState([] as any[])
  const [sectorsLoaded, setSectorsLoaded] = useState(false);
  const [activeSector, setActiveSector] = useState({} as any);

  useEffect(() => {
    document.getElementById('map123map')?.click();
  }, [sectorsLoaded, activeSector]);
  
  return (
    <div className='map-component-container'>
      <div className='map-container'>
        <MapContainer
        id='map123map'
        center={activeSector['name'] === undefined ? [52.3849104, 16.8910757] : activeSector['location']}
        zoom={13}
        scrollWheelZoom={false}
        >
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            {
            sectorsLoaded && 
            activeSector['name'] === undefined ?
            sectors.map((sector, index) => {
              return (
                <Circle key={index + (Math.random() * 10)} center={sector['location']} radius={sector['radius']} >
                  <Popup>Colony {sector['name']}</Popup>
                </Circle>
              )
            })
            :
            activeSector['name'] !== undefined ?
            <Circle center={activeSector['location']} radius={activeSector['radius']} >
              <Popup>Colony {activeSector['name']}</Popup>
            </Circle>
            : null
          }
          <FlyToCircle activeSector={activeSector} />
        </MapContainer>
      </div>
      <div className='colonies-cats-containers'>
        <Colonies
        activeSector={activeSector}
        setActiveSector={setActiveSector}
        setSectorsLoaded={setSectorsLoaded}
        setSectors={setSectors}
        mode='full'/>
      </div>
    </div>
  )
}