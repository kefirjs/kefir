const {Kefir, expect} = require('../test-helpers')

describe('activeObservables', () => {
  const noop = () => {}

  describe('Observable', () => {
    it('counts active observables', () => {
      const observable = new Kefir.Observable()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
    })

    it('counts all observable activations', () => {
      const observable = new Kefir.Observable()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })

    it('multiple subscriptions do not count as multiple active observables', () => {
      const observable = new Kefir.Observable()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.onError(noop)
      expect(Kefir.activeObservables.length).to.equal(1)

      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offError(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })
  })

  describe('Property', () => {
    it('counts active observables', () => {
      const observable = new Kefir.Property()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
    })

    it('counts all observable activations', () => {
      const observable = new Kefir.Property()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })

    it('multiple subscriptions do not count as multiple active observables', () => {
      const observable = new Kefir.Property()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.onError(noop)
      expect(Kefir.activeObservables.length).to.equal(1)

      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offError(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })
  })

  describe('Stream', () => {
    it('counts active observables', () => {
      const observable = new Kefir.Stream()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
    })

    it('counts all observable activations', () => {
      const observable = new Kefir.Stream()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })

    it('multiple subscriptions do not count as multiple active observables', () => {
      const observable = new Kefir.Stream()
      expect(Kefir.activeObservables.length).to.equal(0)

      observable.onValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.onError(noop)
      expect(Kefir.activeObservables.length).to.equal(1)

      observable.offValue(noop)
      expect(Kefir.activeObservables.length).to.equal(1)
      observable.offError(noop)
      expect(Kefir.activeObservables.length).to.equal(0)
    })
  })
})
