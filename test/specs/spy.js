/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, send} = require('../test-helpers')

describe('spy', function() {
  describe('adding', function() {
    it('should return the stream', () => expect(stream().spy()).toBeStream())

    return it('should not activate the stream', function() {
      const a = stream().spy()
      return expect(a).not.toBeActive()
    })
  })

  describe('removing', function() {
    it('should return the stream', () => expect(stream().spy().offSpy()).toBeStream())

    return it('should not activate the stream', function() {
      const a = stream().spy().offSpy()
      return expect(a).not.toBeActive()
    })
  })

  return describe('console', function() {
    beforeEach(() => spyOn(console, 'log'))

    it('should have a default name', function() {
      const a = stream()
      a.spy()
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 2)
        return expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 3)
      })
    })

    it('should use the name', function() {
      const a = stream()
      a.spy('spied')
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 2)
        return expect(console.log).toHaveBeenCalledWith('spied', '<value>', 3)
      })
    })

    return it('should not log if the spy has been removed', function() {
      const a = stream()
      a.spy()
      a.offSpy()
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        return expect(console.log).not.toHaveBeenCalled()
      })
    })
  })
})
