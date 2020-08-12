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

class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    getUsers = async () => {
        let result = await crud.get('user');
        console.log(result);
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
                                <strong>CRIAR USUÁRIO</strong>
                            </CardHeader>
                            <CardBody style={{ padding: 0 + 'px' }}>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Create;
