import compile from '../compile'
import { resolve } from 'path'
import { expect } from 'chai'

describe('ts-transform-img', function () {
    it('should be able to compile img', function () {
        compile(resolve(__dirname, 'fixture/*.ts'))
        return require('./fixture/index.js').default()
            .then(num => {
                expect(num).to.deep.equal(999)
            })
    })
})