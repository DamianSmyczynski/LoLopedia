import { simplifyString } from './simplify-string.helper';

describe('simplifyString', () => {
  it('should remove spaces and replace string with lower case', () => {
    expect(simplifyString('Test Player Name')).toBe('testplayername');
  });
});
