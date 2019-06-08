const {stream, send, value, error, end, expect} = require('../test-helpers')
const sinon = require('sinon')

describe('log', () => {
  describe('adding', () => {
    it('should return the stream', () => {
      expect(stream().log()).to.be.observable.stream()
    })

    it('should activate the stream', () => {
      const a = stream().log()
      expect(a).to.be.active()
    })
  })

  describe('removing', () => {
    it('should return the stream', () => {
      expect(
        stream()
          .log()
          .offLog()
      ).to.be.observable.stream()
    })

    it('should deactivate the stream', () => {
      const a = stream()
        .log()
        .offLog()
      expect(a).not.to.be.active()
    })
  })

  describe('console', () => {
    let stub
    beforeEach(() => (stub = sinon.stub(console, 'log')))

    afterEach(() => stub.restore())

    it('should have a default name', () => {
      const a = stream()
      a.log()
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 1)
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 2)
        expect(console.log).to.have.been.calledWith('[stream]', '<value>', 3)
      })
    })

    it('should use the name', () => {
      const a = stream()
      a.log('logged')
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).to.have.been.calledWith('logged', '<value>', 1)
        expect(console.log).to.have.been.calledWith('logged', '<value>', 2)
        expect(console.log).to.have.been.calledWith('logged', '<value>', 3)
      })
    })

    it('should not log if the log has been removed', () => {
      const a = stream()
      a.log()
      a.offLog()
      expect(a).to.emit([value(1), value(2), value(3)], () => {
        send(a, [value(1), value(2), value(3)])
        expect(console.log).not.to.have.been.called
      })
    })
  })
})
