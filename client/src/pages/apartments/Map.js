import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Geocode from 'react-geocode';

/**
 * Map Component - A React component that displays a Google Map with a marker for a given address.
 *
 * @component
 *
 * @example
 * return (
 *   <Map address="1600 Amphitheatre Parkway, Mountain View, CA" />
 * );
 *
 * @param {Object} props - The component props.
 * @param {string} props.address - The address for which to display the map and marker.
 * @returns {JSX.Element} A JSX Element representing the Map component.
 */
const Map = ({address}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDMzE_Jx2f0nzVaqQjBWMXZFuGbIWICs8s",
  });
  
  Geocode.setApiKey("AIzaSyDMzE_Jx2f0nzVaqQjBWMXZFuGbIWICs8s");
  Geocode.setLanguage("fi");
  Geocode.setRegion("fi");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug(false);

  // eslint-disable-next-line
  const [map, setMap ] = useState(null);

  /**
   * Callback function when the map is loaded.
   *
   * @param {Object} map - The Google Map object.
   */
  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, []);
  
  /**
   * Callback function when the map is unmounted.
   *
   * @param {Object} map - The Google Map object.
   */
  const onUnmount = useCallback((map) => {
    setMap(null)
  }, []);

  const [latlng, setLatlng] = useState({lat: 0, lng: 0});

  useEffect(() => {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLatlng({lat: lat, lng: lng});
      },
      (error) => {
        console.error(error);
      }
    );
  }, [address]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        height: "400px",
        width: "100%",
      }}
      center={latlng}
      zoom={9}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={latlng} />
    </GoogleMap>
  ) : <></>
}

export default Map;
