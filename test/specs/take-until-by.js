const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('takeUntilBy', () => {
  describe('common', () =>
    it('errors should flow', () => {
      let a = stream()
      let b = stream()
      expect(a.takeUntilBy(b)).to.flowErrors(a)
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).to.flowErrors(b)
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).to.flowErrors(a)
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).to.flowErrors(b)
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).to.flowErrors(a)
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).to.flowErrors(b)
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).to.flowErrors(a)
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).to.flowErrors(b)
    }))

  describe('stream, stream', () => {
    it('should return a stream', () => {
      expect(stream().takeUntilBy(stream())).to.be.observable.stream()
    })

    it('should activate/deactivate sources', () => {
      const a = stream()
      const b = stream()
      expect(a.takeUntilBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(stream(), ['<end>']).takeUntilBy(stream())).to.emit(['<end:current>']))

    it('should not be ended if secondary was ended', () =>
      expect(stream().takeUntilBy(send(stream(), ['<end>']))).to.emit([]))

    it('should not end when secondary ends if there was no values from it', () => {
      const a = stream()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([], () => send(b, ['<end>']))
    })

    it('should end on first any value from secondary', () => {
      const a = stream()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit(['<end>'], () => send(b, [0]))
    })

    it('should emit values from primary until first value from secondary', () => {
      const a = stream()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([1, 2], () => send(a, [1, 2]))
    })

    it('should take values as expected', () => {
      const a = stream()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([3, 4, '<end>'], () => {
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
      })
    })
  })

  describe('stream, property', () => {
    it('should return a stream', () => {
      expect(stream().takeUntilBy(prop())).to.be.observable.stream()
    })

    it('should activate/deactivate sources', () => {
      const a = stream()
      const b = prop()
      expect(a.takeUntilBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(stream(), ['<end>']).takeUntilBy(prop())).to.emit(['<end:current>']))

    it('should not be ended if secondary was ended and has no current', () =>
      expect(stream().takeUntilBy(send(prop(), ['<end>']))).to.emit([]))

    it('should be ended if secondary was ended and has any current', () =>
      expect(stream().takeUntilBy(send(prop(), [0, '<end>']))).to.emit(['<end:current>']))

    it('should end on first any value from secondary', () => {
      const a = stream()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit(['<end>'], () => send(b, [0]))
    })

    it('should not end when secondary ends there was no values from it', () => {
      const a = stream()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([], () => send(b, ['<end>']))
    })

    it('should emit values from primary until first value from secondary', () => {
      const a = stream()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([1, 2], () => send(a, [1, 2]))
    })

    it('should take values as expected', () => {
      const a = stream()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([3, 4, '<end>'], () => {
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
      })
    })
  })

  describe('property, stream', () => {
    it('should return a property', () => {
      expect(prop().takeUntilBy(stream())).to.be.observable.property()
    })

    it('should activate/deactivate sources', () => {
      const a = prop()
      const b = stream()
      expect(a.takeUntilBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(prop(), ['<end>']).takeUntilBy(stream())).to.emit(['<end:current>']))

    it('should not be ended if secondary was ended', () =>
      expect(prop().takeUntilBy(send(stream(), ['<end>']))).to.emit([]))

    it('should not end when secondary ends if there was no values from it', () => {
      const a = prop()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([], () => send(b, ['<end>']))
    })

    it('should end on first any value from secondary', () => {
      const a = prop()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit(['<end>'], () => send(b, [0]))
    })

    it('should emit values from primary until first value from secondary', () => {
      const a = prop()
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([1, 2], () => send(a, [1, 2]))
    })

    it('should take values as expected', () => {
      const a = send(prop(), [0])
      const b = stream()
      expect(a.takeUntilBy(b)).to.emit([{current: 0}, 3, 4, '<end>'], () => {
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
      })
    })
  })

  describe('property, property', () => {
    it('should return a property', () => expect(prop().takeUntilBy(prop())).to.be.observable.property())

    it('should activate/deactivate sources', () => {
      const a = prop()
      const b = prop()
      expect(a.takeUntilBy(b)).to.activate(a, b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(prop(), ['<end>']).takeUntilBy(prop())).to.emit(['<end:current>']))

    it('should not be ended if secondary was ended and has no current', () =>
      expect(prop().takeUntilBy(send(prop(), ['<end>']))).to.emit([]))

    it('should be ended if secondary was ended and has any current', () =>
      expect(prop().takeUntilBy(send(prop(), [0, '<end>']))).to.emit(['<end:current>']))

    it('should end on first any value from secondary', () => {
      const a = prop()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit(['<end>'], () => send(b, [0]))
    })

    it('should not end when secondary ends if there was no values from it', () => {
      const a = prop()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([], () => send(b, ['<end>']))
    })

    it('should emit values from primary until first value from secondary', () => {
      const a = prop()
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([1, 2], () => send(a, [1, 2]))
    })

    it('should take values as expected', () => {
      const a = send(prop(), [0])
      const b = prop()
      expect(a.takeUntilBy(b)).to.emit([{current: 0}, 3, 4, '<end>'], () => {
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
      })
    })
  })
})
