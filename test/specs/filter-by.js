const {stream, prop, send, expect} = require('../test-helpers')

describe('filterBy', () => {
  describe('common', () => {
    it('errors should flow', () => {
      let a = stream()
      let b = stream()
      expect(a.filterBy(b)).to.flowErrors(a)
      a = stream()
      b = stream()
      expect(a.filterBy(b)).to.flowErrors(b)
      a = prop()
      b = stream()
      expect(a.filterBy(b)).to.flowErrors(a)
      a = prop()
      b = stream()
      expect(a.filterBy(b)).to.flowErrors(b)
      a = stream()
      b = prop()
      expect(a.filterBy(b)).to.flowErrors(a)
      a = stream()
      b = prop()
      expect(a.filterBy(b)).to.flowErrors(b)
      a = prop()
      b = prop()
      expect(a.filterBy(b)).to.flowErrors(a)
      a = prop()
      b = prop()
      expect(a.filterBy(b)).to.flowErrors(b)
    })
  })

  describe('stream, stream', () => {
    it('should return a stream', () => {
      expect(stream().filterBy(stream())).to.be.observable.stream()
    })

    it('should activate/deactivate sources', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () => {
      expect(send(stream(), ['<end>']).filterBy(stream())).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended', () => {
      expect(stream().filterBy(send(stream(), ['<end>']))).to.emit(['<end:current>'])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit(['<end>'], () => send(b, [false, '<end>']))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(a, [1, 2]))
    })

    it('should filter values as expected', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([3, 4, 7, 8, '<end>'], () => {
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
      })
    })
  })

  describe('stream, property', () => {
    it('should return a stream', () => {
      expect(stream().filterBy(prop())).to.be.observable.stream()
    })

    it('should activate/deactivate sources', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () => {
      expect(send(stream(), ['<end>']).filterBy(prop())).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended and has no current', () => {
      expect(stream().filterBy(send(prop(), ['<end>']))).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended and has falsey current', () => {
      expect(stream().filterBy(send(prop(), [false, '<end>']))).to.emit(['<end:current>'])
    })

    it('should not be ended if secondary was ended but has truthy current', () => {
      expect(stream().filterBy(send(prop(), [true, '<end>']))).to.emit([])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit(['<end>'], () => send(b, [false, '<end>']))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(a, [1, 2]))
    })

    it('should filter values as expected', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([3, 4, 7, 8, '<end>'], () => {
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
      })
    })
  })

  describe('property, stream', () => {
    it('should return a property', () => {
      expect(prop().filterBy(stream())).to.be.observable.property()
    })

    it('should activate/deactivate sources', () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () => {
      expect(send(prop(), ['<end>']).filterBy(stream())).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended', () => {
      expect(prop().filterBy(send(stream(), ['<end>']))).to.emit(['<end:current>'])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit(['<end>'], () => send(b, [false, '<end>']))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(a, [1, 2]))
    })

    it('should filter values as expected', () => {
      const a = send(prop(), [0])
      const b = stream()
      expect(a.filterBy(b)).to.emit([3, 4, 7, 8, '<end>'], () => {
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
      })
    })
  })

  describe('property, property', () => {
    it('should return a property', () => {
      expect(prop().filterBy(prop())).to.be.observable.property()
    })

    it('should activate/deactivate sources', () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () => {
      expect(send(prop(), ['<end>']).filterBy(prop())).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended and has no current', () => {
      expect(prop().filterBy(send(prop(), ['<end>']))).to.emit(['<end:current>'])
    })

    it('should be ended if secondary was ended and has falsey current', () => {
      expect(prop().filterBy(send(prop(), [false, '<end>']))).to.emit(['<end:current>'])
    })

    it('should not be ended if secondary was ended but has truthy current', () => {
      expect(prop().filterBy(send(prop(), [true, '<end>']))).to.emit([])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit(['<end>'], () => send(b, [false, '<end>']))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(a, [1, 2]))
    })

    it('should filter values as expected', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [true])
      expect(a.filterBy(b)).to.emit([{current: 0}, 3, 4, 7, 8, '<end>'], () => {
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
      })
    })
  })
})
