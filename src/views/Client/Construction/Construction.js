import React, { Component, lazy, Suspense, useRef } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Progress,
    Row,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import 'chartjs-plugin-datalabels';
import Calendar from '../../Components/Calendar/Calendar';
import { PDFReader } from 'react-read-pdf'
import ReactToPrint from 'react-to-print';

import axios from "axios";

import Widget02 from '../../Widgets/Widget02';

import * as crud from '../../../services/crud';

import {
    BrowserView,
    MobileView
} from "react-device-detect";

import 'moment/locale/pt-br';
import { isBrowser } from 'react-device-detect';
const moment = require('moment');
moment.locale('pt-br');

let date = '';

class Construction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            heightWindow: window.innerHeight,
            loadingProductionTotal: true,
            construction: {},
            productionTotal: [],
            provided: [],
            detailedPosition: [],
            stock: [],
            employees: [],
            movement: [],
            weather: {},
            curTime: '',
            modalSchedule: false,
            modalViewPdf: false,
            itemDetailMeasurement: {},
            measurementSheet: [],
            styleCardMovement: { padding: 0 + 'px' },
            totalPage: 1,
            arrayPages: [],
            images: {
                'MEIO-FIO-65': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/meiofio.png',
                'MEIO-FIO-80': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/meiofio.png',
                'MEIO-FIO-100': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/meiofio.png',
                'T16F6N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesN.png',
                'T16F8N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesN.png',
                'T16F6V': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesV.png',
                'T16F8V': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesV.png',
                'T6A': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoA.png',
                'T6G': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoG.png',
                'T6N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoN.png',
                'T6V': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoV.png',
                'T8A': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoA.png',
                'T8G': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoG.png',
                'T8N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoN.png',
                'T8V': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/intertravadoV.png',
                'TS8N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/sextavado.png',
                'S': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/01/up.png',
                'E': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/01/down.png',
                'R': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/01/return.png',
            },
            meter: {
                'MEIO-FIO-65': 23.4,
                'MEIO-FIO-80': 12,
                'MEIO-FIO-100': 15,
                'T16F6N': 15,
                'T16F8N': 11,
                'T16F6V': 15,
                'T16F8V': 11,
                'T6A': 12.5,
                'T6G': 12.5,
                'T6N': 14,
                'T6V': 12.5,
                'T8A': 10,
                'T8G': 10,
                'T8N': 10,
                'T8V': 10,
                'TS8N': 9,
                'SARJETA': 1,
                'REPARODEMEIOFIO': 1,
                'REPARODEPISO': 1,
            },
        };
    }

    toggleModalSchedule = () => {
        this.setState({
            modalSchedule: !this.state.modalSchedule,
        });
    }

    toggleModalViewPdf = (item = {}) => {
        this.setState({
            modalViewPdf: !this.state.modalViewPdf,
        });

        if( item.data ) {
            console.log(item.data.observ);
            this.setState({ itemDetailMeasurement: item.data });
        }
    }

    getMovement = async (id) => {
        try {
            let movement = await crud.get('construction/inventory_movement_construction/' + id);
            if (movement.status == 200) {
                this.setState({
                    loading: false,
                    movement: movement.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getWeather = async () => {
        try {
            let lat = this.props.match.params.lat;
            let lng = this.props.match.params.lng;

            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&lang=pt_br&units=metric&appid=68365616a4b615d20ca6b4e983d119bb`)
            .then(res => {
                if( res.status == 200 ) {
                    this.setState({
                        weather: res.data
                    });
                    console.log(res.data);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    getTotalProduction = async (id) => {
        try {
            let construction = await crud.get('construction/production_total_construction/' + id);
            if (construction.status == 200) {
                this.setState({
                    loadingProductionTotal: false,
                    productionTotal: construction.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getConstruction = async (id) => {
        try {
            let construction = await crud.get('construction/construction/' + id);
            if (construction.status == 200) {
                this.setState({
                    loading: false,
                    construction: construction.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getStockConstruction = async (id) => {
        try {
            let stock = await crud.get('construction/stock_construction/' + id);
            if (stock.status == 200) {
                this.setState({
                    loading: false,
                    stock: stock.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getDetailedPosition = async (id) => {
        try {
            let detailed = await crud.get('construction/detailed_position_construction/' + id);
            if (detailed.status == 200) {
                this.setState({
                    loading: false,
                    detailedPosition: detailed.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getEmployees = async (id) => {
        try {
            let employees = await crud.get('construction/employees_construction/' + id);
            if(employees.status == 200) {
                this.setState({
                    loading: false,
                    employees: employees.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getProvided = async (id) => {
        try {
            let provided = await crud.get('construction/provided_construction/' + id);
            if (provided.status == 200) {
                this.setState({
                    products: provided.data
                });
                //percorre para verificar o produto que não foi enviado
                provided.data.forEach((item, index) => {
                    this.state.stock.forEach((stock, index2) => {
                        if (stock.IDPRODUTO == item.IDPRODUTO) {
                            delete provided.data[index];
                        }
                    })
                });
                this.setState({
                    loading: false,
                    provided: provided.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getMeasurementSheet = async (id) => {
        try {
            let items = [];
            let measurement = await crud.get('construction/measurement_sheet/' + id);

            if (measurement.status == 200) {
                items = measurement.data;

                this.setState({
                    loadingMeasurementSheet: false,
                    measurementSheet: items,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async componentDidMount(){
        let id = this.props.match.params.id;
        setInterval(() => {
            this.setState({
                curTime: new Date().toLocaleString(),
            })
        }, 1000);

        this.getWeather();
        this.getTotalProduction(id);
        this.getDetailedPosition(id);
        this.getConstruction(id);
        this.getMeasurementSheet(id);
        this.getMovement(id);
        this.getEmployees(id)

        await this.getStockConstruction(id);
        await this.getProvided(id);
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Carregando...</div>

    render() {
        return (
            <div className="animated fadeIn">
                {this.state.weather.cod &&
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col xs="12" md="7" xl="7">
                                        <h4 style={{ marginBottom: 15 }}>
                                            <a href="#/list-construction">
                                                <i className="icon-arrow-left icons font-2xl d-block" style={{ marginRight: 10, float: 'left' }}></i>
                                            </a>{' '}
                                            {this.state.construction.DESCRICAO}
                                        </h4>
                                        <h5 style={{ marginBottom: 35 }}>{moment().format('LLLL')}</h5>
                                        <Row>
                                            <Col xs="12" md="12" xl="12">
                                                <hr />
                                            </Col>
                                            <Col xs="12" md="12" xl="12">
                                                <h4>Gestor da obra</h4>
                                                <h6>{atob(this.props.match.params.responsible)}</h6>
                                                <h6>Contato: {atob(this.props.match.params.contract)}</h6>
                                                {/*<h6>Atualmente {this.state.employees.length} funcionários trabalhando na obra</h6>*/}
                                            </Col>
                                        </Row>

                                        {/*<center style={{marginBottom: 22}}>
                                            <a href="http://blog.rxconstrutora.com.br/" target="_blank" style={{ marginLeft: 10, marginRight: 10, fontSize: 18 }}>Blog</a>
                                            <a href="http://rxconstrutora.com.br/" target="_blank" style={{ marginLeft: 10, marginRight: 10, fontSize: 18 }}>Site</a>
                                            <a href="https://instagram.com/rxconstrutora" target="_blank" style={{ marginLeft: 10, marginRight: 10, fontSize: 18 }}>Instagram</a>
                                        </center>*/}
                                    </Col>
                                    <Col xs="12" md="5" xl="5">
                                        <Row>
                                            <Col xs="12" md="5" xl="5">
                                                <center>
                                                    <img src={`http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/08/${this.state.weather.weather[0].icon}.png`} style={{ width: 120, marginBottom: 10 }} /><br />
                                                    <h3>{this.state.weather.weather[0].description}</h3>
                                                </center>
                                            </Col>
                                            <Col xs="12" md="7" xl="7" style={{ paddingTop: 22 }}>
                                                <h4 style={{ marginBottom: 15 }}>Máx {this.state.weather.main.temp_max.toFixed(0)} °C</h4>
                                                <h4 style={{ marginBottom: 15 }}>Min &nbsp;{this.state.weather.main.temp_min.toFixed(0)} °C</h4>
                                                <h4 style={{ marginBottom: 15 }}>Vento {this.state.weather.wind.speed} metros/seg</h4>
                                            </Col>
                                            <Col xs="12" md="12" xl="12" style={{ paddingTop: 18 }}>
                                                <Button block color="primary" style={{ float: 'right', marginTop: isBrowser ? 8 : 25, marginBottom: 12 }} onClick={() => this.toggleModalSchedule()}>
                                                    Visualizar díario
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row> }

                {!this.state.loadingProductionTotal &&
                <Row>
                    <Col xs="12" sm="12">
                        <Row>
                            {this.state.productionTotal.M2 != 0 &&
                            <Col xs="12" sm="12" lg="4">
                                <Widget02
                                //header={this.state.productionTotal.M2.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.') + ' M2'}
                                header={'PISO'}
                                percent={this.state.productionTotal.M2PCT ? this.state.productionTotal.M2PCT : 0}
                                mainText={"ASSENTAMENTO"}
                                color="dark" />
                            </Col>}
                            {this.state.productionTotal.M != 0 &&
                            <Col xs="12" sm="12" lg="4">
                                <Widget02
                                //header={this.state.productionTotal.M.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.') + ' M'}
                                header={'MEIO-FIO'}
                                percent={this.state.productionTotal.MPCT ? this.state.productionTotal.MPCT : 0}
                                mainText={"ASSSENTAMENTO"}
                                color="dark" />
                            </Col>}
                            {this.state.productionTotal.M2R != 0 &&
                            <Col xs="12" sm="12" lg="4">
                                <Widget02
                                //header={this.state.productionTotal.M2R.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.') + ' M'}
                                percent={this.state.productionTotal.M2RPCT ? this.state.productionTotal.M2RPCT : 0}
                                header={"PISO"}
                                mainText={"REPARADO"}
                                color="dark" />
                            </Col>}
                            {this.state.productionTotal.MR != 0 &&
                            <Col xs="12" sm="12" lg="4">
                                <Widget02
                                //header={this.state.productionTotal.MR.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.') + ' M'}
                                percent={this.state.productionTotal.MRPCT ? this.state.productionTotal.MRPCT : 0}
                                header={"MEIO-FIO"}
                                mainText={"REPARADO"}
                                color="dark" />
                            </Col>}
                            <Col xs="12" sm="12" lg="4">
                                <Widget02
                                header={'Serviços'}
                                percent={this.state.productionTotal.TOTALPCT ? this.state.productionTotal.TOTALPCT : 0}
                                mainText={"TOTAL EXECUTADO"}
                                color="dark" />
                            </Col>
                        </Row>
                    </Col>
                </Row>}

                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                        <CardHeader>
                            <strong>SITUAÇÃO DOS PALLETS</strong>
                        </CardHeader>
                        <CardBody style={{ padding: 0 + 'px' }}>
                            <Table responsive>
                            <thead>
                                <tr>
                                <th style={{ width: 6 + '%' }}></th>
                                <th style={{ width: 22 + '%' }}>Produto</th>
                                <th style={{ width: 24 + '%' }}>Enviados</th>
                                <th style={{ width: 24 + '%' }}>Executado</th>
                                <th style={{ width: 8 + '%' }}>Estoque</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.stock.map((item, index) => (
                                (item.REFERENCIA != 'REPARODEMEIOFIO' && item.REFERENCIA != 'REPARODEPISO') &&
                                <tr key={index}>
                                    <td><img src={this.state.images[item.REFERENCIA]} style={{ width: 40 + 'px' }} /></td>
                                    <td>{item.DESCRICAO}</td>
                                    <td>
                                    {item.REFERENCIA != 'SARJETA' && 
                                    <center>
                                        <Progress value={item.PCT_ENVIADO.toFixed(2)}
                                        className="mb-3"
                                        color={
                                            ( item.PCT_ENVIADO.toFixed(2) >= 100 && item.PCT_ENVIADO.toFixed(2) <= 102 ) 
                                            ? "success" 
                                            : ( item.PCT_ENVIADO.toFixed(2) >= 85 && item.PCT_ENVIADO.toFixed(2) < 100 ) 
                                            ? "warning" 
                                            : ( item.PCT_ENVIADO.toFixed(2) < 85 ) 
                                            ? "primary"
                                            : "danger"
                                        }
                                        style={{ marginTop: 5 + 'px' }}
                                        >
                                        <span style={{ color: '#000000', fontSize: 13 + 'px' }}>
                                            {item.PCT_ENVIADO.toFixed(2)} %
                                        </span>
                                        </Progress>
                                    </center> }
                                    </td>
                                    <td>
                                    <center>
                                        <Progress value={item.PCT_EXECUTADO}
                                        className="mb-3"
                                        color={
                                            ( item.PCT_EXECUTADO.toFixed(2) >= 100 && item.PCT_EXECUTADO.toFixed(2) <= 102 ) 
                                            ? "success" 
                                            : ( item.PCT_EXECUTADO.toFixed(2) >= 85 && item.PCT_EXECUTADO.toFixed(2) < 100 ) 
                                            ? "warning" 
                                            : ( item.PCT_EXECUTADO.toFixed(2) < 85 ) 
                                            ? "primary"
                                            : "danger"
                                        }
                                        style={{ marginTop: 5 + 'px' }}
                                        >
                                        <span style={{ color: '#000000', fontSize: 13 + 'px' }}>
                                            {item.PCT_EXECUTADO.toFixed(2)} %
                                        </span>
                                        </Progress>
                                    </center>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                    { item.REFERENCIA != 'SARJETA' &&
                                    <>
                                        {/*item.QSALDO.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.')*/}{/*<br/>*/}
                                        {/*<span style={{ fontSize: 11 }}>*/}
                                        {(item.REFERENCIA != 'SARJETA') && `${(item.QSALDO.toFixed(2) / this.state.meter[item.REFERENCIA]).toFixed(1)} pallets`}
                                        {/*</span>*/}
                                    </> }
                                    </td>
                                </tr>
                                ))}

                                {this.state.provided.map((item, index) => (
                                (item.REFERENCIA != 'REPARODEMEIOFIO' && item.REFERENCIA != 'REPARODEPISO') &&
                                <tr key={index}>
                                    <td><img src={this.state.images[item.REFERENCIA]} style={{ width: 40 + 'px' }} /></td>
                                    <td>{item.DESCRICAO}</td>
                                    <td>
                                    <center>
                                        <Progress value={0}
                                        className="mb-3"
                                        color="green"
                                        style={{ marginTop: 5 + 'px' }}
                                        >
                                        <span style={{ color: '#000000', fontSize: 13 + 'px' }}>
                                            0 %
                                        </span>
                                        </Progress>
                                    </center>
                                    </td>
                                    <td>
                                    <center>
                                        <Progress value={0}
                                        className="mb-3"
                                        color="green"
                                        style={{ marginTop: 5 + 'px' }}
                                        >
                                        <span style={{ color: '#000000', fontSize: 13 + 'px' }}>
                                            0 %
                                        </span>
                                        </Progress>
                                    </center>
                                    </td>
                                    <td>0 pallet</td>
                                </tr>
                                ))}

                            </tbody>
                            </Table>
                        </CardBody>
                        </Card>
                    </Col>

                    <Col xs="12" lg="12">
                        <Card>
                        <CardHeader>
                            <strong>
                                MEDIÇÃO TOTAL DA OBRA
                            </strong>
                        </CardHeader>
                            <CardBody style={{ padding: 0 + 'px' }}>
                                <Table responsive style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                    <th style={{ width: 42 + '%' }}>Descrição</th>
                                    <th style={{ width: 8 + '%' }}>Previsto</th>
                                    <th style={{ width: 29 + '%' }}>Executado</th>
                                    <th style={{ width: 5 + '%' }}>Und.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.detailedPosition.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: item.MOB.indexOf("[ADITIVO") === 0 ? '#ecf7ea' : 'white' }}>
                                        <td>
                                        <BrowserView>
                                            {item.MOB}
                                        </BrowserView>
                                        <MobileView>
                                            {item.MOB.substr(0, 70)}
                                        </MobileView>
                                        </td>
                                        <td>{item.QTDORC.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.')}</td>
                                        <td>
                                        <center>
                                            <Progress value={item.PCT_EXECUTADO.toFixed(2)}
                                            className="mb-3"
                                            color={
                                                (item.PCT_EXECUTADO.toFixed(2) >= 100 && item.PCT_EXECUTADO.toFixed(2) <= 102)
                                                ? "success"
                                                : (item.PCT_EXECUTADO.toFixed(2) >= 85 && item.PCT_EXECUTADO.toFixed(2) < 100)
                                                ? "warning"
                                                : (item.PCT_EXECUTADO.toFixed(2) < 85)
                                                ? "primary"
                                                : "danger"
                                            }
                                            style={{ marginTop: 5 + 'px' }}
                                            >
                                            <span style={{ color: '#000000', fontSize: 13 + 'px' }}>
                                                {item.PCT_EXECUTADO.toFixed(2)} %
                                            </span>
                                            </Progress>
                                        </center>
                                        </td>
                                        <td>{item.UNID}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <strong>TRANSPORTES</strong>
                            </CardHeader>
                            <CardBody style={this.state.styleCardMovement}>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 1 + '%' }}></th>
                                            <th style={{ width: 2 + '%' }}></th>
                                            <th>Produto</th>
                                            <th>Veículo</th>
                                            <th>Placa</th>
                                            <th>Motorista</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.movement.map((item, index) => {
                                            let groupDate = false;
                                            if (index == 0) {
                                                date = item.DATA;
                                            }
                                            if (index != 0 && (date != item.DATA)) {
                                                date = item.DATA;
                                                groupDate = true;
                                            }
                                            return (
                                                <>
                                                    {(index == 0 || groupDate == true) &&
                                                        <tr>
                                                            <th colSpan={8}>
                                                                {moment(date).add(1, 'days').subtract('seconds', 3600).format('dddd') + ' ' + moment(date).add(1, 'days').subtract('seconds', 3600).format('LL')}
                                                            </th>
                                                        </tr>
                                                    }
                                                    <tr key={index}>
                                                        <td><img src={this.state.images[item.TIPOMOV]} style={{ width: 20 + 'px' }} /></td>
                                                        <td><img src={this.state.images[item.REFERENCIA]} style={{ width: 40 + 'px' }} /></td>
                                                        <td>{item.DESCRICAO}</td>
                                                        <td>{item.EQUIPAMENTO}</td>
                                                        <td>{item.CHASSI}</td>
                                                        <td>{item.NOME}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal isOpen={this.state.modalSchedule} toggle={() => this.toggleModalSchedule()} className={'modal-lg ' + this.props.className} /*style={{ maxWidth: isBrowser ? 90 + '%' : 100 + '%' }}*/>
                    <ModalHeader toggle={() => this.toggleModalSchedule()}>Medições</ModalHeader>
                    <ModalBody style={{ padding: 0 + 'px' }}>
                        {!this.state.loadingMeasurementSheet &&
                            <Calendar toggleModalViewPdf={this.toggleModalViewPdf} measurementSheet={this.state.measurementSheet} />}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleModalSchedule()}>Fechar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalViewPdf} toggle={() => this.toggleModalViewPdf()} className={'modal-lg ' + this.props.className} style={{ maxWidth: isBrowser ? 90 + '%' : 100 + '%' }}>
                    <ModalHeader toggle={() => this.toggleModalViewPdf()}>
                        Relatório diário
                    </ModalHeader>
                    <ModalBody style={{ padding: 0 + 'px' }}>
                            {this.state.itemDetailMeasurement.observ && 
                            <iframe 
                            src={String(this.state.itemDetailMeasurement.observ)} 
                            style={{ 
                                width: 100 + '%', 
                                height: isBrowser ? this.state.heightWindow - 200 : this.state.heightWindow - 115,
                                backgroundColor: '#666'
                            }}></iframe>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleModalViewPdf()}>Fechar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Construction;
