//IMPORTANTO HOOKS E DEMAIS RECURSOS DO REACT
import React, { useState, useEffect, useRef } from 'react';

//IMPORTANTO COMPONENTES DE BIBLIOTECAS DE INTERFACES
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Sidebar } from 'primereact/sidebar';
import { ToggleButton } from 'primereact/togglebutton';
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { mask } from 'primereact/utils';
import Select from 'react-select'
import { InputNumber } from 'primereact/inputnumber';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import 'primeicons/primeicons.css';

//IMPORTANTO RECURSOS DE FRAMEWORKS E BIBLIOTECAS
import { axiosApi } from '../../../services/axios';
import { Link } from 'react-router-dom';


//IMPORTANDO COMPONENTES PERSONALIZADOS
import ServicosCru from './form-cru';
import DataviewConteudo from './dataview-conteudo';
const Content = () => {

  //const { visit } = useContext(AuthContext);
  let visit = JSON.parse(localStorage.getItem("@Auth:visit"))
  const { onVisit } = useContext(AuthContext);
  const { endVisit } = useContext(AuthContext);

  const { occurrence } = useContext(AuthContext);
  const { onOccurrence } = useContext(AuthContext);
  const { endOccurrence } = useContext(AuthContext);

  //STATES E INSTANCIAS DA PAGINA -----------------------------------------------------------------------------|
  const [visibleMenuRight, setVisibleMenuRight] = useState(false);
  const nomePagina = 'Serviços em Aberto'
  const [registros, setRegistros] = useState([]);
  const [registrosSemFiltros, setRegistrosSemFiltros] = useState([]);
  const [layout, setLayout] = useState(visit);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const rows = useRef(10);
  const datasource = useRef(null);
  const isMounted = useRef(false);
  const toast = useRef(null);
  //------------------------------------------------------------------------------------------------------------|


  //CHAMADA DE REQUISIÇÃO E CARREGAMENTO DAS FUNCOES DO DATAVIEW DO FRAMEWORK ----------------------------------|
  useEffect(() => {
    if (isMounted.current) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const requisicao = () => {
    setRegistrosSemFiltros(emptyregistro)
    datasource.current = []
    setTotalRecords(0)
    setRegistros([])
    if (JSON.parse(localStorage.getItem("@Auth:visit"))) {
      visit = JSON.parse(localStorage.getItem("@Auth:visit"))
      let visitId = visit.servico_id
      axiosApi.get("/list_service/" + visit.servico_id)
        // axiosApi.get("/list_service/" + 10013)
        .then((response) => {
          setRegistrosSemFiltros(response.data)
          datasource.current = response.data
          setTotalRecords(response.data.length)
          setRegistros(datasource.current.slice(0, rows.current))
        })
        .catch(function (error) {
        });
    } else {
     
      axiosApi.get("/list_service")
        .then((response) => {
          setRegistrosSemFiltros(response.data)
          datasource.current = response.data
          setTotalRecords(response.data.length)
          setRegistros(datasource.current.slice(0, rows.current))
        })
        .catch(function (error) {
        });
    }
    setLoading(false)
  }
  useEffect(() => {
    setTimeout(() => {
      isMounted.current = true;
      requisicao()
      setLoading(false)
    }, 3000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onPage = (event) => {
    setLoading(true);

    //imitate delay of a backend call
    setTimeout(() => {
      const startIndex = event.first;
      const endIndex = Math.min(event.first + rows.current, totalRecords - 1);
      const newregistros = startIndex === endIndex ? datasource.current.slice(startIndex) : datasource.current.slice(startIndex, endIndex);
      setFirst(startIndex);
      setRegistros(newregistros);
      setLoading(false);
    }, 1000);
  }
  //------------------------------------------------------------------------------------------------------------|



  //LAYOUT DA PAGINA -------------------------------------------------------------------------------------------|

  //cabecalho
  const op = useRef(null);
  const leftContents = (
    <span>{nomePagina}</span>
  );

  const rightContents = (
    <React.Fragment>
      <div hidden={!visit}>
        <Button label={'Visita aberta'} onClick={() => setVisibleVisita(true)} className='p-button-success p-button-outlined' />
      </div>
      {/*  <Button icon="pi pi-th-large" onClick={() => setVisibleMenuRight(true)} className=' p-button-primary' style={{ marginLeft: '10px' }} />*/}
    </React.Fragment>
  );

  const header = (
    <div className="table-header" >
      <Toolbar left={leftContents} right={rightContents} />
    </div>
  );

  //------------------------------------------------------------------------------------------------------------|

  //LAYOUT DOS DATAVIEW/CARDS ----------------------------------------------------------------------------------|

  //cabeçalho dataview
  const headerCard = (data) => {
    return (
      <div>
        <span className='p-card-title card-dataview-header-title'>{data.nome}</span>
        <span className='p-card-subtitle card-dataview-header-subtitle'>{new Date(data.inicio).toLocaleDateString("pt-br") + " - " + new Date(data.termino).toLocaleDateString("pt-br")}</span>
      </div>
    )
  }

  //conteúdo dataview sem visita expecifica
  const renderListItens = (data) => {
    return (
      <Card className='relative card-dataview' title={headerCard(data)} style={{ width: '100em', height: 'auto' }} >
        <div className="absolute top-0 right-0 flex align-items-center justify-content-center card-dataview-content ">
          <div className="text-right card-dataview-buttons" >
          </div>
        </div>
        <Panel className='flex flex-column-reverse card-dataview-body-panel-os' toggleable collapsed style={{ border: 'none' }}>
          <DataviewConteudo data={data} className='card-dataview-body-panel-os-content' style={{ border: 'none' }} />
        </Panel>
        <div className="text-left card-dataview-body-obs">
          {data.observacoes ? data.observacoes : "Sem orientações"}
        </div>
        <div className="text-center card-dataview-footer-opcoes">
          <div className="flex justify-content-end flex-wrap">
            <div className="flex align-items-center justify-content-center">
              <span className="p-buttonset">
                <Button label="Abrir visita" className='p-button-success card-dataview-footer-opcoes-btn' icon="pi pi-check" onClick={(e) => { abrirVisita(data.id) }} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  //conteúdo dataview com visita
  const renderListItem = (data) => {
    return (
      <Card className='relative card-dataview' title={headerCard(data)} style={{ width: '100em', height: 'auto' }} >
        <div className="absolute top-0 right-0 flex align-items-center justify-content-center card-dataview-content ">
          <div className="text-right card-dataview-buttons" >
          </div>
        </div>
        <DataviewConteudo data={data} className='card-dataview-body-panel-os-content' style={{ border: 'none' }} />

        <div className="text-left card-dataview-body-obs">
          {data.observacoes ? data.observacoes : "Sem orientações"}
        </div>
        <div className="text-center card-dataview-footer-opcoes">
          <div className="flex justify-content-end flex-wrap">
            <div className="flex align-items-center justify-content-center">
              <span className="p-buttonset">
                {/*  <Button label="Abrir ociosidade" className='p-button-danger  card-dataview-footer-opcoes-btn' icon="pi pi-check" onClick={(e) => { confirmOccurrence(data.id) }} hidden={occurrence} />*/}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  //template do dataview
  const itemTemplate = (product) => {
    if (!product) {
      return;
    }
    if (!visit) {
      return renderListItens(product);
    }
    if (visit) {
      return renderListItem(product);
    }
  }

  //FORMULARIO CRUD ----------------------------------------------------------------------------------------------|
  //OBS: FORMULARIO É IMPORTADO COMO COMPONENTE PERSONALIZADO

  //states
  let emptyregistro = {
    id: null
  };
  const [registro, setRegistro] = useState(emptyregistro);
  const [id, setId] = useState(false);
  const [visibleCRUD, setVisibleCRUD] = useState(false);

  //função para novo adastro
  const openNew = () => {
    setRegistro(emptyregistro);
    setVisibleCRUD(true)
  }
  //função para cancelar um novo cadastro ou edição
  const closedNew = () => {
    setVisibleCRUD(false)
    setVisibleMenuRight(false)
  }
  //função para editar dados de um cadastro existente
  const editeRegistro = (registro) => {
    let _registro = { ...registro };
    _registro.inicio = new Date(_registro.inicio)
    _registro.termino = new Date(_registro.termino)
    setRegistro(_registro)
    setVisibleCRUD(true)
  }
  //função que recebe os dados de um novo cadastro
  const recebidoDoFilhoPost = (registro) => {
    let _registros = [...registros];
    let _registro = { ...registro };
    _registro.id = registro.id
    _registros.push(_registro);
    setRegistro(emptyregistro);
    setVisibleCRUD(false)
    setVisibleMenuRight(false)
  }
  //função que recebi os dados de um cadastro editado
  const recebidoDoFilhoPatch = (registro) => {
    let _registros = [...registros];
    let _registro = { ...registro };
    const index = findIndexById(registro.id);
    _registros[index] = _registro;
    setRegistros(_registros);
    setRegistro(emptyregistro);
    setVisibleCRUD(false)
    setVisibleMenuRight(false)
  }

  //função para retonar qual o indice do registro da tabela para alteracao
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < registros.length; i++) {
      if (registros[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  //--------------------------------------------------------------------------------------------------------------|

  //MENSAGENS AO USUARIO------------------------------------------------------------------------------------------|
  const toastBR = useRef(null);
  const showSuccess = (detail) => {
    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário' + detail + ' cadastrada', life: 3000 });
  }
  //--------------------------------------------------------------------------------------------------------------|


  //FORMULARIO VISITAS ----------------------------------------------------------------------------------------------|

  //states
  let emptyregistroVisit = {
    id: null
  };
  const [registroVisit, setRegistroVisit] = useState(visit ?? emptyregistroVisit);
  const [visibleVisita, setVisibleVisita] = useState(false);
  //array de opções dos inputs selects
  const opcoesVisitas = [
    { label: 'SIM', value: 'SIM' },
    { label: 'NÃO', value: 'NAO' }
  ];
  //funções de preenchimento do formulario
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _registroVisit = { ...registroVisit };
    _registroVisit[`${name}`] = val;

    setRegistroVisit(_registroVisit);
  }


  const abrirVisita = (servico) => {
    const id = { servico };
    axiosApi.post('/open_visite', id)
      .then(function (response) {
        onVisit(response.data)
        visit = JSON.parse(localStorage.getItem("@Auth:visit"))
        // setLayout(visit !== 'string')
        requisicao()
      })
      .catch(function (error) {
      });
  }


  const fecharVisita = async () => {
    let _validacao = []
    if (registroVisit.alimentacao == null) { _validacao.push({ severity: 'info', summary: 'Pendente', detail: 'informe se foi necessário alimentação', life: 3000 }) }
    if (registroVisit.hospedagem == null) { _validacao.push({ severity: 'info', summary: 'Pendente', detail: 'informe se foi necessário hospedagem', life: 3000 }) }
    //validar materiais conforme tipo de os
    if (_validacao.length == 0) {
      endVisit(registroVisit)
        .then((response) => {
          //  setLayout(false)
          visit = false
          setVisibleVisita(false)
          requisicao()
          setRegistroVisit(emptyregistroVisit)
          //toastBR("visita finalizada, até a próxima :)")
        })
        .catch(function (error) {
        });
    } else {
      toast.current.show(_validacao);
    }


  }

  //--------------------------------------------------------------------------------------------------------------|


  //FORMULARIO OCIOSIDADE----------------------------------------------------------------------------------------------|
  /*
    //states
    let emptyregistroOccurrence = {
      id: null
    };
  
    const [registroOccurrence, setRegistroOccurrence] = useState(emptyregistroVisit);
    const [occurrenceDialog, setOccurrenceDialog] = useState('');
    function refresOccurrenceDialog(){
      if(localStorage.getItem("@Auth:occurrence")==Object){
        setOccurrenceDialog(true)
      }else{
        setOccurrenceDialog(false)
      }
    }
    // funcao para mostrar alerta de confimação pelo usuario
    const confirmOccurrence = (registro) => {
      setRegistroOccurrence(emptyregistroOccurrence);
      endOccurrence() ///remover isto daqui 
      setOccurrenceDialog(true);
    }
    //funcao ocultar/cancelar alerta de confirmação pelo usuario
    const openOccurrence = async () => {
      try {
        const response = await axiosApi.post('/open_occurrence', registroOccurrence);
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("@Auth:occurrence", JSON.stringify(response.data));
          refresOccurrenceDialog()
        }
      } catch (error) {
      }
    }
  
    //funcao ocultar/cancelar alerta de confirmação pelo usuario
    const closeOccurrence = async () => {
      try {
        const response = await axiosApi.patch("closed_occurrence");
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("@Auth:occurrence", undefined);
        }
      } catch (error) {
        
      }
      refresOccurrenceDialog()
      //registroOccurrence(emptyregistro)
    }
  
    //função para popular state registro com o motivo do cancelamento do serviço
    const onInputChangeDelete = (e, name) => {
      const val = (e.target && e.target.value) || '';
      let _registro = { ...registroOccurrence };
      _registro[`${name}`] = val;
      setRegistroOccurrence(_registro);
    }
  
    function OccurrenceDialogBody() {
      if (occurrenceDialog) {
        return (
          <div className="confirmation-content">
            <i className="pi pi-stopwatch mr-3" style={{ fontSize: '2rem' }} />
            <h3>{'Ocorrência em aberta no momento por ' + occurrence.motivo ?? '..'}</h3>
            <div className="card w-card" style={{ margin: '0px', padding: "0px" }} >
            </div>
          </div>
        );
      } else {
        return (
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <h3>Descreva o motivo pelo qual você deseja registrar uma ocorrênca</h3>
            <div className="card w-card" style={{ margin: '0px', padding: "0px" }} >
              <div className="p-fluid w-form" style={{ margin: '0px', padding: "0px" }}>
                <div className="p-fluid grid">
                  <div className="field w-field col-12 md:col-12">
                    <div className="p-inputgroup w-inputgroup-select" style={{ marginTop: '0px' }}>
                      <span className="p-inputgroup-addon">
                        <i className="pi pi-tag"></i>
                      </span>
                      <InputTextarea value={registroOccurrence.motivo ??''} onChange={(e) => onInputChangeDelete(e, 'motivo')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  
    const occurrenceDialogFooter = () => {
      const teste = occurrence
      if (teste) {
        return (
          <React.Fragment>
            <Button label="Finalizar ocorrência" icon="pi pi-check" className="p-button-outlined p-button-success" onClick={closeOccurrence} />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-danger" onClick={(e) => { setOccurrenceDialog(false) }} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-outlined p-button-success" onClick={openOccurrence} />
          </React.Fragment>
        );
      }
    }
      */

  //--------------------------------------------------------------------------------------------------------------|

  return (
    <>
     <Toast ref={toast} position="bottom-right" />
      <Toast ref={toastBR} position="bottom-right" />
      <div className="dataview">
        <div className="card dataview-card" style={{ backgroundColor: 'withe' }}>
          <DataView value={registros} layout={layout} header={header}
            itemTemplate={itemTemplate} lazy paginator rows={rows.current}
            totalRecords={totalRecords} first={first} onPage={onPage} loading={loading} />
        </div>
      </div>
      <Sidebar className='w-sidebar-right w-sidebar-right-menu ' header={<h3>O que gostaria de fazer?</h3>} visible={visibleMenuRight} position="right" blockScroll onHide={() => setVisibleMenuRight(false)} style={{ width: '550px' }}>
        <div className="card w-card" >
          <Divider align="right" type="dashed">
            <b>Tarefas rápidas</b>
          </Divider>
          <div className="grid p-card-grid">
            <div className="col-fixed p-card-grid-col">
              <Link className='p-card-grid-col-link' onClick={() => openNew(true)} >
                <div className="grid nested-grid p-card-grid-col-link-grid">
                  <div className="grid p-card-grid-col-link-grid-grid">
                    <div className="col-10 p-card-grid-col-link-grid-grid-title">
                      Novo Serviço
                    </div>
                    <div className="col-2 p-card-grid-col-link-grid-grid-icon">
                      <i className="pi pi-plus"></i>
                    </div>
                    <div className="col-12 p-card-grid-col-link-grid-grid-desc">
                      Cadastre um novo serviço para sua equipe interna
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <Divider align="right" type="dashed">
            <b>Históricos e registros</b>
          </Divider>
          <div className="grid p-card-grid">
            <div className="col-fixed p-card-grid-col" style={{ height: '150px' }}>
              <div className="grid nested-grid p-card-grid-col-link-grid">
                <div className="grid p-card-grid-col-link-grid-grid">
                  <div className="col-10 p-card-grid-col-link-grid-grid-title">
                    Histórico serviços
                  </div>
                  <div className="col-2 p-card-grid-col-link-grid-grid-icon">
                    <i className="pi pi-history"></i>
                  </div>

                  <Inplace closable className='p-inplace-mini-form'>
                    <InplaceDisplay>
                      {<div className="col-12 p-card-grid-col-link-grid-grid-desc" >
                        Liste todo extrato de informações referente aos serviços realizados
                      </div>}
                    </InplaceDisplay>
                    <InplaceContent className='ola'>

                    </InplaceContent>
                  </Inplace>
                </div>
              </div>
            </div>
            <div className="col-fixed p-card-grid-col" style={{ height: '150px' }}>
              <div className="grid nested-grid p-card-grid-col-link-grid">
                <div className="grid p-card-grid-col-link-grid-grid">
                  <div className="col-10 p-card-grid-col-link-grid-grid-title">
                    Histórico visitas
                  </div>
                  <div className="col-2 p-card-grid-col-link-grid-grid-icon">
                    <i className="pi pi-history"></i>
                  </div>

                  <Inplace closable className='p-inplace-mini-form'>
                    <InplaceDisplay>
                      {<div className="col-12 p-card-grid-col-link-grid-grid-desc" style={{ height: '100px' }}>
                        Liste todo extrato de informações referente as visitas realziadas
                      </div>}
                    </InplaceDisplay>
                    <InplaceContent className='ola'>
                    </InplaceContent>
                  </Inplace>
                </div>
              </div>
            </div>
          </div>


          <Divider align="right" type="dashed">
            <b>Atalhos úteis</b>
          </Divider>
          <div className="grid p-card-grid">
            <div className="col-fixed p-card-grid-col">
              <Link className='p-card-grid-col-link' onClick={() => openNew(true)} >
                <div className="grid nested-grid p-card-grid-col-link-grid">
                  <div className="grid p-card-grid-col-link-grid-grid">
                    <div className="col-10 p-card-grid-col-link-grid-grid-title">
                      Tickets pendentes
                    </div>
                    <div className="col-2 p-card-grid-col-link-grid-grid-icon">
                      <i className="pi pi-stopwatch"></i>
                    </div>
                    <div className="col-12 p-card-grid-col-link-grid-grid-desc">
                      Veja os tickets pendentes de aprovação ou retornados
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-fixed p-card-grid-col">
              <Link className='p-card-grid-col-link' onClick={() => openNew(true)} >
                <div className="grid nested-grid p-card-grid-col-link-grid">
                  <div className="grid p-card-grid-col-link-grid-grid">
                    <div className="col-10 p-card-grid-col-link-grid-grid-title">
                      Meu estoque
                    </div>
                    <div className="col-2 p-card-grid-col-link-grid-grid-icon">
                      <i className="pi pi-th-large"></i>
                    </div>
                    <div className="col-12 p-card-grid-col-link-grid-grid-desc">
                      Controle os equipamentos que estão em sua posse
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Sidebar>
      <Sidebar className='w-sidebar-right' header={<h3>{nomePagina.toUpperCase()}</h3>} visible={visibleCRUD} position="right" blockScroll onHide={() => closedNew()} style={{ width: '100em' }}>
        <ServicosCru registro={registro} filhoParaPaiPost={recebidoDoFilhoPost} filhoParaPaiPatch={recebidoDoFilhoPatch} />
      </Sidebar>

      <Sidebar className='w-sidebar-right w-sidebar-right-detail bg-green-500' header={<h3>DETALHES DA VISITA</h3>} visible={visibleVisita} position="right" blockScroll onHide={() => setVisibleVisita(false)} style={{ width: '100%' }}>
        <div className="card w-card border-top-1 border-300" >
          <div className="p-fluid w-form" >
            <div className="p-fluid grid">
              <InputText value={registroVisit.id} hidden />
              <div className="field w-field col-12 md:col-12">
                <label className="font-medium text-900">Início:</label>
                <div className="p-inputgroup input-transparent">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-calendar-plus"></i>
                  </span>
                  <InputText value={registroVisit.inicio ? <span>new Date(registroVisit.inicio).toLocaleString("pt-br")</span> : <span>''</span>} disabled />
                </div>
              </div>
              <div className="field w-field col-12 md:col-12">
                <label className="font-medium text-900">Duração:</label>
                <div className="p-inputgroup input-transparent">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-clock"></i>
                  </span>
                  <InputText value='' disabled />
                </div>
              </div>
              <div className="field w-field col-12 md:col-12">
                <label className="font-medium text-900">Distância total prevista:</label>
                <div className="p-inputgroup input-transparent">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-map-marker"></i>
                  </span>
                  <InputText value={registroVisit.distancia} disabled />
                </div>
              </div>
              <div className="field w-field col-12 md:col-12">
                <label className="font-medium text-900">Frota em uso:</label>
                <div className="p-inputgroup input-transparent">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-car"></i>
                  </span>
                  <InputText value={registroVisit.veiculo ?? 'sem veículo definido'} disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="p-fluid w-form" style={{ backgroundColor: 'white' }}>
            <div className="p-fluid grid">
              <div className="field w-field col-6 md:col-6">
                <label className="font-medium text-900">Foi necessário despesa com alimentação?:</label>
                <div className="p-inputgroup ">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-credit-card"></i>
                  </span>
                  <Dropdown value={registroVisit.alimentacao} options={opcoesVisitas} onChange={(e) => onInputChange(e, 'alimentacao')} />
                </div>
              </div>
              <div className="field w-field col-6 md:col-6">
                <label className="font-medium text-900">Foi necessário despesa com hospedagem?:</label>
                <div className="p-inputgroup ">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-credit-card"></i>
                  </span>
                  <Dropdown value={registroVisit.hospedagem} options={opcoesVisitas} onChange={(e) => onInputChange(e, 'hospedagem')} />
                </div>
              </div>
              <div className="field w-field col-12 md:col-12">
                <Button label="Finalizar visita" className="w-form-button bg-white text-black-alpha-80 p-button-outlined p-button-success" icon="pi pi-stopwatch'" iconPos='right' onClick={fecharVisita} />
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
      {/* <Dialog className='w-dialog-delete' visible={occurrenceDialog} draggable closeOnEscape={false} closable={false} style={{ width: '450px' }} modal footer={occurrenceDialogFooter} >
        <OccurrenceDialogBody />
      </Dialog>*/}
    </>
  );
}

export default Content
