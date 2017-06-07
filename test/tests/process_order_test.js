/* eslint-env mocha */
import { transform } from 'babel-core'

suite('processing order', () => {
  test('no renaming if unknown process option', (done) => {
    const result = transform(
      'object.property = 0;',
      {
        plugins: [
          ['./src/index.js', {
            renames: { object: { property: 'NewName' } },
            process: 'unknown' }
          ]
        ]
      }
    )
    result.code.should.equal('object.property = 0;')
    done()
  })

  test('both inline and post works, even same time', (done) => {
    const result = transform(
      'object.property = 0;',
      {
        plugins: [
          ['./src/index.js', {
            renames: { object: { property: 'NewName' } },
            process: 'inline' }
          ],
          ['./src/index.js', {
            renames: { object: { NewName: 'FinalName' } },
            process: 'post' }
          ],
          ['./src/index.js', {
            renames: { object: { FinalName: 'RealFinalName' } },
            process: 'inline|post' }
          ]
        ]
      }
    )
    result.code.should.equal('object.RealFinalName = 0;')
    done()
  })
})
