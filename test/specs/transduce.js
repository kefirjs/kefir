/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

const comp = (...fns) =>
  function(x) {
    for (let f of Array.from(fns.slice(0).reverse())) {
      x = f(x)
    }
    return x
  }

const testWithLib = (name, t) =>
  describe(`with ${name} implementation`, function() {
    describe('stream', function() {
      it('`map` should work', function() {
        const a = stream()
        return expect(a.transduce(t.map(x => x * 2))).toEmit([2, 4, 6, '<end>'], () => send(a, [1, 2, 3, '<end>']))
      })

      it('`filter` should work', function() {
        const a = stream()
        return expect(a.transduce(t.filter(x => x % 2 === 0))).toEmit([2, 4, '<end>'], () =>
          send(a, [1, 2, 3, 4, '<end>'])
        )
      })

      it('`take` should work', function() {
        let a = stream()
        expect(a.transduce(t.take(2))).toEmit([1, 2, '<end>'], () => send(a, [1, 2, 3, 4]))
        a = stream()
        return expect(a.transduce(t.take(2))).toEmit([1, '<end>'], () => send(a, [1, '<end>']))
      })

      it('`map.filter.take` should work', function() {
        const tr = comp(t.map(x => x + 10), t.filter(x => x % 2 === 0), t.take(2))
        const a = stream()
        return expect(a.transduce(tr)).toEmit([12, 14, '<end>'], () => send(a, [1, 2, 3, 4, 5, 6]))
      })

      if (t.partitionAll) {
        it('`partitionAll` should work', function() {
          let a = stream()
          expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3, 4], '<end>'], () => send(a, [1, 2, 3, 4, '<end>']))
          a = stream()
          return expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3], '<end>'], () =>
            send(a, [1, 2, 3, '<end>'])
          )
        })
        return it('`take.partitionAll` should work', function() {
          let tr = comp(t.take(3), t.partitionAll(2))
          let a = stream()
          expect(a.transduce(tr)).toEmit([[1, 2], [3], '<end>'], () => send(a, [1, 2, 3, 4, '<end>']))
          tr = comp(t.take(2), t.partitionAll(2))
          a = stream()
          return expect(a.transduce(tr)).toEmit([[1, 2], '<end>'], () => send(a, [1, 2, 3, 4, '<end>']))
        })
      }
    })

    return describe('property', function() {
      it('`map` should work', function() {
        const a = send(prop(), [1])
        return expect(a.transduce(t.map(x => x * 2))).toEmit([{current: 2}, 4, 6, '<end>'], () =>
          send(a, [2, 3, '<end>'])
        )
      })

      it('`filter` should work', function() {
        let a = send(prop(), [1])
        expect(a.transduce(t.filter(x => x % 2 === 0))).toEmit([2, 4, '<end>'], () => send(a, [2, 3, 4, '<end>']))
        a = send(prop(), [2])
        return expect(a.transduce(t.filter(x => x % 2 === 0))).toEmit([{current: 2}, 4, '<end>'], () =>
          send(a, [1, 3, 4, '<end>'])
        )
      })

      it('`take` should work', function() {
        let a = send(prop(), [1])
        expect(a.transduce(t.take(2))).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, 3, 4]))
        a = send(prop(), [1])
        return expect(a.transduce(t.take(3))).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
      })

      it('`map.filter.take` should work', function() {
        const tr = comp(t.map(x => x + 10), t.filter(x => x % 2 === 0), t.take(2))
        let a = send(prop(), [1])
        expect(a.transduce(tr)).toEmit([12, 14, '<end>'], () => send(a, [2, 3, 4, 5, 6]))
        a = send(prop(), [2])
        return expect(a.transduce(tr)).toEmit([{current: 12}, 14, '<end>'], () => send(a, [1, 3, 4, 5, 6]))
      })

      if (t.partitionAll) {
        it('`partitionAll` should work', function() {
          let a = send(prop(), [1])
          expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3, 4], '<end>'], () => send(a, [2, 3, 4, '<end>']))
          a = send(prop(), [1])
          return expect(a.transduce(t.partitionAll(2))).toEmit([[1, 2], [3], '<end>'], () => send(a, [2, 3, '<end>']))
        })
        return it('`take.partitionAll` should work', function() {
          let tr = comp(t.take(3), t.partitionAll(2))
          let a = send(prop(), [1])
          expect(a.transduce(tr)).toEmit([[1, 2], [3], '<end>'], () => send(a, [2, 3, 4, '<end>']))
          tr = comp(t.take(2), t.partitionAll(2))
          a = send(prop(), [1])
          return expect(a.transduce(tr)).toEmit([[1, 2], '<end>'], () => send(a, [2, 3, 4, '<end>']))
        })
      }
    })
  })

const noop = x => x

describe('transduce', function() {
  describe('with `noop` transducer', function() {
    describe('stream', function() {
      it('should return stream', () => expect(stream().transduce(noop)).toBeStream())

      it('should activate/deactivate source', function() {
        const a = stream()
        return expect(a.transduce(noop)).toActivate(a)
      })

      it('should be ended if source was ended', () =>
        expect(send(stream(), ['<end>']).transduce(noop)).toEmit(['<end:current>']))

      return it('should handle events', function() {
        const a = stream()
        return expect(a.transduce(noop)).toEmit([1, 2, {error: 4}, 3, '<end>'], () =>
          send(a, [1, 2, {error: 4}, 3, '<end>'])
        )
      })
    })

    return describe('property', function() {
      it('should return property', () => expect(prop().transduce(noop)).toBeProperty())

      it('should activate/deactivate source', function() {
        const a = prop()
        return expect(a.transduce(noop)).toActivate(a)
      })

      it('should be ended if source was ended', () =>
        expect(send(prop(), ['<end>']).transduce(noop)).toEmit(['<end:current>']))

      return it('should handle events and current', function() {
        let a = send(prop(), [1])
        expect(a.transduce(noop)).toEmit([{current: 1}, 2, {error: 4}, 3, '<end>'], () =>
          send(a, [2, {error: 4}, 3, '<end>'])
        )
        a = send(prop(), [{error: 0}])
        return expect(a.transduce(noop)).toEmit([{currentError: 0}, 2, {error: 4}, 3, '<end>'], () =>
          send(a, [2, {error: 4}, 3, '<end>'])
        )
      })
    })
  })

  testWithLib('Cognitect Labs', require('transducers-js'))
  return testWithLib("James Long's", require('transducers.js'))
})
