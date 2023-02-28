import { assert } from 'chai';
import { exec } from '../src/utils';

describe('exec()', function () {
  it('should match the same url (exact=true)', function () {
    const location = l("/a/b/c");
    const options = o("/a/b/c", true);
    assert.deepEqual(exec(location, options), {});
  });
  it('should match the same url (exact=false)', function () {
    const location = l("/a/b/c");
    const options = o("/a/b/c", true);
    assert.deepEqual(exec(location, options), {});
  });
  it('should not match incorect url (exact=true)', function () {
    const location = l("/a/b/c");
    const options = o("/a/b", true);
    assert.equal(exec(location, options), null);
  });
  it('should match url (exact=false)', function () {
    const location = l("/a/b/c");
    const options = o("/a/b/", false);
    assert.deepEqual(exec(location, options), {});
  });
  it('should match empty url (exact=false)', function () {
    const location = l("/a/b/c");
    const options = o(null, false);
    assert.deepEqual(exec(location, options), {});
  });

  it('should not match empty url (exact=true)', function () {
    const location = l("/a/b/c");
    const options = o(null, true);
    assert.deepEqual(exec(location, options), null);
  });
});

const l = (pathname: string) => ({
  hash: "",
  pathname,
  key:"n7ozly7s",
  search: "",
  state: null,
});

const o = (path: string, exact: boolean = false) => ({
  exact,
  path,
})