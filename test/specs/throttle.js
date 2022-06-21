const {stream, prop, send, value, end, expect} = require('../test-helpers')

describe('throttle', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().throttle(100)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.throttle(100)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).throttle(100)).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      expect(a.throttle(100)).to.emitInTime(
        [
          [0, value(1)],
          [100, value(4)],
          [200, value(5)],
          [320, value(6)],
          [520, value(7)],
          [620, value(9)],
          [620, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {trailing: false}', () => {
      const a = stream()
      expect(a.throttle(100, {trailing: false})).to.emitInTime(
        [
          [0, value(1)],
          [120, value(5)],
          [320, value(6)],
          [520, value(7)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {leading: false}', () => {
      const a = stream()
      expect(a.throttle(100, {leading: false})).to.emitInTime(
        [
          [100, value(4)],
          [220, value(5)],
          [420, value(6)],
          [620, value(9)],
          [620, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {leading: false, trailing: false}', () => {
      const a = stream()
      expect(a.throttle(100, {leading: false, trailing: false})).to.emitInTime(
        [
          [120, value(5)],
          [320, value(6)],
          [520, value(7)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.throttle(100)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().throttle(100)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.throttle(100)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).throttle(100)).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = send(prop(), [value(0)])
      expect(a.throttle(100)).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [0, value(1)],
          [100, value(4)],
          [200, value(5)],
          [320, value(6)],
          [520, value(7)],
          [620, value(9)],
          [620, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {trailing: false}', () => {
      const a = send(prop(), [value(0)])
      expect(a.throttle(100, {trailing: false})).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [0, value(1)],
          [120, value(5)],
          [320, value(6)],
          [520, value(7)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {leading: false}', () => {
      const a = send(prop(), [value(0)])
      expect(a.throttle(100, {leading: false})).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [100, value(4)],
          [220, value(5)],
          [420, value(6)],
          [620, value(9)],
          [620, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('should handle events {leading: false, trailing: false}', () => {
      const a = send(prop(), [value(0)])
      expect(a.throttle(100, {leading: false, trailing: false})).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [120, value(5)],
          [320, value(6)],
          [520, value(7)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(30)
          send(a, [value(4)])
          tick(30)
          send(a, [value(5)])
          tick(200)
          send(a, [value(6)])
          tick(200)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8)])
          tick(30)
          send(a, [value(9)])
          tick(30)
          send(a, [end()])
        }
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.throttle(100)).to.flowErrors(a)
    })
  })
})
