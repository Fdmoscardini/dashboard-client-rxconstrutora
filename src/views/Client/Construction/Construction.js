import React, { Component, lazy, Suspense } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Progress,
    Row,
    Table,
} from 'reactstrap';
import 'chartjs-plugin-datalabels';

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
            styleCardMovement: { padding: 0 + 'px' },
            images: {
                'MEIO-FIO-65': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/meiofio.png',
                'MEIO-FIO-80': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/meiofio.png',
                'T16F6N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesN.png',
                'T16F8N': 'http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/06/16facesN.png',
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
                'T16F6N': 15,
                'T16F8N': 11,
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
            let lat = localStorage.getItem('latitude');
            let lng = localStorage.getItem('longitude');

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

    componentDidMount(){
        setInterval(() => {
            this.setState({
                curTime: new Date().toLocaleString()
            })
        }, 1000);

        let id = localStorage.getItem('idConstruction');
        this.getWeather();
        this.getTotalProduction(id);
        this.getStockConstruction(id);
        this.getDetailedPosition(id);
        this.getConstruction(id);
        this.getEmployees(id);
        this.getMovement(id);
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
                                        <h4 style={{ marginBottom: 15 }}>{this.state.construction.DESCRICAO}</h4>
                                        <h5 style={{ marginBottom: 15 }}>{moment().format('LLLL')}</h5>
                                    </Col>
                                    <Col xs="12" md="2" xl="2">
                                        <center>
                                            <img src={`http://www.rxconstrutora.com.br/site/wp-content/uploads/2020/08/${this.state.weather.weather[0].icon}.png`} style={{width: 120, marginBottom: 10}} /><br />
                                            <h3>{this.state.weather.weather[0].description}</h3>
                                        </center>
                                    </Col>
                                    <Col xs="12" md="3" xl="3" style={{paddingTop: 18}}>
                                        <h4 style={{ marginBottom: 15 }}>Máx {this.state.weather.main.temp_max.toFixed(0)} °C</h4>
                                        <h4 style={{ marginBottom: 15 }}>Min &nbsp;{this.state.weather.main.temp_min.toFixed(0)} °C</h4>
                                        <h4 style={{ marginBottom: 15 }}>Vento {this.state.weather.wind.speed} metros/seg</h4>
                                    </Col>
                                    <Col xs="12" md="12" xl="12">
                                        <hr />
                                        <h5>{this.state.employees.length} funcionários trabalhando na obra</h5>
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
                            <strong>SITUAÇÃO DOS PRODUTOS</strong>
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
                                    <td>{item.DESCRICAO}<br /><span style={{ fontSize: 11 }}>{item.REFERENCIA != 'SARJETA' && `(${this.state.meter[item.REFERENCIA] + ' '} / pallet)`}</span></td>
                                    <td>{item.QTDE.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.')}</td>
                                    <td>0</td>
                                    <td>
                                    <center>0
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
                                    <center>0
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
                                    <td>0</td>
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
                                POSIÇÃO DETALHADA DA OBRA
                            </strong>
                        </CardHeader>
                            <CardBody style={{ padding: 0 + 'px' }}>
                                <Table responsive>
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
                                    <tr key={index}>
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
                                            <th>Motorista</th>
                                            <th>Qtd.</th>
                                            <th style={{ width: 3 + '%' }}>Unid.</th>
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
                                                            <th colSpan={7}>
                                                                {moment(date).add(1, 'days').subtract('seconds', 3600).format('dddd') + ' ' + moment(date).add(1, 'days').subtract('seconds', 3600).format('LL')}
                                                            </th>
                                                        </tr>
                                                    }
                                                    <tr key={index}>
                                                        <td><img src={this.state.images[item.TIPOMOV]} style={{ width: 20 + 'px' }} /></td>
                                                        <td><img src={this.state.images[item.REFERENCIA]} style={{ width: 40 + 'px' }} /></td>
                                                        <td>{item.DESCRICAO}</td>
                                                        <td>{item.EQUIPAMENTO}</td>
                                                        <td>{item.NOME}</td>
                                                        <td>{item.QTDMOV}</td>
                                                        <td>{item.SIGLA}</td>
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

                {/*<Row>
                    <Col xs="12" lg="6">
                        <Card>
                        <CardHeader>
                            <strong>
                                FUNCIONÁRIOS
                            </strong>
                        </CardHeader>
                            <CardBody style={{ padding: 0 + 'px' }}>
                                <Table responsive>
                                <thead>
                                    <tr>
                                        <th style={{ width: 42 + '%' }}>NOME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.employees.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.NOME}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>*/}
            </div>
        );
    }
}

export default Construction;
