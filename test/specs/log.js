/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, send} = require('../test-helpers.coffee')

describe('log', function() {
  describe('adding', function() {
    it('should return the stream', () => expect(stream().log()).toBeStream())

    return it('should activate the stream', function() {
      const a = stream().log()
      return expect(a).toBeActive()
    })
  })

  describe('removing', function() {
    it('should return the stream', () => expect(stream().log().offLog()).toBeStream())

    return it('should deactivate the stream', function() {
      const a = stream().log().offLog()
      return expect(a).not.toBeActive()
    })
  })

  return describe('console', function() {
    beforeEach(() => spyOn(console, 'log'))

    it('should have a default name', function() {
      const a = stream()
      a.log()
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 2)
        return expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 3)
      })
    })

    it('should use the name', function() {
      const a = stream()
      a.log('logged')
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('logged', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('logged', '<value>', 2)
        return expect(console.log).toHaveBeenCalledWith('logged', '<value>', 3)
      })
    })

    return it('should not log if the log has been removed', function() {
      const a = stream()
      a.log()
      a.offLog()
      return expect(a).toEmit([1, 2, 3], function() {
        send(a, [1, 2, 3])
        return expect(console.log).not.toHaveBeenCalled()
      })
    })
  })
})
