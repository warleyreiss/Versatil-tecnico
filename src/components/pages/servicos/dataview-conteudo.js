import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TreeTable } from 'primereact/treetable';

import { Sidebar } from 'primereact/sidebar';
//IMPORTANTO RECURSOS DE FRAMEWORKS E BIBLIOTECAS
import { axiosApi } from '../../../services/axios';
import { Link } from 'react-router-dom';

//IMPORTANDO COMPONENTES PERSONALIZADOS
import ExecuteOs from './form-execute';

export default function DataviewConteudo(props) {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
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
                button = <div class="text-right" > <Button icon="pi pi-step-forward" onClick={(e) => visualizarOs(rowData)}/></div>
                break;
            case '2':
                switch (rowData.tipo) {
                    case 'INSTALACAO':
                        button = <div class="text-right" ><Button icon="pi pi-fast-forward" onClick={(e) => visualizarOs(rowData)}/></div>
                        break;
                    case 'MANUTENCAO':
                        button = <div class="text-right" ><Button icon="pi pi-fast-forward" onClick={(e) => visualizarOs(rowData)}/></div>
                        break;
                    case 'REMOCAO':
                        button = <div class="text-right" > <Button icon="pi pi-fast-forward" onClick={(e) => visualizarOs(rowData)}/></div>
                        break;
                }

                break;
            case '3':
                button = <div class="text-right" > <Button icon="pi pi-file-edit" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            case '4':
                button = <div class="text-right" > <Button icon="pi pi-thumbs-up" onClick={(e) => visualizarOs(rowData)} /></div>
                break;
            default:
                //Instruções executadas quando o valor da expressão é diferente de todos os cases
                break;
        }

        return button
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

    const recebidoDoFilhoPatch = () => {

    }
    return (
        <>
            <DataTable value={registros} responsiveLayout="scroll" className='data-table-os'>
                <Column field="id" header="ID"></Column>
                <Column field="price" header="Placa/Frota" body={veiculoBodyTemplate}></Column>
                <Column field="tipo" header="Demanda"></Column>
                <Column field="produto" header="Produto"></Column>
                <Column field="status" header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
            <Sidebar className='w-sidebar-os' visible={visibleExecuteOS} fullScreen blockScroll={true} dispensável={false} onHide={() => fecharOs()} >
                <ExecuteOs registro={registroExecucao} filhoParaPaiPatch={recebidoDoFilhoPatch} />
            </Sidebar>

        </>
    )
}