/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

const comp = (...fns) => x => {
  for (let f of Array.from(fns.slice(0).reverse())) {
    x = f(x)
  }
  return x
}

const testWithLib = (name, t) =>
  describe(`with ${name} implementation`, () => {
    describe('stream', () => {
      it('`map` should work', () => {
        const a = stream()
        expect(a.transduce(t.map(x => x * 2))).to.emit([value(2), value(4), value(6), end()], () =>
          send(a, [value(1), value(2), value(3), end()])
        )
      })

      it('`filter` should work', () => {
        const a = stream()
        expect(a.transduce(t.filter(x => x % 2 === 0))).to.emit([value(2), value(4), end()], () =>
          send(a, [value(1), value(2), value(3), value(4), end()])
        )
      })

      it('`take` should work', () => {
        let a = stream()
        expect(a.transduce(t.take(2))).to.emit([value(1), value(2), end()], () =>
          send(a, [value(1), value(2), value(3), value(4)])
        )
        a = stream()
        expect(a.transduce(t.take(2))).to.emit([value(1), end()], () => send(a, [value(1), end()]))
      })

      it('`map.filter.take` should work', () => {
        const tr = comp(
          t.map(x => x + 10),
          t.filter(x => x % 2 === 0),
          t.take(2)
        )
        const a = stream()
        expect(a.transduce(tr)).to.emit([value(12), value(14), end()], () =>
          send(a, [value(1), value(2), value(3), value(4), value(5), value(6)])
        )
      })

      if (t.partitionAll) {
        it('`partitionAll` should work', () => {
          let a = stream()
          expect(a.transduce(t.partitionAll(2))).to.emit([value([1, 2]), value([3, 4]), end()], () =>
            send(a, [value(1), value(2), value(3), value(4), end()])
          )
          a = stream()
          expect(a.transduce(t.partitionAll(2))).to.emit([value([1, 2]), value([3]), end()], () =>
            send(a, [value(1), value(2), value(3), end()])
          )
        })
        it('`take.partitionAll` should work', () => {
          let tr = comp(t.take(3), t.partitionAll(2))
          let a = stream()
          expect(a.transduce(tr)).to.emit([value([1, 2]), value([3]), end()], () =>
            send(a, [value(1), value(2), value(3), value(4), end()])
          )
          tr = comp(t.take(2), t.partitionAll(2))
          a = stream()
          expect(a.transduce(tr)).to.emit([value([1, 2]), end()], () =>
            send(a, [value(1), value(2), value(3), value(4), end()])
          )
        })
      }
    })

    describe('property', () => {
      it('`map` should work', () => {
        const a = send(prop(), [value(1)])
        expect(a.transduce(t.map(x => x * 2))).to.emit([value(2, {current: true}), value(4), value(6), end()], () =>
          send(a, [value(2), value(3), end()])
        )
      })

      it('`filter` should work', () => {
        let a = send(prop(), [value(1)])
        expect(a.transduce(t.filter(x => x % 2 === 0))).to.emit([value(2), value(4), end()], () =>
          send(a, [value(2), value(3), value(4), end()])
        )
        a = send(prop(), [value(2)])
        expect(a.transduce(t.filter(x => x % 2 === 0))).to.emit([value(2, {current: true}), value(4), end()], () =>
          send(a, [value(1), value(3), value(4), end()])
        )
      })

      it('`take` should work', () => {
        let a = send(prop(), [value(1)])
        expect(a.transduce(t.take(2))).to.emit([value(1, {current: true}), value(2), end()], () =>
          send(a, [value(2), value(3), value(4)])
        )
        a = send(prop(), [value(1)])
        expect(a.transduce(t.take(3))).to.emit([value(1, {current: true}), value(2), end()], () =>
          send(a, [value(2), end()])
        )
      })

      it('`map.filter.take` should work', () => {
        const tr = comp(
          t.map(x => x + 10),
          t.filter(x => x % 2 === 0),
          t.take(2)
        )
        let a = send(prop(), [value(1)])
        expect(a.transduce(tr)).to.emit([value(12), value(14), end()], () =>
          send(a, [value(2), value(3), value(4), value(5), value(6)])
        )
        a = send(prop(), [value(2)])
        expect(a.transduce(tr)).to.emit([value(12, {current: true}), value(14), end()], () =>
          send(a, [value(1), value(3), value(4), value(5), value(6)])
        )
      })

      if (t.partitionAll) {
        it('`partitionAll` should work', () => {
          let a = send(prop(), [value(1)])
          expect(a.transduce(t.partitionAll(2))).to.emit([value([1, 2]), value([3, 4]), end()], () =>
            send(a, [value(2), value(3), value(4), end()])
          )
          a = send(prop(), [value(1)])
          expect(a.transduce(t.partitionAll(2))).to.emit([value([1, 2]), value([3]), end()], () =>
            send(a, [value(2), value(3), end()])
          )
        })
        it('`take.partitionAll` should work', () => {
          let tr = comp(t.take(3), t.partitionAll(2))
          let a = send(prop(), [value(1)])
          expect(a.transduce(tr)).to.emit([value([1, 2]), value([3]), end()], () =>
            send(a, [value(2), value(3), value(4), end()])
          )
          tr = comp(t.take(2), t.partitionAll(2))
          a = send(prop(), [value(1)])
          expect(a.transduce(tr)).to.emit([value([1, 2]), end()], () => send(a, [value(2), value(3), value(4), end()]))
        })
      }
    })
  })

const noop = x => x

describe('transduce', () => {
  describe('with `noop` transducer', () => {
    describe('stream', () => {
      it('should return stream', () => {
        expect(stream().transduce(noop)).to.be.observable.stream()
      })

      it('should activate/deactivate source', () => {
        const a = stream()
        expect(a.transduce(noop)).to.activate(a)
      })

      it('should be ended if source was ended', () =>
        expect(send(stream(), [end()]).transduce(noop)).to.emit([end({current: true})]))

      it('should handle events', () => {
        const a = stream()
        expect(a.transduce(noop)).to.emit([value(1), value(2), error(4), value(3), end()], () =>
          send(a, [value(1), value(2), error(4), value(3), end()])
        )
      })
    })

    describe('property', () => {
      it('should return property', () => {
        expect(prop().transduce(noop)).to.be.observable.property()
      })

      it('should activate/deactivate source', () => {
        const a = prop()
        expect(a.transduce(noop)).to.activate(a)
      })

      it('should be ended if source was ended', () =>
        expect(send(prop(), [end()]).transduce(noop)).to.emit([end({current: true})]))

      it('should handle events and current', () => {
        let a = send(prop(), [value(1)])
        expect(a.transduce(noop)).to.emit([value(1, {current: true}), value(2), error(4), value(3), end()], () =>
          send(a, [value(2), error(4), value(3), end()])
        )
        a = send(prop(), [error(0)])
        expect(a.transduce(noop)).to.emit([error(0, {current: true}), value(2), error(4), value(3), end()], () =>
          send(a, [value(2), error(4), value(3), end()])
        )
      })
    })
  })

  testWithLib('Cognitect Labs', require('transducers-js'))
  testWithLib("James Long's", require('transducers.js'))
})
