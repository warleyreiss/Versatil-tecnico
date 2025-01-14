import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TreeTable } from 'primereact/treetable';
import { Chips } from 'primereact/chips';
import Select from 'react-select'
import { FileUpload } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
//IMPORTANTO RECURSOS DE FRAMEWORKS E BIBLIOTECAS
import { axiosApi } from '../../../services/axios';
import { Link } from 'react-router-dom';

import { ScrollPanel } from 'primereact/scrollpanel';
import SignatureCanvas from 'react-signature-canvas'
import { Divider } from '@mui/material';

const steps = [
    {
        id: 0,
        title: "AVALIAÇÃO INICAL"
    },
    {
        id: 1,
        title: "EXECUÇÃO"
    },
    {
        id: 2,
        title: "CONFERÊNCIA E ASSINATURA"
    }
    ,
    {
        id: 4,
        title: "VISUALIZAÇÃO"
    }
];
export default function ExecuteOs(props) {
    const filesElement = useRef(null);
    //states
    let emptyregistro = {
        id: null
    };
    const [os, setOs] = useState(props.registro);
    const [atendimentoOs, setAtendimentoOS] = useState(false)
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(false);
    const [violacaoOs, setViolacaoOS] = useState(false)
    const [registrosInsumos, setRegistrosInsumos] = useState([])
    const [registrosEquipmentosCliente, setRegistrosEquipmentosCliente] = useState([]);
    const [registrosPerifericos, setRegistrosPerifericos] = useState([]);
    const [registrosEquipmentosUsuario, setRegistrosEquipmentosUsario] = useState([]);

    const { signature, setSignature } = useState()

    const [toDataURLSignature, setToDataURLSignature] = useState('');

    const [sign, setSign] = useState();
    useEffect(() => {
        //console.log(props.registro.atendimento)
        if (props.registro.atendimento == null || props.registro.atendimento == 'NAO') {
            setAtendimentoOS(false)
            let _registro = { ...os };
            _registro['atendimento'] = 'NAO'
            setOs(_registro);
        }
        if (props.registro.atendimento == 'SIM') {
            setAtendimentoOS(true)
            let _registro = { ...os };
            _registro['atendimento'] = 'SIM'
        }


        //REQUISIÇÃO COM A BIBLIOTECA AXIOS PARA SOLICITAR LISTA DE INSUMOS 
        axiosApi.get("/list_insumo_input")
            .then((response) => {
                setRegistrosInsumos(response.data)
            })
            .catch(function (error) {

            });
        axiosApi.get("/list_peripheral_input")
            .then((response) => {
                setRegistrosPerifericos(response.data)
            })
            .catch(function (error) {
            });

        axiosApi.get("/list_equipment_me")
            .then((response) => {
                setRegistrosEquipmentosUsario(response.data)
            })
            .catch(function (error) {
            });
        axiosApi.get("/list_equipment_warehouse_input/" + os.id)
            .then((response) => {
                setRegistrosEquipmentosCliente(response.data)
            })
            .catch(function (error) {
            });

    }, [])
    const [currentStep, setCurrentStep] = useState(props.registro.status - 1);
    const [loading, setLoading] = useState(false);



    function handleNext() {
        saveRegistro()
        if (currentStep == 0) {

            /* axiosApi.patch('/update_order_service_assess',os) 
             .then(function (response) {
                 if (response.data == 'sem visita') {
                     alert("PRIMEIRO ABRA UMA VISITA")
                 } else {
                     if(os.atendimento=='SIM'){
                     setCurrentStep((prevState) => prevState + 1);
                     }if (os.atendimento=='NAO'){
                         setCurrentStep((prevState) => prevState + 2);
                     }
                 }
             })
             .catch(function (error) {
                 console.log(error)
                 setCurrentStep((prevState) => prevState + 1);
             });
             */
            setCurrentStep((prevState) => prevState + 1);
        }
        if (currentStep == 1) {
            setCurrentStep((prevState) => prevState + 1);
        }
        //  setCurrentStep((prevState) => prevState + 1);
    }
    function handleReturn() {
        setCurrentStep((prevState) => prevState - 1);
    }

    //funções de preenchimento do formulario
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _registro = { ...os };
        _registro[`${name}`] = val;

        setOs(_registro);
    }
    const onInputChangeChips = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _registro = { ...os };
        _registro[`${name}`] = val;

        setOs(_registro);
    }
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _registro = { ...os };
        _registro[`${name}`] = val;
        setOs(_registro);
    }
    const onInputSimpleSelectChange = (e, name) => {
        const val = e['value'] || 0;
        let _registro = { ...os };
        _registro[`${name}`] = val;
        setOs(_registro);
    }

    const onInputMultiSelectChange = (e, name) => {

        const val = e.map(c => c.value)
        let _registro = { ...os };
        _registro[`${name}`] = val;
        setOs(_registro);
    }

    const atendimento = (e, name) => {
        const val = (e.target && e.target.value)
        if (val === "SIM") {
            setAtendimentoOS(true)
        } else {
            setAtendimentoOS(false)
        }
        onInputChange(e, name)
    }
    const violacao = (e, name) => {
        const val = (e.target && e.target.value)
        if (val === "SIM") {
            setViolacaoOS(true)
        } else {
            setViolacaoOS(false)
        }
        onInputChange(e, name)

    }
    //array de opções dos inputs selects
    const confirmacao = [
        { label: 'SIM, ATENDIMENTO REALIZADO', value: 'SIM' },
        { label: 'NÃO, ATENDIMENTO FRUSTADO', value: 'NAO' }
    ];
    const motivo = [
        { label: 'VEÍCULO COM AVARIAS', value: 'VEÍCULO COM AVARIAS' },
        { label: 'VEÍCULO EM MANUTENÇÃO', value: 'VEÍCULO EM MANUTENÇÃO' },
        { label: 'NVEÍCULO INDISPONÍVEL', value: 'VEÍCULO INDISPONÍVEL' },
        { label: 'VEÍCULO PARADO', value: 'VEÍCULO PARADO' }
    ];
    const confirmacao2 = [
        { label: 'SIM', value: 'SIM' },
        { label: 'NÃO', value: 'NAO' }
    ];
    const danos = [
        { label: 'Sim, porém reparado no local', value: 'REPARAVEL' },
        { label: 'Sim, precisou ser recolhido', value: 'IRREPARAVEL' },
        { label: 'Sem danos aparente', value: 'NAO' }
    ];
    const efeitoFalha = [
        { label: 'PERDA DE TRANSMISSAO', value: 'PERDA DE TRANSMISSÃO' },
        { label: 'FALHA GERACAO DE EVENTOS', value: 'FALHA GERACAO DE EVENTOS' },
        { label: 'CAN TRAVADA', value: 'CAN TRAVADA' },
        { label: 'CHIP SUSPENSO', value: 'CHIP SUSPENSO' }
    ];
    const causaFalha = [
        { label: 'CHICOTE DANIFICADO', value: 'CHICOTE DANIFICADO' },
        { label: 'LEITORA DANIFICADA', value: 'LEITORA DANIFICADA' },
        { label: 'MODULO COM AVARIA', value: 'MÓDULO COM AVARIA' },
        { label: 'CAMERA ADAS COM AVARIA', value: 'CAMERA ADAS COM AVARIA' },
        { label: 'LEITORA DE AUDIO COM AVARIA', value: 'LEITORA DE AUDIO COM AVARIA' },
        { label: 'BUZZER COM AVARIA', value: 'BUZZER COM AVARIA' },
        { label: 'SD CARD CM AVARIA', value: 'CAMERA ADAS COM AVARIA' },
        { label: 'CONFIGURACAO IRREGULAR', value: 'CONFIGURACAO IRREGULAR' },
        { label: 'SCRIPT DESATUALIZADO', value: 'SCRIPT DESATUALIZADO' },
    ];
    const responsavelFalha = [
        { label: 'CLIENTE', value: 'CLIENTE' },
        { label: 'OPERACAO', value: 'OPERACAO' },
        { label: 'EQUIPAMENTO', value: 'EQUIPAMENTO' },
        { label: 'DESENVOLVIMENTO', value: 'DESENVOLVIMENTO' }
    ];


    //envio do formulario CRUD
    const saveRegistro = () => {

        /*
                if (os.id) {
                    axiosApi.patch("/update_service", os)
                        .then((response) => {
                            console.log('editado')
                            //props.filhoParaPaiPatch(response.data)
                            console.log(response.data)
                        })
                        .catch(function (error) {
                            console.log(error)
                        });
                }
                        */
    };

    const saveFiles = () => {
        const dataForm = new FormData()
        dataForm.append("id", os.id)
        for (const file of filesElement.current.files) {
            dataForm.append('file', file);
            console.log(file)
        }
        axiosApi.patch("/update_order_service_files", dataForm)
            .then((response) => {
                console.log(response.data)
                let _registro = { ...os };
                _registro[`files`] = response.data;
                setOs(_registro)
                console.log(_registro)
            })
            .catch(function (error) {
                console.log(error)
            });
    }



    //asinatura
    //FUNÇÃO DA BIBLIOTECA SIGNATURE_PAD
    const handleClear = () => {
        sign.clear()
        let input = document.getElementById("input-assinatura")
        input.value = ""
    }
    const handleConfirm = () => {
        let sigImage = document.getElementById("sig-image")
        sigImage.setAttribute("src", sign.toDataURL());
        const canvas = document.getElementById("canvas-signature")
        const url = canvas.toDataURL()
        setToDataURLSignature(url)
        let input = document.getElementById("input-assinatura")
        input.value = url
        // handleClose()

    }
    return (
        <>
            {/*
            <h1>Multi Steps Form</h1>
            <p className="step-guide">
                {currentStep + 1} de {steps.length - 1}
            </p>

*/}

            <div class="flex flex-column">
                <div className='flex  w-sidebar-os-content ' style={{ minHeight: '80vh', maxHeight: '80vh' }}>

                    <ScrollPanel className='col-12 md:col-12' >
                        <p>{steps[currentStep].title}</p>

                        {steps[currentStep].id === 0 && (
                            <div className="card " >
                                <div className="p-fluid w-form" >
                                    <div className="p-fluid grid">
                                        <div className="field w-field col-12 md:col-12">
                                            <label class="font-medium text-900">Foi possível realizar o atendimento?:</label>
                                            <div className="p-inputgroup w-inputgroup-select">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-tag"></i>
                                                </span>
                                                <Dropdown value={os.atendimento} options={confirmacao} onChange={(e) => atendimento(e, 'atendimento')} required />
                                            </div>
                                        </div>
                                        <div className="field w-field col-12 md:col-12" hidden={!atendimentoOs}>
                                            <label class="font-medium text-900">Realizou todas estas checagem obrigatórias?:</label>
                                            <div className="p-inputgroup w-inputgroup-select" style={{ border: 'none' }}>

                                                <div className='w-toggleButton' style={{ display: 'flex' }}>
                                                    <ToggleButton checked={checked1} onChange={(e) => setChecked1(e.value)} onLabel="Painel verificado" offLabel="Painel em bom estado de conservação, sem avarias?" onIcon="pi pi-check" offIcon="pi pi-question" />
                                                    <ToggleButton checked={checked2} onChange={(e) => setChecked2(e.value)} onLabel="Nenhuma luz de avaria presente" offLabel="Luzes de avarias acessas?" onIcon="pi pi-check" offIcon="pi pi-question" />
                                                    <ToggleButton checked={checked3} onChange={(e) => setChecked3(e.value)} onLabel="Ignição funcionando" offLabel="Veículo liga/desliga normalmente?" onIcon="pi pi-check" offIcon="pi pi-question" />
                                                    <ToggleButton checked={checked4} onChange={(e) => setChecked4(e.value)} onLabel="Iluminação e sinalização conferidos" offLabel="Luzes e setas funcionando?" onIcon="pi pi-check" offIcon="pi pi-question" />
                                                    <ToggleButton checked={checked5} onChange={(e) => setChecked5(e.value)} onLabel="implementações isoladas e sem risco de intercorrência que possa vir a ser incumbido no meu serviço" offLabel="As implementações presentes no veículo estão isoladas e com bom arranjo?" onIcon="pi pi-check" offIcon="pi pi-question" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field w-field col-12 md:col-12" hidden={atendimentoOs}>
                                            <label class="font-medium text-900">Qual foi o impedimento?:</label>
                                            <div className="p-inputgroup w-inputgroup-select">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-building"></i>
                                                </span>
                                                <Dropdown value={os.motivo} options={motivo} onChange={(e) => onInputChange(e, 'motivo')} disabled={atendimentoOs} required={atendimentoOs} />

                                            </div>
                                        </div>
                                        <div className="field w-field col-12 md:col-12" hidden={atendimentoOs}>
                                            <label class="font-medium text-900">Neste caso precisaremos anexar alguns registros,ok?:</label>
                                            <div className="p-inputgroup w-inputgroup-select">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-building"></i>
                                                </span>
                                                <input type="file" name="imagem" id="imagem-input" multiple ref={filesElement} disabled={atendimentoOs} required={atendimentoOs} />

                                                <Button label="Carregar arquivos" icon="pi pi-angle-double-left" onClick={saveFiles} />
                                            </div>
                                        </div>
                                        <div className="field w-field col-12 md:col-12" hidden={atendimentoOs}>
                                            <div className="p-inputgroup ">
                                                {os.files.map((foto) =>
                                                    <>
                                                        <img src={foto} alt="registros" width={'300px'} />
                                                        <Divider />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field w-field col-12 md:col-12">
                                            <label class="font-medium text-900">Que tal inserir algumas observações?:</label>
                                            <div className="p-inputgroup w-inputgroup-select">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-align-left"></i>
                                                </span>
                                                <InputTextarea value={os.observacao} onChange={(e) => onInputChange(e, 'observacao')} rows={1} cols={30} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {steps[currentStep].id === 1 && (
                            <>
                                <div className="card " >
                                    <div className="p-fluid w-form" >
                                        <div className="p-fluid grid">
                                            {/* <ScrollPanel style={{ width: '100%', height: '200px' }} className="custombar1">*/}

                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Foi identificado alguma violação?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-exclamation-circle"></i>
                                                    </span>
                                                    <Dropdown value={os.violacao} options={confirmacao2} onChange={(e) => violacao(e, 'violacao')} disabled={!atendimentoOs} required={!atendimentoOs} />
                                                </div>
                                            </div>

                                            <div className="field w-field col-12 md:col-12" hidden={!violacaoOs}>
                                                <label class="font-medium text-900">A violação causou danos?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-bolt"></i>
                                                    </span>
                                                    <Dropdown value={os.danos} options={danos} onChange={(e) => onInputChange(e, 'danos')} disabled={!violacaoOs} required={violacaoOs} />
                                                </div>
                                            </div>
                                            <div className="field w-field col-12 md:col-12" hidden={!violacaoOs}>
                                                <label class="font-medium text-900">O dano ocorrido foi em qual material/equipamento?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-box"></i>
                                                    </span>
                                                    <Select
                                                        options={registrosInsumos.map(sup => ({ value: sup.id, label: sup.item }))}
                                                        onChange={(e) => { onInputSimpleSelectChange(e, 'desc_violacao') }}
                                                        placeholder=''
                                                        isDisabled={!violacaoOs} required={violacaoOs}
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="card " >
                                    <div className="p-fluid w-form" >
                                        <div className="p-fluid grid">
                                            {/* <ScrollPanel style={{ width: '100%', height: '200px' }} className="custombar1">*/}

                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Qual a conseguência gerada pela falha?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-question-circle"></i>
                                                    </span>
                                                    <Dropdown value={os.efeito_falha} options={efeitoFalha} onChange={(e) => onInputChange(e, 'efeito_falha')} disabled={!atendimentoOs} required={!atendimentoOs} />
                                                </div>
                                            </div>
                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Qual foi a causa origem da falha?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-question-circle"></i>
                                                    </span>
                                                    <Dropdown value={os.causa_falha} options={causaFalha} onChange={(e) => onInputChange(e, 'causa_falha')} disabled={!atendimentoOs} required={!atendimentoOs} />
                                                </div>
                                            </div>
                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Quem foi o responsável por gerar a falha?:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-question-circle"></i>
                                                    </span>
                                                    <Dropdown value={os.responsavel_falha} options={responsavelFalha} onChange={(e) => onInputChange(e, 'responsavel_falha')} disabled={!atendimentoOs} required={!atendimentoOs} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card " >
                                    <div className="p-fluid w-form" >
                                        <div className="p-fluid grid">
                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Informe os equipamentos utilizados:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-arrow-circle-up"></i>
                                                    </span>
                                                    <Chips value={os.material_usado} onChange={(e) => onInputChangeChips(e, 'material_usado')} />

                                                </div>
                                            </div>
                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Informe os equipamentos removidos:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-arrow-circle-down"></i>
                                                    </span>
                                                    <Chips value={os.material_retirado} onChange={(e) => onInputChangeChips(e, 'material_retirado')} />

                                                </div>
                                            </div>
                                            <div className="field w-field col-12 md:col-12">
                                                <label class="font-medium text-900">Informe se houve periféricos utilizados:</label>
                                                <div className="p-inputgroup w-inputgroup-select">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-box"></i>
                                                    </span>
                                                    <Select
                                                        options={registrosPerifericos.map(sup => ({ value: sup.id, label: sup.item }))}
                                                        onChange={(e) => { onInputSimpleSelectChange(e, 'periferico') }}
                                                        placeholder=''
                                                        isDisabled={!atendimentoOs} required={!atendimentoOs}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {steps[currentStep].id === 2 && (
                            <>
                                <ul className="list-none p-0 m-0">
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Atendimento realizado?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.atendimento}</div>
                                    </li>
                                    <div hidden={atendimentoOs}>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">motivo do não atendimento:</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.motivo}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">registro fotográfico:</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.atendimento}</div>
                                        </li>
                                    </div>
                                    <div hidden={!atendimentoOs}>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Violação identificada?:</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.violacao}</div>
                                        </li>

                                    </div>
                                    <div hidden={!violacaoOs}>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">A violação causou danos?:</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.danos}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">O que foi violado?:</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.desc_violacao}</div>
                                        </li>
                                    </div>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Efeito da falha?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.efeito_falha}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Causa da falha?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.causa_falha}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Responsável da falha?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.responsavel_falha}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Equipamento utilizado?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.material_usado ?? 'Sem material utilizado'}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Equipamento removido?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.material_retirado ?? 'Sem material retirado'}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Periferico?:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.periferico ?? 'Sem material retirado'}</div>
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Assinatura:</div>
                                        <img src='' alt="assinatura" id='sig-image' />
                                    </li>
                                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                                        <div className="text-500 w-6 md:w-2 font-medium">Nome do assinante:</div>
                                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{os.nome_assinatura}</div>
                                    </li>
                                </ul>
                            </>
                        )}
                        {steps[currentStep].id === 4 && (
                            <>

                            </>
                        )}








                        {loading && <h1 className="loader">Enviando...</h1>}
                    </ScrollPanel>
                </div>

                <div className=' w-sidebar-os-footer'>
                    <div class="flex justify-content-between flex-wrap" style={{ height: '10vh', zIndex: '5000' }}>
                        <div class="flex align-items-center justify-content-center ">
                            {currentStep > 0 && currentStep < steps.length - 1 && (
                                <Button label="Voltar" icon="pi pi-angle-double-left" onClick={handleReturn} />

                            )}

                        </div>
                        <div class="flex align-items-center justify-content-center ">
                            {currentStep < steps.length - 2 && (
                                <Button label="Continuar" icon="pi pi-angle-double-right" iconPos="right" onClick={handleNext} />
                            )}
                            {currentStep === steps.length - 2 && (
                                <Button label="Concluir" icon="pi pi-thumbs-up" iconPos="right" onClick={handleReturn} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}