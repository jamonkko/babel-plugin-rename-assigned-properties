import { transform } from 'babel-core'

suite('processing order', () => {
  test('no renaming if unknown process option', () => {
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
  })

  test('both inline and post works, even same time', () => {
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
  })
})

