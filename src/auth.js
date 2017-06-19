import merge from 'lodash.merge';
import isEmpty from 'lodash.isempty';
import http from './';

function authRequestMethod(method, payload) {
  const authHeaders = http.defaultParams.authHeaders;

  if (isEmpty(authHeaders)) {
    throw new Error('You must define authHeaders before use these methods');
  }

  return http[method](merge({}, payload, { headers: authHeaders }));
}

export function get(payload) {
  return authRequestMethod('get', payload);
}

export function post(payload) {
  return authRequestMethod('post', payload);
}

export function put(payload) {
  return authRequestMethod('put', payload);
}

export function patch(payload) {
  return authRequestMethod('patch', payload);
}

export function deleteRequest(payload) {
  return authRequestMethod('delete', payload);
}

const httpAuth = ['get', 'post', 'put', 'patch', 'delete'].reduce((obj, methodName) => (
  merge({}, obj, { [methodName]: payload => authRequestMethod(methodName, payload) })
), {});

export default httpAuth;
