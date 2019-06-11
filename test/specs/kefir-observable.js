let {Kefir, expect} = require('../test-helpers')

describe('Kefir.Observable', () => {
  describe('observe', () => {
    let em, count, obs, sub

    beforeEach(() => {
      em = null
      count = 0
      obs = Kefir.stream(_em => {
        em = _em
      })
      sub = obs.observe({value: () => count++, error: () => count--, end: () => (count = 0)})
    })

    it('should return a Subscription', () => {
      expect(sub.closed).to.equal(false)
      expect(typeof sub.unsubscribe).to.equal('function')
    })

    it('should call Observer methods', () => {
      expect(count).to.equal(0)

      em.emit(1)
      expect(count).to.equal(1)

      em.emit(1)
      expect(count).to.equal(2)

      em.error(1)
      expect(count).to.equal(1)

      em.end()
      expect(count).to.equal(0)
      expect(sub.closed).to.equal(true)
    })

    it('should unsubcribe early', () => {
      expect(count).to.equal(0)

      em.emit(1)
      expect(count).to.equal(1)

      sub.unsubscribe()

      em.emit(1)
      expect(count).to.equal(1)
      expect(sub.closed).to.equal(true)
    })

    it('closed=true after end (w/o end handler)', () => {
      obs = Kefir.stream(_em => {
        em = _em
      })
      sub = obs.observe(() => {})
      em.end()
      expect(sub.closed).to.equal(true)
    })
  })
})
