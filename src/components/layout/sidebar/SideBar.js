import React from 'react';
import { Link, link_nav } from 'react-router-dom'
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { clienteNome } = useContext(AuthContext)
  const { periodo } = useContext(AuthContext)
  const { caixa } = useContext(AuthContext)
  const { updatePerido } = useContext(AuthContext)
  const { updateCaixa } = useContext(AuthContext)
  const { signed } = useContext(AuthContext)
  const { signOut } = useContext(AuthContext)
  const { register, handleSubmit, reset, setValue/*, formStates:{erros}*/ } = useForm();
  // Selecting the sidebar and buttons
  const sidebar = document.querySelector(".sidebar");
  const sidebarOpenBtn = document.querySelector("#sidebar-open");
  const sidebarclose_navBtn = document.querySelector("#sidebar-close_nav");
  const sidebarLockBtn = document.querySelector("#lock-icon");

  // Function to toggle the lock state of the sidebar
  const toggleLock = () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarLockBtn = document.querySelector("#lock-icon");
    const bodypd = document.getElementById('body-pd')
    sidebar.classList.toggle("locked");
    // If the sidebar is not locked
    if (!sidebar.classList.contains("locked")) {
      sidebar.classList.add("hoverable");
      sidebarLockBtn.classList.replace("pi-lock-alt", "pi-lock-open-alt");
      bodypd.classList.remove('expander')
    } else {
      sidebar.classList.remove("hoverable");
      sidebarLockBtn.classList.replace("pi-lock-open-alt", "pi-lock-alt");
      bodypd.classList.add('expander')
    }
  };

  // Function to show the sidebar when the mouse enter
  const showSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.classList.contains("hoverable")) {
      sidebar.classList.remove("close_nav");
    }
  };
  // Function to hide the sidebar when the mouse leaves
  const hideSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.classList.contains("hoverable")) {
      sidebar.classList.add("close_nav");
    }

  };

  const items = [
    {
      label: 'Configurar',
      icon: 'pi pi-cog',
    },
    {
      label: 'Sair',
      icon: 'pi pi-power-off',
    },
  ]



  const atualizarPeriodo = (value) => {
    setDataPeriodo(value)
    updatePerido(value)

  }
  const [dataPeriodo, setDataPeriodo] = useState(periodo);


  const [visibleRight, setVisibleRight] = useState(false);
  const [checkedCaixa, setCheckedCaixa] = useState(true);
  //const [caixaAtual, setCaixaAtual] = useState('');
  const [resumoDespesasExtras, setResumoDespesasExtras] = useState([]);
  const [resumoOrdensPagamentos, setResumoOrdensPagamentos] = useState([]);
  const [resumoEntradas, setResumoEntradas] = useState([]);
  const [resumoDespesasExtrasConta, setResumoDespesasExtrasConta] = useState([]);
  const [resumoOrdensPagamentosConta, setResumoOrdensPagamentosConta] = useState([]);
  const [resumoEntradasConta, setResumoEntradasConta] = useState([]);

  useEffect(() => {
    //setCheckedCaixa(caixa)

  });

  const showCaixa = () => {
let teste=''
    axiosApi.get("/controle_caixas")
      .then((response) => {
        console.log(response.data)
        if (response.data.status=='true') {
          console.log('response data é true,agora será false')
          setCheckedCaixa(false)
          teste=false
          setValue('valor_inicial_caixa', response.data.valor_inicial_caixa)
          setValue('valor_inicial_conta', response.data.valor_inicial_conta)
        } else {
          console.log('response data é false ,agora será true')
         teste=true
          setCheckedCaixa(true)
          setValue('valor_inicial_caixa', response.data.valor_final_caixa)
          setValue('valor_inicial_conta', response.data.valor_final_conta)
        }
       
      })
      .catch(function (error) {
        console.log(error)
      });
    if (teste) {
      //se o caixa estiver fechado preencho os valores iniciais com o fechamento anterior
      console.log('buscar fechamento de ontem, mas nada mais precisa')

    } else {
      console.log('buscar historico movimentacao')
      axiosApi.get("/controle_caixas/resumos")
        .then((response) => {
          setValue('controle_caixa_id', response.data.caixaInicio.id)
          setResumoOrdensPagamentos(response.data.resumoOrdensPagamentos)
          const somaPagamentosCaixa = response.data.resumoOrdensPagamentos.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_a_pagar);
          }, 0);
          setResumoDespesasExtras(response.data.resumoDespesasExtras)
          const somaDespesasExtrasCaixa = response.data.resumoDespesasExtras.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_pago);
          }, 0);
          setResumoEntradas(response.data.resumoEntradas)
          const somaEntradasCaixa = response.data.resumoEntradas.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_recebido);
          }, 0);
          setResumoOrdensPagamentosConta(response.data.resumoOrdensPagamentosConta)
          const somaPagamentosConta = response.data.resumoOrdensPagamentosConta.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_a_pagar);
          }, 0);
          setResumoDespesasExtrasConta(response.data.resumoDespesasExtrasConta)
          const somaDespesasExtrasConta = response.data.resumoDespesasExtrasConta.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_pago);
          }, 0);
          setResumoEntradasConta(response.data.resumoEntradasConta)
          const somaEntradasConta = response.data.resumoEntradasConta.reduce(function (acumulador, valorAtual,) {
            return acumulador + parseFloat(valorAtual.valor_recebido);
          }, 0);
          setValue('valor_inicial_caixa', response.data.caixaInicio.valor_inicial_caixa)
          setValue('valor_inicial_conta', response.data.caixaInicio.valor_inicial_conta)
          setValue('valor_final_caixa', (parseFloat(response.data.caixaInicio.valor_inicial_caixa) + somaEntradasCaixa - somaDespesasExtrasCaixa - somaPagamentosCaixa).toFixed(2))
          setValue('valor_final_conta', (parseFloat(response.data.caixaInicio.valor_inicial_conta) + somaEntradasConta - somaDespesasExtrasConta - somaPagamentosConta).toFixed(2))
        })
        .catch(function (error) {
        });
    }
    setVisibleRight(true)
  }
  /*
    const atualizarCaixa = (value) => {
      if (value == true) {
  
        console.log('inical visivel')
        setAlter(false)
      } else {
        console.log(caixaAtual)
  
      }
      setValue('status_caixa', value)
      setDisplayResponsive(true)
  
    }
      */
  const onSubmit = (formContent) => {
    formContent.status_caixa = checkedCaixa
    if (checkedCaixa) {
      axiosApi.post("/controle_caixas", formContent)
        .then((response) => {
          setCheckedCaixa(false)
          updateCaixa(false)
          reset()
          setVisibleRight(false)
        })
        .catch(function (error) {
        });
    } else {
      //fechar
      axiosApi.patch("/controle_caixas", formContent)
        .then((response) => {
          console.log(response.data)
          setCheckedCaixa(true)
          updateCaixa(true)
          setVisibleRight(false)
          reset()
          
        })
        .catch(function (error) {
        });

    }
  }



  const rightContents = (
    <React.Fragment>
     
    </React.Fragment>
  );
  const leftContents = (
    <React.Fragment>
      <h4 className='w-header-page-title'>{clienteNome} </h4>
    </React.Fragment>
  );
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const onHide = () => {
    setDisplayResponsive(false)
  }

  const Entradas = (
    <React.Fragment>
      <Card>
        <table>
          {resumoEntradas.map((registro, key) => {
            return (
              <tr key={key}>
                <td>{'=>'}</td>
                <td>{registro.valor_recebido}</td>
              </tr>
            )
          })}
        </table>
      </Card>
    </React.Fragment>
  )
  const SaidasDespesasExtras = (
    <React.Fragment>
      <Card>
        <table>
          {resumoDespesasExtras.map((registro, key) => {
            return (
              <tr key={key}>
                <td>{'=>'}</td>
                <td>{registro.valor_pago}</td>
              </tr>
            )
          })}
        </table>
      </Card>
    </React.Fragment>
  )
  const SaidasOrdensPagamentos = (
    <React.Fragment>
      <Card>
        <table>
          {resumoOrdensPagamentos.map((registro, key) => {
            return (
              <tr key={key}>
                <td>{'=>'}</td>
                <td>{registro.valor_pago}</td>
              </tr>
            )
          })}
        </table>
      </Card>
    </React.Fragment>
  )

  if (signed == true) {
    return (
      <>
        <Toolbar className='w-header-page' left={leftContents} right={rightContents} />
      </>
    );
  }
}

export default SideBar