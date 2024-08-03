import React, { useState } from 'react';
import { Plane } from 'types/dist/domain/plane';
import './style.css';

interface PlanesParams {
  planes: Plane[];
}

const Planes: React.FC<PlanesParams> = ({ planes }) => {
  const [newAngle, setNewAngle] = useState('0');
  const [newPlane, setNewPlane] = useState({ id: '', numberId: 0 });

  const takeOff = (planeId: string) => {
    fetch('http://localhost:3000/control/takeOff/' + planeId, {
      method: 'POST',
    });
  };

  const rotate = (planeId: string) => {
    fetch(
      'http://localhost:3000/control/rotate/' + planeId + '?angle=' + newAngle,
      {
        method: 'POST',
      },
    );
  };

  const newPlanePost = () => {
    fetch('http://localhost:3000/admin/createNewPlane', {
      method: 'POST',
      body: JSON.stringify(newPlane),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <>
      {planes.map((plane) => {
        return (
          <div className="container">
            {plane.id} - {plane.stats.state}
            <button onClick={() => takeOff(plane.id)}>Despegar</button>
            <button onClick={() => rotate(plane.id)}>Girar</button>
            <input
              type="text"
              onChange={(event) => setNewAngle(event.target.value)}
            ></input>
          </div>
        );
      })}
      id:
      <input
        type="text"
        onChange={(event) =>
          setNewPlane({ ...newPlane, id: event.target.value })
        }
      ></input>
      numberId:
      <input
        type="text"
        onChange={(event) =>
          setNewPlane({ ...newPlane, numberId: Number(event.target.value) })
        }
      ></input>
      <button onClick={() => newPlanePost()}>Crear Avión</button>
    </>
  );
};

export default Planes;
