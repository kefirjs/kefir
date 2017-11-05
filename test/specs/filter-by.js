const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

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
      expect(send(stream(), [end()]).filterBy(stream())).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended', () => {
      expect(stream().filterBy(send(stream(), [end()]))).to.emit([end({current: true})])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([end()], () => send(b, [value(false), end()]))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(b, [value(true), end()]))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(a, [value(1), value(2)]))
    })

    it('should filter values as expected', () => {
      const a = stream()
      const b = stream()
      expect(a.filterBy(b)).to.emit([value(3), value(4), value(7), value(8), end()], () => {
        send(b, [value(true)])
        send(a, [value(3), value(4)])
        send(b, [value(0)])
        send(a, [value(5), value(6)])
        send(b, [value(1)])
        send(a, [value(7), value(8)])
        send(b, [value(false)])
        send(a, [value(9), end()])
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
      expect(send(stream(), [end()]).filterBy(prop())).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended and has no current', () => {
      expect(stream().filterBy(send(prop(), [end()]))).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended and has falsey current', () => {
      expect(stream().filterBy(send(prop(), [value(false), end()]))).to.emit([end({current: true})])
    })

    it('should not be ended if secondary was ended but has truthy current', () => {
      expect(stream().filterBy(send(prop(), [value(true), end()]))).to.emit([])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([end()], () => send(b, [value(false), end()]))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(b, [value(true), end()]))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(a, [value(1), value(2)]))
    })

    it('should filter values as expected', () => {
      const a = stream()
      const b = prop()
      expect(a.filterBy(b)).to.emit([value(3), value(4), value(7), value(8), end()], () => {
        send(b, [value(true)])
        send(a, [value(3), value(4)])
        send(b, [value(0)])
        send(a, [value(5), value(6)])
        send(b, [value(1)])
        send(a, [value(7), value(8)])
        send(b, [value(false)])
        send(a, [value(9), end()])
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
      expect(send(prop(), [end()]).filterBy(stream())).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended', () => {
      expect(prop().filterBy(send(stream(), [end()]))).to.emit([end({current: true})])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit([end()], () => send(b, [value(false), end()]))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(b, [value(true), end()]))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = prop()
      const b = stream()
      expect(a.filterBy(b)).to.emit([], () => send(a, [value(1), value(2)]))
    })

    it('should filter values as expected', () => {
      const a = send(prop(), [value(0)])
      const b = stream()
      expect(a.filterBy(b)).to.emit([value(3), value(4), value(7), value(8), end()], () => {
        send(b, [value(true)])
        send(a, [value(3), value(4)])
        send(b, [value(0)])
        send(a, [value(5), value(6)])
        send(b, [value(1)])
        send(a, [value(7), value(8)])
        send(b, [value(false)])
        send(a, [value(9), end()])
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
      expect(send(prop(), [end()]).filterBy(prop())).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended and has no current', () => {
      expect(prop().filterBy(send(prop(), [end()]))).to.emit([end({current: true})])
    })

    it('should be ended if secondary was ended and has falsey current', () => {
      expect(prop().filterBy(send(prop(), [value(false), end()]))).to.emit([end({current: true})])
    })

    it('should not be ended if secondary was ended but has truthy current', () => {
      expect(prop().filterBy(send(prop(), [value(true), end()]))).to.emit([])
    })

    it('should end when secondary ends if last value from it was falsey', () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit([end()], () => send(b, [value(false), end()]))
    })

    it("should not end when secondary ends if last value from it wasn't falsey", () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(b, [value(true), end()]))
    })

    it('should ignore values from primary until first value from secondary', () => {
      const a = prop()
      const b = prop()
      expect(a.filterBy(b)).to.emit([], () => send(a, [value(1), value(2)]))
    })

    it('should filter values as expected', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(true)])
      expect(a.filterBy(b)).to.emit([value(0, {current: true}), value(3), value(4), value(7), value(8), end()], () => {
        send(a, [value(3), value(4)])
        send(b, [value(0)])
        send(a, [value(5), value(6)])
        send(b, [value(1)])
        send(a, [value(7), value(8)])
        send(b, [value(false)])
        send(a, [value(9), end()])
      })
    })
  })
})
