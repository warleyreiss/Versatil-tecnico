//IMPORTANTO HOOKS E DEMAIS RECURSOS DO REACT
import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';



//IMPORTANDO COMPONENTES PERSONALIZADOS
import Content from './content';
import Signin from './signin';
const Index = () => {

  const { signed } = useContext(AuthContext)

  const { onVisit } = useContext(AuthContext);

  if (signed) {
    return (
      <Content visita={onVisit}/>
    )
  } else {

    return (
      <Signin />
    );
  }


}

export default Index