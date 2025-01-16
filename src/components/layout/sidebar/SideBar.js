import React, { useRef } from 'react';
import { Link, link_nav } from 'react-router-dom'
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { Menu } from 'primereact/menu';
import { SlideMenu } from 'primereact/slidemenu';
import { ToggleButton } from 'primereact/togglebutton';

import { useEffect } from "react";
import { SpeedDial } from 'primereact/speeddial';
import { Avatar } from 'primereact/avatar';
import { ReactComponent as LogoSideBar } from "./logotipo.svg";
import { Dock } from 'primereact/dock';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
//IMPORTANTO RECURSOS DE FRAMEWORKS E BIBLIOTECAS
import { useForm, Controller } from 'react-hook-form';
import { axiosApi } from '../../../services/axios';
import { Divider, Icon } from '@mui/material';

function SideBar() {

  const { signed } = useContext(AuthContext)
  const { signOut } = useContext(AuthContext)

  const { user } = useContext(AuthContext)
  const menu = useRef(null);
  const toast = useRef(null);
  const items = [
    {
      label: 'Sair',
      icon: 'pi pi-power-off',
      command: () => { signOut()},
    }
  ];


  const rightContents = (
    <React.Fragment>
               
                <Menu model={items} popup ref={menu} id="popup_menu" />
                <Button label={user} icon="pi pi-angle-down" iconPos='right' className="p-button-text p-button-plain" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup style={{marginRight:'10px'}} />



    </React.Fragment>
  );
  const leftContents = (
    <React.Fragment>
      <h4 className='w-header-page-title'></h4>
    </React.Fragment>
  );


  if (signed == true) {
    return (
      <>
        <Toolbar className='w-header-page' left={leftContents} right={rightContents} />
      </>
    );
  }
}

export default SideBar