import React, { Component, lazy, Suspense } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Label,
    Col,
    Row,
    Input,
    Button,
    Table,
} from 'reactstrap';
import 'chartjs-plugin-datalabels';

import * as crud from '../../../../services/crud';

import 'moment/locale/pt-br';
import { isBrowser } from 'react-device-detect';
const moment = require('moment');
moment.locale('pt-br');

class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    getUsers = async () => {
        try {
            let result = await crud.get('user');
            if( result.status == 200 ) {
                this.setState({
                    data: result.data
                });
            }
        } catch (error) {
            console.log(error);    
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Carregando...</div>

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <strong>USUÁRIOS</strong>
                            </CardHeader>
                            <CardBody style={{ padding: 0 + 'px' }}>
                                <Table responsive style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Permissão</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.role}</td>
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

export default Listing;
