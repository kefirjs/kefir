const {stream, prop, send, expect} = require('../test-helpers')

const intv = 300
const cnt = 4

describe('bufferWithTimeOrCount', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().bufferWithTimeOrCount(intv, cnt)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).to.emit(['<end:current>'])
    })

    it('should flush buffer when either interval or count is reached', () => {
      const a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.emitInTime(
        [[300, [1, 2, 3]], [500, [4, 5, 6, 7]], [800, []], [900, [8, 9]], [900, '<end>']],
        tick => {
          tick(100)
          send(a, [1])
          tick(100)
          send(a, [2])
          tick(99)
          send(a, [3])
          tick(51)
          send(a, [4])
          tick(50)
          send(a, [5])
          tick(50)
          send(a, [6])
          tick(50)
          send(a, [7])
          tick(301)
          send(a, [8])
          tick(99)
          send(a, [9, '<end>'])
        }
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).to.emitInTime(
        [[300, [1, 2, 3]], [500, [4, 5, 6, 7]], [700, '<end>']],
        tick => {
          tick(100)
          send(a, [1])
          tick(100)
          send(a, [2])
          tick(99)
          send(a, [3])
          tick(51)
          send(a, [4])
          tick(50)
          send(a, [5])
          tick(50)
          send(a, [6])
          tick(50)
          send(a, [7])
          tick(100)
          send(a, [8])
          tick(100)
          send(a, [9, '<end>'])
        }
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should property', () => {
      expect(prop().bufferWithTimeOrCount(intv, cnt)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).to.emit(['<end:current>'])
      expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt)).to.emit([{current: [1]}, '<end:current>'])
      expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).to.emit([
        '<end:current>',
      ])
    })

    it('should flush buffer when either interval or count is reached', () => {
      const a = send(prop(), [0])
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.emitInTime(
        [[300, [0, 1, 2]], [500, [3, 4, 5, 6]], [800, []], [900, [7, 8]], [900, '<end>']],
        tick => {
          tick(100)
          send(a, [1])
          tick(100)
          send(a, [2])
          tick(150)
          send(a, [3])
          tick(50)
          send(a, [4])
          tick(50)
          send(a, [5])
          tick(50)
          send(a, [6])
          tick(301)
          send(a, [7])
          tick(99)
          send(a, [8, '<end>'])
        }
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = send(prop(), [0])
      expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).to.emitInTime(
        [[300, [0, 1, 2]], [500, [3, 4, 5, 6]], [700, '<end>']],
        tick => {
          tick(100)
          send(a, [1])
          tick(100)
          send(a, [2])
          tick(150)
          send(a, [3])
          tick(50)
          send(a, [4])
          tick(50)
          send(a, [5])
          tick(50)
          send(a, [6])
          tick(100)
          send(a, [7])
          tick(100)
          send(a, [8, '<end>'])
        }
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.bufferWithTimeOrCount(intv, cnt)).to.flowErrors(a)
    })
  })
})
