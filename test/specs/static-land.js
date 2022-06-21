const {value, error, end, Kefir, expect} = require('../test-helpers')
const {Observable} = Kefir.staticLand

describe('Kefir.staticLand.Observable', () => {
  it('of works', () => {
    expect(Observable.of(2)).to.emit([value(2, {current: true}), end({current: true})])
  })

  it('empty works', () => {
    expect(Observable.empty()).to.emit([end({current: true})])
  })

  it('concat works', () => {
    expect(Observable.concat(Observable.of(2), Observable.empty())).to.emit([
      value(2, {current: true}),
      end({current: true}),
    ])
  })

  it('map works', () => {
    expect(Observable.map(x => x * 3, Observable.of(2))).to.emit([value(6, {current: true}), end({current: true})])
  })

  it('bimap works', () => {
    expect(
      Observable.bimap(
        x => x,
        x => x * 3,
        Observable.of(2)
      )
    ).to.emit([value(6, {current: true}), end({current: true})])
    expect(
      Observable.bimap(
        x => x * 3,
        x => x,
        Kefir.constantError(2)
      )
    ).to.emit([error(6, {current: true}), end({current: true})])
  })

  it('ap works', () => {
    expect(
      Observable.ap(
        Observable.of(x => x * 3),
        Observable.of(2)
      )
    ).to.emit([value(6, {current: true}), end({current: true})])
  })

  it('chain works', () => {
    expect(Observable.chain(x => Observable.of(x * 3), Observable.of(2))).to.emit([
      value(6, {current: true}),
      end({current: true}),
    ])
  })
})
