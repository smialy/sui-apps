import { assert } from 'chai';
import { createApp } from '../src/app';

describe('createApp()', function () {
  it('should throw error for missing name', function () {
    assert.throws(() => {
        createApp('');
    }, /Missing "name" in options/)
  });

  it('should propagate cascade provider', function () {
    const root = createApp('root', {
      providers: [{
        name: 'foo',
        factory: () => 'bar',
        cascade: true,
      }]
    });
    root.registerApp('a');
    const app = root.instantiateApp('a');

    assert.equal(app.get('foo'), 'bar');
  });

});