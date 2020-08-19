import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import * as crud from '../../services/crud';

class Login extends Component {

  state = {
    email: '',
    password: '',
    error: '',
  }

  login = async () => {
    try {
      if(!this.state.email && !this.state.password) return;

      let result = await crud.post('user/authenticate', {
        email: this.state.email,
        password: this.state.password
      });

      if( result.status == 200 ) {
        await localStorage.setItem('client_id', result.data.id);
        await localStorage.setItem('client_name', result.data.name);
        await localStorage.setItem('client_email', result.data.email);
        await localStorage.setItem('client_token', result.data.token);
        await localStorage.setItem('client_role', result.data.role);
        await localStorage.setItem('client_idConstruction', result.data.idConstruction);
        await localStorage.setItem('client_latitude', result.data.latitude);
        await localStorage.setItem('client_longitude', result.data.longitude);
        await localStorage.setItem('client_responsible', result.data.responsible);
        await localStorage.setItem('client_contact', result.data.contact);
        window.location.href = '/';
      } else {
        this.setState({ 'error': 'Usuário ou senha incorretos' });
      }
    } catch (error) {
      this.setState({ 'error': 'Usuário ou senha incorretos' });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h2 style={{marginBottom: 14}}>Autenticação</h2>
                      { this.state.error != '' && <p className="text-danger">{this.state.error}</p> }
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                          type="text" 
                          refs="email"
                          placeholder="Usuário" 
                          autoComplete="usuário"
                          value={this.state.email}
                          onChange={(value) => this.setState({
                            email: value.target.value.toLowerCase()
                          })} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                          type="password" 
                          placeholder="Senha" 
                          autoComplete="current-password" 
                          value={this.state.password}
                          onChange={(value) => this.setState({
                            password: value.target.value
                          })} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={() => this.login()}>Acessar</Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Gestão à Vista</h2>
                      <p>Sistema para gerenciamento das obras. Projeto desenvolvido e mantido pela Rx Construtora.</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
