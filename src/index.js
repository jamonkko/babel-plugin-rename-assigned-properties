export default ({ types: t }) => {
  const buildPropertyAssignment = (objName, propName, valueNode) =>
    t.assignmentExpression(
      '=',
      t.memberExpression(t.identifier(objName), t.identifier(propName)),
      valueNode
    )

  const visitor = ({ renames, process }) => ({
    AssignmentExpression(path) {
      if (!process.includes('inline')) {
        return
      }
      const { node: { operator, left: memberExpression, right: valueExpression } } = path
      if (operator !== '=' || !t.isMemberExpression(memberExpression)) {
        return
      }
      for (const object of Object.keys(renames)) {
        if (!t.isIdentifier(memberExpression.object, { name: object })) {
          continue
        }
        for (const property of Object.keys(renames[object])) {
          if (!t.isIdentifier(memberExpression.property, { name: property })) {
            continue
          }
          const [to, ...aliases] = [].concat(renames[object][property])
          const renamedAssignment = buildPropertyAssignment(object, to, valueExpression)
          const chainedAliasAssignments = aliases.reduce(
            (chained, alias) =>
              buildPropertyAssignment(object, alias, chained),
            renamedAssignment
          )
          path.replaceWith(t.expressionStatement(chainedAliasAssignments))
        }
      }
    }
  })

  return {
    visitor: {
      Program: {
        exit(program, { opts }) {
          if (opts.process.includes('post')) {
            program.traverse(visitor(Object.assign({}, opts, { process: 'inline' })))
          }
        }
      }
    }
  }
}
