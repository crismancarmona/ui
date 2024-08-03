import React, { useEffect, useState } from 'react';
import { Plane } from 'types/dist/domain/plane';
import { PlaneState } from 'types/dist/domain/plane-state';

const Radar: React.FC = () => {
  const [planes, setPlanes] = useState<Plane[]>([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      const planesStatusesResponse = await fetch(
        'http://localhost:3000/status',
      );
      setPlanes(await planesStatusesResponse.json());
    };

    const intervalId = setInterval(() => {
      fetchPlanes(); // Fetch data every second
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  const radius = 500; // Radio del radar
  const center = radius;

  const toPolarCoordinates = (x: number, y: number) => {
    const angle = Math.atan2(y, x); // Ángulo en radianes
    const distance = Math.sqrt(x * x + y * y); // Distancia desde el centro
    return {
      angle: angle,
      distance: distance,
    };
  };

  // Convierte las coordenadas de los puntos
  const points = planes
    .filter((plane) => plane.stats.state !== PlaneState.READY)
    .map((plane) => {
      const { angle, distance } = toPolarCoordinates(
        plane.stats.x ?? 0,
        plane.stats.y ?? 0,
      );

      plane.stats.x = center + distance * Math.cos(angle);
      plane.stats.y = center - distance * Math.sin(angle);
      return plane;
    });

  const drawArrow = (cx: number, cy: number, angle: number) => {
    const lineLength = 20; // Longitud de la línea de la flecha
    const headSize = 10; // Tamaño de la cabeza de la flecha

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const angleRad = toRadians(angle); // Convertir el ángulo a radianes

    const x1 = cx + lineLength * Math.cos(angleRad); // Fin de la línea
    const y1 = cy - lineLength * Math.sin(angleRad); // Fin de la línea

    // Puntos de la cabeza de la flecha
    const x2 = cx + headSize * Math.cos(angleRad - Math.PI / 6);
    const y2 = cy - headSize * Math.sin(angleRad - Math.PI / 6);
    const x3 = cx + headSize * Math.cos(angleRad + Math.PI / 6);
    const y3 = cy - headSize * Math.sin(angleRad + Math.PI / 6);

    return (
      <>
        <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="blue" strokeWidth="2" />
        <polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="blue" />
      </>
    );
  };

  return (
    <>
      <div>
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          style={{ border: '1px solid black' }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="black"
            strokeWidth="1"
            fill="none"
          />
          <circle cx={center} cy={center} r={5} fill="red" /> {/* Centro */}
          {points.map((point, index) => (
            <g>
              {drawArrow(
                point.stats.x ?? 0,
                point.stats.y ?? 0,
                point.stats.angle ?? 0,
              )}

              <text
                x={(point.stats.x ?? 0) + 25}
                y={point.stats.y ?? 0}
                fill="black"
                fontSize="12"
                dominantBaseline="middle"
              >
                {point.numberId +
                  ' Alt:' +
                  point.stats.z +
                  'm - Vel:' +
                  point.stats.velocity +
                  'km/h'}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </>
  );
};

export default Radar;
