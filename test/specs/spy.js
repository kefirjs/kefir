const {stream, send} = require('../test-helpers')

describe('spy', () => {
  describe('adding', () => {
    it('should return the stream', () => {
      expect(stream().spy()).toBeStream()
    })

    it('should not activate the stream', () => {
      const a = stream().spy()
      expect(a).not.toBeActive()
    })
  })

  describe('removing', () => {
    it('should return the stream', () => {
      expect(stream().spy().offSpy()).toBeStream()
    })

    it('should not activate the stream', () => {
      const a = stream().spy().offSpy()
      expect(a).not.toBeActive()
    })
  })

  describe('console', () => {
    beforeEach(() => spyOn(console, 'log'))

    it('should have a default name', () => {
      const a = stream()
      a.spy()
      expect(a).toEmit([1, 2, 3], () => {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 3)
      })
    })

    it('should use the name', () => {
      const a = stream()
      a.spy('spied')
      expect(a).toEmit([1, 2, 3], () => {
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 3)
      })
    })

    it('should not log if the spy has been removed', () => {
      const a = stream()
      a.spy()
      a.offSpy()
      expect(a).toEmit([1, 2, 3], () => {
        send(a, [1, 2, 3])
        expect(console.log).not.toHaveBeenCalled()
      })
    })
  })
})
