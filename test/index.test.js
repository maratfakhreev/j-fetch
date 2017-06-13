import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import jFetch from '../src';

describe('jFetch', () => {
  const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  afterEach(fetchMock.restore);

  const itBehavesLikeHttpAction = options => {
    const httpFunction = jFetch[options.httpFunction];

    it('calls fetch with default options', () => {
      const mock = fetchMock.mock(
        '/some_url',
        {},
        {
          headers: jsonHeaders,
          ...options
        }
      );

      httpFunction({ url: '/some_url' });

      expect(mock.called()).toBeTruthy();
    });

    it('calls fetch with passed options', () => {
      const mock = fetchMock.mock(
        '/some_url?option1=foo&option2=bar',
        {},
        {
          headers: Object.assign({}, jsonHeaders, { 'X-My-Header': 123 }),
          body: {
            attr: 'value'
          },
          ...options
        }
      );

      httpFunction({
        url: '/some_url',
        headers: {
          'X-My-Header': 123
        },
        body: {
          attr: 'value'
        },
        query: {
          option1: 'foo',
          option2: 'bar'
        },
        ...options
      });

      expect(mock.called()).toBeTruthy();
    });

    it('returns resolved promise if success callback is not passed', () => {
      fetchMock.mock(
        '/some_url',
        {
          status: 200,
          body: {
            user_id: 1
          }
        }
      );

      const successSpy = sinon.spy();
      httpFunction({ url: '/some_url' }).catch(() => {}).then(successSpy)
        .then(() => expect(successSpy.called).toBeTruthy());
    });

    it('returns rejected promise if error callback is not passed', () => {
      fetchMock.mock(
        '/some_url',
        {
          status: 422,
          body: {
            errors: []
          }
        }
      );

      const errorSpy = sinon.spy();
      httpFunction({ url: '/some_url' }).then(() => {}).catch(errorSpy)
        .then(() => expect(errorSpy.called).toBeTruthy());
    });
  };

  describe('.get', () => {
    itBehavesLikeHttpAction({
      method: 'GET',
      httpFunction: 'get'
    });
  });

  describe('.post', () => {
    itBehavesLikeHttpAction({
      method: 'POST',
      httpFunction: 'post'
    });
  });

  describe('.put', () => {
    itBehavesLikeHttpAction({
      method: 'PUT',
      httpFunction: 'put'
    });
  });

  describe('.patch', () => {
    itBehavesLikeHttpAction({
      method: 'PATCH',
      httpFunction: 'patch'
    });
  });

  describe('.delete', () => {
    itBehavesLikeHttpAction({
      method: 'DELETE',
      httpFunction: 'delete'
    });
  });
});
