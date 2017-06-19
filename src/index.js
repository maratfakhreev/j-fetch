import 'es6-promise/auto';
import 'whatwg-fetch';
import qs from 'qs';
import omit from 'lodash.omit';
import merge from 'lodash.merge';
import pickBy from 'lodash.pickby';
import isString from 'lodash.isstring';

const defaultParams = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  authHeaders: {},
  handleResponse(response) {
    const { status } = response;

    return (status >= 200 && status < 300) ?
      Promise.resolve(response) :
      Promise.reject(response);
  }
};

function filteredParams(params) {
  if (!params) return '';

  const filteredParams = pickBy(params, item => !!item);

  return `?${qs.stringify(filteredParams, { arrayFormat: 'brackets' })}`;
}

function requestBody(body, headers) {
  const isJSON = !!headers['Content-Type'] && headers['Content-Type'] === 'application/json';

  return (isJSON && !isString(body)) ? JSON.stringify(body) : body;
}

function request(payload) {
  const { url, query, ...options } = merge({}, { headers: http.defaultParams.headers }, payload);

  if (options.headers['Content-Type'] === false) {
    options.headers = omit(options.headers, 'Content-Type');
  }

  const { body, headers } = options;
  const urlWithQueryParams = url + filteredParams(query);
  const fetchOptions = merge({}, options, { body: requestBody(body, headers) });

  return fetch(urlWithQueryParams, fetchOptions).then(http.defaultParams.handleResponse);
}

export function init(params) {
  http.defaultParams = merge({}, defaultParams, params);
}

export function get(payload) {
  return request(
    merge({}, payload, { method: 'GET' })
  );
}

export function post(payload) {
  return request(
    merge({}, payload, { method: 'POST' })
  );
}

export function put(payload) {
  return request(
    merge({}, payload, { method: 'PUT' })
  );
}

export function patch(payload) {
  return request(
    merge({}, payload, { method: 'PATCH' })
  );
}

export function deleteRequest(payload) {
  return request(
    merge({}, payload, { method: 'DELETE' })
  );
}

const http = {
  init,
  defaultParams,
  get,
  post,
  put,
  patch,
  delete: deleteRequest
};

export default http;
