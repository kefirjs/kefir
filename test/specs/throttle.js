const {stream, prop, send, Kefir, expect} = require('../test-helpers')

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
      expect(send(stream(), ['<end>']).throttle(100)).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.throttle(100)).to.emitInTime(
        [[0, 1], [100, 4], [200, 5], [320, 6], [520, 7], [620, 9], [620, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {trailing: false}', () => {
      const a = stream()
      expect(a.throttle(100, {trailing: false})).to.emitInTime(
        [[0, 1], [120, 5], [320, 6], [520, 7], [610, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {leading: false}', () => {
      const a = stream()
      expect(a.throttle(100, {leading: false})).to.emitInTime(
        [[100, 4], [220, 5], [420, 6], [620, 9], [620, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {leading: false, trailing: false}', () => {
      const a = stream()
      expect(a.throttle(100, {leading: false, trailing: false})).to.emitInTime(
        [[120, 5], [320, 6], [520, 7], [610, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
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
      expect(send(prop(), ['<end>']).throttle(100)).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = send(prop(), [0])
      expect(a.throttle(100)).to.emitInTime(
        [[0, {current: 0}], [0, 1], [100, 4], [200, 5], [320, 6], [520, 7], [620, 9], [620, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {trailing: false}', () => {
      const a = send(prop(), [0])
      expect(a.throttle(100, {trailing: false})).to.emitInTime(
        [[0, {current: 0}], [0, 1], [120, 5], [320, 6], [520, 7], [610, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {leading: false}', () => {
      const a = send(prop(), [0])
      expect(a.throttle(100, {leading: false})).to.emitInTime(
        [[0, {current: 0}], [100, 4], [220, 5], [420, 6], [620, 9], [620, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('should handle events {leading: false, trailing: false}', () => {
      const a = send(prop(), [0])
      expect(a.throttle(100, {leading: false, trailing: false})).to.emitInTime(
        [[0, {current: 0}], [120, 5], [320, 6], [520, 7], [610, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(30)
          send(a, [4])
          tick(30)
          send(a, [5])
          tick(200)
          send(a, [6])
          tick(200)
          send(a, [7])
          tick(30)
          send(a, [8])
          tick(30)
          send(a, [9])
          tick(30)
          send(a, ['<end>'])
        }
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.throttle(100)).to.flowErrors(a)
    })
  })
})
