import Planes from '@/components/plane/plane';
import Radar from '@/components/radar/radar';
import { Plane } from '@crisman999/plane-types';
import React, { useEffect, useState } from 'react';
import './style.css';

const RadarPage: React.FC = () => {
  const [planes, setPlanes] = useState<Plane[]>([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const planesStatusesResponse = await fetch(
          'http://localhost:3000/status',
        );
        setPlanes(await planesStatusesResponse.json());
      } catch (error) {
        console.error(error);
        setPlanes([]);
      }
    };

    const intervalId = setInterval(() => {
      fetchPlanes(); // Fetch data every second
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  return (
    <div className="container">
      <div className="column">
        <Radar planes={planes}></Radar>
      </div>
      <div className="column">
        <Planes planes={planes}></Planes>
      </div>
    </div>
  );
};

export default RadarPage;
