import test from 'tape'
import { transform } from 'babel-core'
import dedent from 'dedent'

test('rename single property', (t) => {
  const result = transform(
    'object.property = 0;',
    {
      plugins: [
        ['./src/index.js', { renames: { object: { property: 'NewName' } } }]
      ]
    }
  )
  t.equal(result.code, 'object.NewName = 0;')
  t.end()
})

test('only normal direct first level property assignments get renamed', (t) => {
  const result = transform(
    'object.property += 0;property = 1;root.object.property = 2;',
    {
      plugins: [
        ['./src/index.js', { renames: { object: { property: 'NewName' } } }]
      ]
    }
  )
  t.equal(result.code, 'object.property += 0;property = 1;root.object.property = 2;')
  t.end()
})

test('rename with aliases', (t) => {
  const result = transform(
    'object.property = 0;',
    {
      plugins: [
        ['./src/index.js', { renames: { object: { property: ['NewName', 'NN', 'NewN'] } } }]
      ]
    }
  )
  t.equal(result.code, 'object.NewN = object.NN = object.NewName = 0;')
  t.end()
})

test('rename with multiple properties', (t) => {
  const result = transform(dedent`
    object.name1 = 0;object.name2 = 1;
    object.noRename = 2;otherObject.name1 = 3;`,
    {
      plugins: [
        ['./src/index.js', {
          renames: {
            object: {
              name1: 'NewName1',
              name2: ['NewName2', 'NN'],
              unknown: 'NoEffect'
            },
            otherObject: {
              name1: 'OtherNewName1'
            }
          }
        }]
      ]
    }
  )
  t.equal(result.code, dedent`
    object.NewName1 = 0;object.NN = object.NewName2 = 1;
    object.noRename = 2;otherObject.OtherNewName1 = 3;`)
  t.end()
})
