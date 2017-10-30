const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('combine', () => {
  describe('array', () => {
    it('should stream', () => {
      expect(Kefir.combine([])).to.be.observable.stream()
      expect(Kefir.combine([stream(), prop()])).to.be.observable.stream()
      expect(stream().combine(stream())).to.be.observable.stream()
      expect(prop().combine(prop())).to.be.observable.stream()
    })

    it('should be ended if empty array provided', () => {
      expect(Kefir.combine([])).to.emit(['<end:current>'])
    })

    it('should be ended if array of ended observables provided', () => {
      const a = send(stream(), ['<end>'])
      const b = send(prop(), ['<end>'])
      const c = send(stream(), ['<end>'])
      expect(Kefir.combine([a, b, c])).to.emit(['<end:current>'])
      expect(a.combine(b)).to.emit(['<end:current>'])
    })

    it('should be ended and has current if array of ended properties provided and each of them has current', () => {
      const a = send(prop(), [1, '<end>'])
      const b = send(prop(), [2, '<end>'])
      const c = send(prop(), [3, '<end>'])
      expect(Kefir.combine([a, b, c])).to.emit([{current: [1, 2, 3]}, '<end:current>'])
      expect(a.combine(b)).to.emit([{current: [1, 2]}, '<end:current>'])
    })

    it('should activate sources', () => {
      const a = stream()
      const b = prop()
      const c = stream()
      expect(Kefir.combine([a, b, c])).to.activate(a, b, c)
      expect(a.combine(b)).to.activate(a, b)
    })

    it('should handle events and current from observables', () => {
      let a = stream()
      let b = send(prop(), [0])
      const c = stream()
      expect(Kefir.combine([a, b, c])).to.emit([[1, 0, 2], [1, 3, 2], [1, 4, 2], [1, 4, 5], [1, 4, 6], '<end>'], () => {
        send(a, [1])
        send(c, [2])
        send(b, [3])
        send(a, ['<end>'])
        send(b, [4, '<end>'])
        send(c, [5, 6, '<end>'])
      })
      a = stream()
      b = send(prop(), [0])
      expect(a.combine(b)).to.emit([[1, 0], [1, 2], [1, 3], '<end>'], () => {
        send(a, [1])
        send(b, [2])
        send(a, ['<end>'])
        send(b, [3, '<end>'])
      })
    })

    it('should accept optional combinator function', () => {
      let a = stream()
      let b = send(prop(), [0])
      const c = stream()
      const join = (...args) => args.join('+')
      expect(Kefir.combine([a, b, c], join)).to.emit(['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], () => {
        send(a, [1])
        send(c, [2])
        send(b, [3])
        send(a, ['<end>'])
        send(b, [4, '<end>'])
        send(c, [5, 6, '<end>'])
      })
      a = stream()
      b = send(prop(), [0])
      expect(a.combine(b, join)).to.emit(['1+0', '1+2', '1+3', '<end>'], () => {
        send(a, [1])
        send(b, [2])
        send(a, ['<end>'])
        send(b, [3, '<end>'])
      })
    })

    it('when activating second time and has 2+ properties in sources, should emit current value at most once', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [1])
      const cb = Kefir.combine([a, b])
      activate(cb)
      deactivate(cb)
      expect(cb).to.emit([{current: [0, 1]}])
    })

    it('errors should flow', () => {
      let a = stream()
      let b = prop()
      let c = stream()
      expect(Kefir.combine([a, b, c])).to.flowErrors(a)
      a = stream()
      b = prop()
      c = stream()
      expect(Kefir.combine([a, b, c])).to.flowErrors(b)
      a = stream()
      b = prop()
      c = stream()
      expect(Kefir.combine([a, b, c])).to.flowErrors(c)
    })

    it('should handle errors correctly', () => {
      // a:      ---e---v---v-----
      //            1
      // b:      ----v---e----v---
      //                 2
      // c:      -----v---e--v----
      //                  3
      // result: ---eee-vee-eev--
      //            111  23 32

      const a = stream()
      const b = stream()
      const c = stream()
      expect(Kefir.combine([a, b, c])).to.emit(
        [
          {error: -1},
          {error: -1},
          {error: -1},
          [3, 1, 2],
          {error: -2},
          {error: -3},
          {error: -3},
          {error: -2},
          [4, 6, 5],
        ],
        () => {
          send(a, [{error: -1}])
          send(b, [1])
          send(c, [2])
          send(a, [3])
          send(b, [{error: -2}])
          send(c, [{error: -3}])
          send(a, [4])
          send(c, [5])
          send(b, [6])
        }
      )
    })

    describe('sampledBy al =>ity (3 arity combine)', () => {
      it('should stream', () => {
        expect(Kefir.combine([], [])).to.be.observable.stream()
        expect(Kefir.combine([stream(), prop()], [stream(), prop()])).to.be.observable.stream()
      })

      it('should be ended if empty array provided', () => {
        expect(Kefir.combine([stream(), prop()], [])).to.emit([])
        expect(Kefir.combine([], [stream(), prop()])).to.emit(['<end:current>'])
      })

      it('should be ended if array of ended observables provided', () => {
        const a = send(stream(), ['<end>'])
        const b = send(prop(), ['<end>'])
        const c = send(stream(), ['<end>'])
        expect(Kefir.combine([a, b, c], [stream(), prop()])).to.emit(['<end:current>'])
      })

      it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', () => {
        const a = send(prop(), [1, '<end>'])
        const b = send(prop(), [2, '<end>'])
        const c = send(prop(), [3, '<end>'])
        const s1 = Kefir.combine([a, b], [c])
        expect(s1).to.emit([{current: [1, 2, 3]}, '<end:current>'])
        expect(s1).to.emit(['<end:current>'])
      })

      it('should activate sources', () => {
        const a = stream()
        const b = prop()
        const c = stream()
        expect(Kefir.combine([a, b], [c])).to.activate(a, b, c)
      })

      it('should handle events and current from observables', () => {
        const a = stream()
        const b = send(prop(), [0])
        const c = stream()
        const d = stream()
        expect(Kefir.combine([c, d], [a, b])).to.emit(
          [[2, 3, 1, 0], [5, 3, 1, 4], [6, 3, 1, 4], [6, 7, 1, 4], '<end>'],
          () => {
            send(a, [1])
            send(c, [2])
            send(d, [3])
            send(b, [4, '<end>'])
            send(c, [5, 6, '<end>'])
            send(d, [7, '<end>'])
          }
        )
      })

      it('should accept optional combinator function', () => {
        const join = (...args) => args.join('+')
        const a = stream()
        const b = send(prop(), [0])
        const c = stream()
        const d = stream()
        expect(Kefir.combine([c, d], [a, b], join)).to.emit(
          ['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'],
          () => {
            send(a, [1])
            send(c, [2])
            send(d, [3])
            send(b, [4, '<end>'])
            send(c, [5, 6, '<end>'])
            send(d, [7, '<end>'])
          }
        )
      })

      it('when activating second time and has 2+ properties in sources, should emit current value at most once', () => {
        const a = send(prop(), [0])
        const b = send(prop(), [1])
        const c = send(prop(), [2])
        const sb = Kefir.combine([a, b], [c])
        activate(sb)
        deactivate(sb)
        expect(sb).to.emit([{current: [0, 1, 2]}])
      })

      it('errors should flow', () => {
        let a = stream()
        let b = prop()
        let c = stream()
        let d = prop()
        expect(Kefir.combine([a, b], [c, d])).to.flowErrors(a)
        a = stream()
        b = prop()
        c = stream()
        d = prop()
        expect(Kefir.combine([a, b], [c, d])).to.flowErrors(b)
      })

      // https://github.com/rpominov/kefir/issues/98
      it('should work nice for emitating atomic updates', () => {
        const a = stream()
        const b = a.map(x => x + 2)
        const c = a.map(x => x * 2)
        expect(Kefir.combine([b], [c])).to.emit([[3, 2], [4, 4], [5, 6]], () => send(a, [1, 2, 3]))
      })
    })
  })

  describe('object', () => {
    it('should stream', () => {
      expect(Kefir.combine({})).to.be.observable.stream()
      expect(Kefir.combine({s: stream(), p: prop()})).to.be.observable.stream()
    })

    it('should be ended if empty array provided', () => {
      expect(Kefir.combine({})).to.emit(['<end:current>'])
    })

    it('should be ended if array of ended observables provided', () => {
      const a = send(stream(), ['<end>'])
      const b = send(prop(), ['<end>'])
      const c = send(stream(), ['<end>'])
      expect(Kefir.combine({a, b, c})).to.emit(['<end:current>'])
    })

    it('should be ended and has current if array of ended properties provided and each of them has current', () => {
      const a = send(prop(), [1, '<end>'])
      const b = send(prop(), [2, '<end>'])
      const c = send(prop(), [3, '<end>'])
      expect(Kefir.combine({a, b, c})).to.emit([{current: {a: 1, b: 2, c: 3}}, '<end:current>'])
    })

    it('should activate sources', () => {
      const a = stream()
      const b = prop()
      const c = stream()
      expect(Kefir.combine({a, b, c})).to.activate(a, b, c)
    })

    it('should handle events and current from observables', () => {
      const a = stream()
      const b = send(prop(), [0])
      const c = stream()
      expect(Kefir.combine({a, b, c})).to.emit(
        [{a: 1, b: 0, c: 2}, {a: 1, b: 3, c: 2}, {a: 1, b: 4, c: 2}, {a: 1, b: 4, c: 5}, {a: 1, b: 4, c: 6}, '<end>'],
        () => {
          send(a, [1])
          send(c, [2])
          send(b, [3])
          send(a, ['<end>'])
          send(b, [4, '<end>'])
          send(c, [5, 6, '<end>'])
        }
      )
    })

    it('should accept optional combinator function', () => {
      const a = stream()
      const b = send(prop(), [0])
      const c = stream()
      const join = ev => ev.a + '+' + ev.b + '+' + ev.c
      expect(Kefir.combine({a, b, c}, join)).to.emit(['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], () => {
        send(a, [1])
        send(c, [2])
        send(b, [3])
        send(a, ['<end>'])
        send(b, [4, '<end>'])
        send(c, [5, 6, '<end>'])
      })
    })

    it('when activating second time and has 2+ properties in sources, should emit current value at most once', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [1])
      const cb = Kefir.combine({a, b})
      activate(cb)
      deactivate(cb)
      expect(cb).to.emit([{current: {a: 0, b: 1}}])
    })

    it('errors should flow', () => {
      let a = stream()
      let b = prop()
      let c = stream()
      expect(Kefir.combine({a, b, c})).to.flowErrors(a)
      a = stream()
      b = prop()
      c = stream()
      expect(Kefir.combine({a, b, c})).to.flowErrors(b)
      a = stream()
      b = prop()
      c = stream()
      expect(Kefir.combine({a, b, c})).to.flowErrors(c)
    })

    it('should handle errors correctly', () => {
      // a:      ---e---v---v-----
      //            1
      // b:      ----v---e----v---
      //                 2
      // c:      -----v---e--v----
      //                  3
      // result: ---eee-vee-eev--
      //            111  23 32

      const a = stream()
      const b = stream()
      const c = stream()
      expect(Kefir.combine({a, b, c})).to.emit(
        [
          {error: -1},
          {error: -1},
          {error: -1},
          {a: 3, b: 1, c: 2},
          {error: -2},
          {error: -3},
          {error: -3},
          {error: -2},
          {a: 4, b: 6, c: 5},
        ],
        () => {
          send(a, [{error: -1}])
          send(b, [1])
          send(c, [2])
          send(a, [3])
          send(b, [{error: -2}])
          send(c, [{error: -3}])
          send(a, [4])
          send(c, [5])
          send(b, [6])
        }
      )
    })

    describe('sampledBy al =>ity (3 arity combine)', () => {
      it('should stream', () => {
        expect(Kefir.combine({}, {})).to.be.observable.stream()
        expect(Kefir.combine({s1: stream(), p1: prop()}, {s2: stream(), p2: prop()})).to.be.observable.stream()
      })

      it('should be ended if empty array provided', () => {
        expect(Kefir.combine({s1: stream(), p1: prop()}, {})).to.emit([])
        expect(Kefir.combine({}, {s2: stream(), p2: prop()})).to.emit(['<end:current>'])
      })

      it('should be ended if array of ended observables provided', () => {
        const a = send(stream(), ['<end>'])
        const b = send(prop(), ['<end>'])
        const c = send(stream(), ['<end>'])
        expect(Kefir.combine({a, b, c}, {d: stream(), e: prop()})).to.emit(['<end:current>'])
      })

      it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', () => {
        const a = send(prop(), [1, '<end>'])
        const b = send(prop(), [2, '<end>'])
        const c = send(prop(), [3, '<end>'])
        const s1 = Kefir.combine({a, b}, {c})
        expect(s1).to.emit([{current: {a: 1, b: 2, c: 3}}, '<end:current>'])
        expect(s1).to.emit(['<end:current>'])
      })

      it('should activate sources', () => {
        const a = stream()
        const b = prop()
        const c = stream()
        expect(Kefir.combine({a, b}, {c})).to.activate(a, b, c)
      })

      it('should handle events and current from observables', () => {
        const a = stream()
        const b = send(prop(), [0])
        const c = stream()
        const d = stream()
        expect(Kefir.combine({c, d}, {a, b})).to.emit(
          [
            {a: 1, b: 0, c: 2, d: 3},
            {a: 1, b: 4, c: 5, d: 3},
            {a: 1, b: 4, c: 6, d: 3},
            {a: 1, b: 4, c: 6, d: 7},
            '<end>',
          ],
          () => {
            send(a, [1])
            send(c, [2])
            send(d, [3])
            send(b, [4, '<end>'])
            send(c, [5, 6, '<end>'])
            send(d, [7, '<end>'])
          }
        )
      })

      it('should accept optional combinator function', () => {
        const join = msg => msg.c + '+' + msg.d + '+' + msg.a + '+' + msg.b
        const a = stream()
        const b = send(prop(), [0])
        const c = stream()
        const d = stream()
        expect(Kefir.combine({c, d}, {a, b}, join)).to.emit(
          ['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'],
          () => {
            send(a, [1])
            send(c, [2])
            send(d, [3])
            send(b, [4, '<end>'])
            send(c, [5, 6, '<end>'])
            send(d, [7, '<end>'])
          }
        )
      })

      it('when activating second time and has 2+ properties in sources, should emit current value at most once', () => {
        const a = send(prop(), [0])
        const b = send(prop(), [1])
        const c = send(prop(), [2])
        const sb = Kefir.combine({a, b}, {c})
        activate(sb)
        deactivate(sb)
        expect(sb).to.emit([{current: {a: 0, b: 1, c: 2}}])
      })

      it('errors should flow', () => {
        let a = stream()
        let b = prop()
        let c = stream()
        let d = prop()
        expect(Kefir.combine({a, b}, {c, d})).to.flowErrors(a)
        a = stream()
        b = prop()
        c = stream()
        d = prop()
        expect(Kefir.combine({a, b}, {c, d})).to.flowErrors(b)
      })

      // https://github.com/rpominov/kefir/issues/98
      it('should work nice for emitating atomic updates', () => {
        const a = stream()
        const b = a.map(x => x + 2)
        const c = a.map(x => x * 2)
        expect(Kefir.combine({b}, {c})).to.emit([{b: 3, c: 2}, {b: 4, c: 4}, {b: 5, c: 6}], () => send(a, [1, 2, 3]))
      })

      it('should prefer active keys over passive keys', () => {
        const a = stream()
        const b = stream()
        const _a = stream()

        expect(Kefir.combine({a, b}, {a: _a})).to.emit([{a: 1, b: 4}, {a: 2, b: 4}, {a: 3, b: 4}], () => {
          send(_a, [-1])
          send(a, [1])
          send(b, [4])
          send(_a, [-2])
          send(a, [2])
          send(_a, [-3])
          send(a, [3])
        })
      })
    })
  })

  describe('mismatches', () =>
    it('should not allow mismatched argument types', () => {
      const a = stream()
      const b = stream()
      const arrayAndObject = () => Kefir.combine([a], {b})
      const objectAndArray = () => Kefir.combine({a}, [b])
      expect(arrayAndObject).to.throw()
      expect(objectAndArray).to.throw()
    }))
})
