import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from 'reactstrap';

import * as crud from '../../../services/crud';

import { isBrowser } from 'react-device-detect';
const moment = require('moment');
moment.locale('pt-br');

class ListConstruction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            constructions: [],
        };
    }

    getUser = async () => {
        try {
            let id = localStorage.getItem('client_id');
            let response = await crud.get('user', id);
            if( response.status == 200 ) {
                console.log(response);
                this.setState({
                    constructions: response.data.constructions
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    goDetail = (id, lat, lng, contract, responsible) => {
        this.props.history.push(`/list-construction/construction/${id}/${lat}/${lng}/${btoa(contract)}/${btoa(responsible)}`);
    }

    componentDidMount() {
        this.getUser();
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Carregando...</div>

    render() {
        return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" md="12" xl="12">
                    <Card>
                        <CardHeader>
                            <strong>MINHAS OBRAS</strong>
                        </CardHeader>
                        <CardBody style={{ padding: 0 + 'px' }}>
                            <Table>
                                <tbody>
                                    {this.state.constructions.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ width: 75 + '%' }}>
                                                <Row className="align-items-center">
                                                    <Col col="12" sm="12" md="12" xl className="mb-12 mb-xl-0" style={{ marginTop: 2, marginBotom: 2 }}>
                                                        {item.name}
                                                    </Col>
                                                </Row>
                                            </td>
                                            <td style={{ width: 25 + '%' }}>
                                                <Row className="align-items-center">
                                                    <Button 
                                                        color="secondary" 
                                                        onClick={() => this.goDetail(item.idConstruction, item.latitude, item.longitude, item.contact, item.responsible)}>
                                                        Visualizar
                                                    </Button>
                                                </Row>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
        );
    }
}

export default ListConstruction;