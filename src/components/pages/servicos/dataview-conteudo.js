import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TreeTable } from 'primereact/treetable';

import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
//IMPORTANTO RECURSOS DE FRAMEWORKS E BIBLIOTECAS
import { axiosApi } from '../../../services/axios';
import { Link } from 'react-router-dom';

//IMPORTANDO COMPONENTES PERSONALIZADOS
import ExecuteOs from './form-execute';
import ServicosOS from './form-os';
export default function DataviewConteudo(props) {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);

    const toast = useRef(null);
    const buscarRegistros = () => {
        setLoading(true);
        axiosApi.get("/list_order_service_filter/" + props.data.id)
            .then((response) => {
                setRegistros(response.data)
            })
            .catch(function (error) {
            });

        setLoading(false)
    }

    //requisisção 
    useEffect(() => {
        buscarRegistros()
    }, [])

    const veiculoBodyTemplate = (rowData) => {
        return <span>{rowData.placa + "/ " + rowData.frota}</span>
    }
    const statusBodyTemplate = (rowData) => {
        let button
        switch (rowData.status) {
            case '1':
                button = <div className="text-right" > <Button icon="pi pi-step-forward" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            case '2':
                button = <div className="text-right" ><Button icon="pi pi-fast-forward" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            case '3':
                button = <div className="text-right" > <Button icon="pi pi-file-edit" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            case '4':
                button = <div className="text-right" > <Button icon="pi pi-thumbs-up" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            default:
                //Instruções executadas quando o valor da expressão é diferente de todos os cases
                break;
        }

        return button
    }
    const statusBodyTemplateAtividade = (rowData) => {


        return rowData.tipo + "/ " + rowData.produto
    }


    //FORMULARIO EXECUCAO OS------------------------------------------------------------------------------------------|

    const [visibleExecuteOS, setVisibleExecuteOS] = useState(false);
    //states
    let emptyregistro = {
        id: null
    };
    const [registroExecucao, setRegistroExecucao] = useState(emptyregistro);
    const visualizarOs = (os) => {
        setRegistroExecucao(os)
        setVisibleExecuteOS(true)
    }
    const fecharOs = () => {
        setRegistroExecucao(emptyregistro)
        setVisibleExecuteOS(false)
    }

    const recebidoDoFilhoPatch = (registro) => {
        let _registros = [...registros];
        let _registro = registro;
        let index = findIndexById(registro.id);
        _registros[index] = _registro;
        setRegistros(_registros);
        setVisibleExecuteOS(false)
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: <img src='https://cdn.pixabay.com/animation/2024/08/04/01/29/01-29-36-744_256.gif' alt="registros" width={'300px'} />, life: 1000 });

    }
    const recebidoDoFilhoProximo= (registro) => {
        console.log(registro)
        let _registros = [...registros];
        let _registro = registro;
        let index = findIndexById(registro.id);
        _registros[index] = _registro;
        setRegistros(_registros);
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

    const [visibleOS, setVisibleOS] = useState(false);
    const [registroview, setVRegistroView] = useState([]);
    const viewOS = (data) => {
        setVRegistroView(data)
        setVisibleOS(true)
    }
    const closedview = () => {
        setVRegistroView([])
        setVisibleOS(false)
    }

    //states
    let emptyregistroOS = {
        id: null
    };
    const [registroOS, setRegistroOS] = useState(emptyregistroOS);
    const [visibleCRU, setVisibleCRU] = useState(false);
    const newOS = (data) => {
        setRegistroOS(data);
        setVisibleCRU(true)
    }
    //função que recebe os dados de um novo cadastro
  const recebidoDoFilhoPostOS = (registro) => {
    buscarRegistros()
    setRegistroOS(emptyregistroOS);
    setVisibleCRU(false)
  }

    return (
        <>
            <Toast ref={toast} position="bottom-right" className='toast-confete' />
            <DataTable value={registros} responsiveLayout="scroll" className='data-table-os'>
                <Column field="placa" header="Placa/Frota" body={veiculoBodyTemplate}></Column>
                <Column header="Status" body={statusBodyTemplateAtividade}></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
            <div class="text-center card-dataview-footer-opcoes" style={{ margin: '15px' }}>
                <div class="flex justify-content-end flex-wrap">
                    <div class="flex align-items-center justify-content-center">
                        <span className="p-buttonset">
                            <Button label="Criar OS" className='p-button-primary card-dataview-footer-opcoes-btn' icon="pi pi-plus" onClick={() => newOS(props.data.id)} />

                        </span>
                    </div>
                </div>
            </div>
            <Sidebar className='w-sidebar-right w-sidebar-right ' header={<h3>Cadastrar Ordem de Serviço</h3>} visible={visibleCRU} position="right" blockScroll dismissable={true} onHide={() => setVisibleCRU(false)} fullScreen>
                <ServicosOS registro={props.data.id} filhoParaPaiPostOS={recebidoDoFilhoPostOS} />
            </Sidebar>
            <Sidebar className='w-sidebar-os' header={<h3 style={{color:'black'}}>{'Execução os: ' + registroExecucao.id}</h3>} visible={visibleExecuteOS} fullScreen blockScroll={true} dispensável={false} onHide={() => fecharOs()} >
                <ExecuteOs registro={registroExecucao} filhoParaPaiPatch={recebidoDoFilhoPatch} recebidoDoFilhoProximo={recebidoDoFilhoProximo}/>
            </Sidebar>

        </>
    )
}