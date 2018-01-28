/* eslint-env mocha */
import { transform } from 'babel-core'
import dedent from 'dedent'

suite('renaming properties', () => {
  test('rename single property', () => {
    const result = transform(
      'object.property = 0;',
      {
        plugins: [
          ['./src/index.js', { renames: { object: { property: 'NewName' } } }]
        ]
      }
    )
    result.code.should.equal('object.NewName = 0;')
  })

  test('only normal direct first level property assignments get renamed', () => {
    const result = transform(
      'object.property += 0;property = 1;root.object.property = 2;',
      {
        plugins: [
          ['./src/index.js', { renames: { object: { property: 'NewName' } } }]
        ]
      }
    )
    result.code.should.equal('object.property += 0;property = 1;root.object.property = 2;')
  })

  test('rename with aliases', () => {
    const result = transform(
      'object.property = 0;',
      {
        plugins: [
          ['./src/index.js', { renames: { object: { property: ['NewName', 'NN', 'NewN'] } } }]
        ]
      }
    )
    result.code.should.equal('object.NewN = object.NN = object.NewName = 0;')
  })

  test('rename with multiple properties', () => {
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
    result.code.should.equal(dedent`
      object.NewName1 = 0;object.NN = object.NewName2 = 1;
      object.noRename = 2;otherObject.OtherNewName1 = 3;`)
  })
})
