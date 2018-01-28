import test from 'tape'
import { transform } from 'babel-core'

test('no renaming if unknown process option', (t) => {
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
  t.equal(result.code, 'object.property = 0;')
  t.end()
})

test('both inline and post works, even same time', (t) => {
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
  t.equal(result.code, 'object.RealFinalName = 0;')
  t.end()
})
