import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import jFetch from '../src';
import jFetchAuth from '../src/auth';

describe('jFetch', () => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  afterEach(fetchMock.restore);

  const itBehavesLikeHttpAction = ({ method }) => {
    const methodName = method.toLowerCase();
    const httpMethod = jFetch[methodName];

    it('calls fetch with default options', () => {
      const mock = fetchMock.mock(
        '/some_url',
        {},
        { headers, method }
      );

      httpMethod({ url: '/some_url' });

      expect(mock.called()).toBeTruthy();
    });

    it('calls fetch with passed options', () => {
      const mock = fetchMock.mock(
        '/some_url?option1=foo&option2=bar',
        {},
        {
          headers: Object.assign({}, headers, { 'X-My-Header': 123 }),
          body: {
            attr: 'value'
          },
          method
        }
      );

      httpMethod({
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
        method
      });

      expect(mock.called()).toBeTruthy();
    });

    it('calls fetch without Content-Type if Content-Type header has set to false', () => {
      const mock = fetchMock.mock(
        '/some_url',
        {
          headers: {
            'X-My-Header': 123,
            'Accept': 'application/json'
          },
          method
        }
      );

      httpMethod({
        url: '/some_url',
        headers: {
          'X-My-Header': 123,
          'Accept': 'application/json',
          'Content-Type': false
        },
        method
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
      httpMethod({ url: '/some_url' }).catch(() => {}).then(successSpy)
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
      httpMethod({ url: '/some_url' }).then(() => {}).catch(errorSpy)
        .then(() => expect(errorSpy.called).toBeTruthy());
    });
  };

  describe('.get', () => {
    itBehavesLikeHttpAction({ method: 'GET' });
  });

  describe('.post', () => {
    itBehavesLikeHttpAction({ method: 'POST' });
  });

  describe('.put', () => {
    itBehavesLikeHttpAction({ method: 'PUT' });
  });

  describe('.patch', () => {
    itBehavesLikeHttpAction({ method: 'PATCH' });
  });

  describe('.delete', () => {
    itBehavesLikeHttpAction({ method: 'DELETE' });
  });

  describe('auth request', () => {
    const itBehavesLikeHttpAuthAction = ({ method }) => {
      jFetch.init({
        authHeaders: {
          'X-User-Email': 'some@example.com',
          'X-User-Token': 'generatedtoken'
        }
      });

      const methodName = method.toLowerCase();
      const httpAuthMethod = jFetchAuth[methodName];

      it('calls fetch with authHeaders', () => {
        const mock = fetchMock.mock(
          '/some_url',
          {},
          {
            headers: Object.assign(
              {},
              headers,
              {
                'X-User-Email': 'some@example.com',
                'X-User-Token': 'generatedtoken'
              }
            ),
            method
          }
        );

        httpAuthMethod({ url: '/some_url' });

        expect(mock.called()).toBeTruthy();
      });
    };

    describe('.get', () => {
      itBehavesLikeHttpAuthAction({ method: 'GET' });
    });

    describe('.post', () => {
      itBehavesLikeHttpAuthAction({ method: 'POST' });
    });

    describe('.put', () => {
      itBehavesLikeHttpAuthAction({ method: 'PUT' });
    });

    describe('.patch', () => {
      itBehavesLikeHttpAuthAction({ method: 'PATCH' });
    });

    describe('.delete', () => {
      itBehavesLikeHttpAuthAction({ method: 'DELETE' });
    });
  });
});
