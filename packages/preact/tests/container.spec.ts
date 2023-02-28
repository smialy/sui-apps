import { assert } from 'chai';
import { CommonContainer } from '../src/container';

describe('new Container()', function () {
  it('should throw error for missing key in empty container', function () {
    const container = new CommonContainer();
    assert.throws(() => {
      container.get('key');
    }, /Not found "key" entry/)
  });

  it('should throw error for missing key', function () {
    const container = new CommonContainer();
    container.register({name: 'foo', value: 'bar' });
    assert.throws(() => {
      container.get('key');
    }, /Not found "key" entry/)
  });

  it('should return simple value', function () {
    const container = new CommonContainer();
    container.register({name: 'foo', value: 'bar' });
    assert.equal(container.get('foo'), 'bar');
  });

  it('should return value from factory', function () {
    const container = new CommonContainer();
    container.register({name: 'foo', factory: () => 'bar' });
    assert.equal(container.get('foo'), 'bar');
  });

  it('should throw error for missing dependecy in factory', function () {
    const container = new CommonContainer();
    assert.throws(() => {
      container.register({name: 'foo', factory: () => 'bar' , deps: ['name']});
    }, /Not found "name" dependency for "foo" provider/)
  });

  it('should return value from factory with dependency', function () {
    const container = new CommonContainer();
    container.register({ name: 'name', value: 'value' });
    container.register({ name: 'foo', factory: ({ name }) => `bar:${name}` , deps: ['name']});
    assert.equal(container.get('foo'), 'bar:value');
  });
});
