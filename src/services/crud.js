//servico API
import { apiInstance } from "./api";

/**
 * Cancela a requisição atual
 * 
 * @return {void}
 */
export const cancel = () => {
    this._source.cancel('Operação cancelada.')
};

/**
 * Busca id e token no Storage para ser utilizado nas requisicoes
 * 
 * @return {json} [id e token para autenticacao]
 */
const getStorage = async () => {
    const token = await localStorage.getItem('client_token');
    return {
        token: token ? token : '',
    }
};

/**
 * Retorna os dados da API
 * 
 * @param {string} model [nome do servico na api]
 * @param {int} id [id do registro a ser retornado]
 * @param {string} uri [url personalizada]
 * @return {json}
 */
export const get = async (model, id = undefined, uri = undefined) => {

    let auth = await getStorage();

    const api = apiInstance(auth.token);
    let url = '/' + model;

    //url personalizada
    if (uri) {
        url = '';
        url = url + '/' + uri;
    } else {
        //caso tenha o id do registro
        if (id) {
            url = url + '/' + id;
        }
    }

    try {
        return await api.get(url);
    } catch (error) {
        console.log(error);
    }
};

/**
 * Registra os dados na API
 * 
 * @param {string} model [nome do servico na api]
 * @param {json} data [json com os dados para registrar]
 * @param {string} uri [url personalizada]
 * @return {json}
 */
export const post = async (model, data, uri = undefined) => {

    let auth = await getStorage();

    const api = apiInstance(auth.token);
    let url = '/' + model;
    //url personalizada
    if (uri) {
        url = url + '/' + uri;
    }

    try {
        return await api.post(url, data);
    } catch (error) {
        console.log(error);
    }
};

/**
 * Atualiza os dados da API
 * 
 * @param {string} model [nome do servico na api]
 * @param {json} data [json com os dados para registrar]
 * @param {int} id [id do registro a ser atualizado]
 * @param {string} uri [url personalizada]
 * @return {json}
 */
export const put = async (model, data, id = undefined, uri = undefined) => {

    let auth = await getStorage();

    const api = apiInstance(auth.token);
    let url = '/' + model;
    //url personalizada
    if (uri) {
        url = url + '/' + uri;
    } else {
        //caso exista o id do registro
        if (id) {
            url = url + '/' + id;
        }
    }

    try {
        return await api.put(url, data);
    } catch (error) {
    }
};

/**
 * Deleta os dados na API
 * 
 * @param {string} model [nome do servico na api]
 * @param {int} id [id do registro para excluir]
 * @param {string} uri [url personalizada]
 * @return {json}
 */
export const exclude = async (model, id = undefined, uri = undefined) => {

    let auth = await getStorage();

    const api = apiInstance(auth.token);
    let url = '/' + model;
    //url personalizada
    if (uri) {
        url = url + '/' + uri;
    } else {
        //id do registro
        url = url + '/' + id;
    }

    try {
        return await api.delete(url);
    } catch (error) {
    }
};