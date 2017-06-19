import merge from 'lodash.merge';
import isEmpty from 'lodash.isempty';
import request, { defaultParams } from './';

function authRequestMethod(method, payload) {
  if (isEmpty(defaultParams.authHeaders)) {
    throw new Error('You must define authHeaders before use these methods');
  }

  return request[method](merge({}, payload, { headers: defaultParams.authHeaders }));
}

const httpAuth = ['get', 'post', 'put', 'patch', 'delete'].reduce((obj, methodName) => (
  merge({}, obj, { [methodName]: payload => authRequestMethod(methodName, payload) })
), {});

export default httpAuth;
