import React, { useState, useEffect, useRef } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { useForm } from 'react-hook-form';
import Menu from './Menu';
import '../styles/App.css';

export interface Option {
  name: string;
  value: string;
  property: Record<string, any>;
}

const options: Option[] = [
  {
    name: 'Celcius',
    value: 'C',
    property: [
      'concat',
      ['get', 'city'],
      '\n',
      [
        'to-string',
        ['*', ['/', 5, 9], ['-', ['to-number', ['get', 'temperature']], 32]],
      ],
      ' C',
    ],
  },
  {
    name: 'Farenheit',
    value: 'F',
    property: [
      'concat',
      ['get', 'city'],
      '\n',
      [
        'to-string',
        ['+', 32, ['*', ['/', 9, 5], ['to-number', ['get', 'temperature']]]],
      ],
      ' F',
    ],
  },
];
const defaultLayoutProperty = [
  'concat',
  ['get', 'city'],
  '\n',
  ['get', 'temperature'],
  ' ',
  ['get', 'tempUnit'],
];
const apiUrl = 'http://localhost:5000/upload';

const App = () => {
  const [geodata, setGeodata] = useState<string>('');
  const [latLngZoom, setLatLngZoom] = useState({
    lng: 19.47437,
    lat: 55.641364,
    zoom: 3,
  });
  const [map, setMap] = useState<mapboxgl.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(options[0]);
  const { register, handleSubmit, setValue, reset } = useForm();
  const [filename, setFilename] = useState<string>();
  const [incorrectFormat, setIncorrectFormat] = useState(false);
  const [unit, setUnit] = useState('');

  const onSubmit = handleSubmit(
    async (data: Record<string, any>): Promise<void> => {
      const form = new FormData();
      const { files } = data || {};
      if (files !== undefined) {
        const file = files[0];
        if (file.type !== 'application/json') {
          setIncorrectFormat(true);
        } else {
          setIncorrectFormat(false);
          form.append('file', files[0]);
          form.append('tempUnit', data.tempUnit);
          try {
            const res = await fetch(apiUrl, {
              method: 'POST',
              body: form,
            });
            const json = await res.json();
            setGeodata(json);
            setUnit(data.tempUnit);
            reset();
            setFilename('');
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  );

  const { name, value, property } = active;
  // map initialization.
  useEffect(() => {
    const initMap = new mapboxgl.Map({
      container: mapContainer.current || '',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [latLngZoom.lng, latLngZoom.lat],
      zoom: latLngZoom.zoom,
    });
    initMap.on('load', () => {
      initMap.addSource('cities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      initMap.addLayer({
        id: 'cities',
        type: 'symbol',
        source: 'cities',
        layout: {
          'icon-image': ['concat', ['get', 'icon'], '-15'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
          'text-size': 14,
        },
        paint: {
          'text-color': '#745139',
        },
      });
      initMap.setLayoutProperty('cities', 'text-field', defaultLayoutProperty);

      setMap(initMap);
    });
  }, [latLngZoom]);

  // render map when geodata is returned
  useEffect(() => {
    if (Object.keys(geodata).length !== 0) {
      if (map !== undefined) {
        (map.getSource('cities') as GeoJSONSource).setData(geodata);
      }
    }
  }, [geodata]);

  // render map when switching temperature unit
  useEffect(() => {
    if (!map) {
      return;
    }
    if (map !== undefined) {
      // if toggle temperature unit value is different from the set unit
      if (value !== unit) {
        map.setLayoutProperty('cities', 'text-field', property);
      } else {
        map.setLayoutProperty('cities', 'text-field', defaultLayoutProperty);
      }
    }
  }, [map, property, value, unit]);

  return (
    <div className="App">
      <div className="columns">
        <div className="column">
          <Menu
            onSubmit={onSubmit}
            register={register}
            setValue={setValue}
            filename={filename}
            setFilename={setFilename}
            incorrectFormat={incorrectFormat}
            setIncorrectFormat={setIncorrectFormat}
            options={options}
            value={value}
            setActive={setActive}
          />
        </div>
        <div className="column is-three-quarters">
          <div ref={mapContainer} className="mapContainer" />
        </div>
      </div>
    </div>
  );
};

export default App;
