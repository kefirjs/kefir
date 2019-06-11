const {stream, send, value, error, end, expect} = require('../test-helpers')
const sinon = require('sinon')

describe('spy', () => {
  describe('adding', () => {
    it('should return the stream', () => {
      expect(stream().spy()).to.be.observable.stream()
    })

    it('should not activate the stream', () => {
      const a = stream().spy()
      expect(a).not.to.be.active()
    })
  })

  describe('removing', () => {
    it('should return the stream', () => {
      expect(
        stream()
          .spy()
          .offSpy()
      ).to.be.observable.stream()
    })

    it('should not activate the stream', () => {
      const a = stream()
        .spy()
        .offSpy()
      expect(a).not.to.be.active()
    })
  })

  describe('console', () => {
    let stub
    beforeEach(() => (stub = sinon.stub(console, 'log')))

    afterEach(() => stub.restore())

    it('should have a default name', () => {
      const a = stream()
      a.spy()
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 1)
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 2)
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 3)
      })
    })

    it('should use the name', () => {
      const a = stream()
      a.spy('spied')
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).to.have.been.calledWith('spied', '<value>', 1)
        expect(console.log).to.have.been.calledWith('spied', '<value>', 2)
        expect(console.log).to.have.been.calledWith('spied', '<value>', 3)
      })
    })

    it('should not log if the spy has been removed', () => {
      const a = stream()
      a.spy()
      a.offSpy()
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).not.to.have.been.called
      })
    })
  })
})
