import React, { Component } from 'react';

import MapStore from '../stores/MapStore';

const MeteoriteGroup = (props) => {

const meteorites = props.meteorites;
var count = 0;

 const meteoritesList = meteorites.map(m => {
   if (!m.mass) return <li key={m.id}>{m.id}: <strong>NO MASS</strong></li>;
     return <li key={m.id}>{m.id}: {m.mass}</li>;
 });

count = meteoritesList.length;

  return(
    <div>
      <p>count: {count}</p>
      <ul>
        {meteoritesList}
      </ul>
    </div>
  );
}

export default MeteoriteGroup;
