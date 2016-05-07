export default ({ types: t }) => {
  const buildPropertyAssignment = (objName, propName, valueNode) =>
    t.assignmentExpression(
      '=',
      t.memberExpression(t.identifier(objName), t.identifier(propName)),
      valueNode
    )

  return {
    visitor: {
      Program: {
        exit(program, { opts }) {
          program.traverse({
            AssignmentExpression: {
              enter(path) {
                const { node: { operator, left: memberExpression, right: valueExpression } } = path
                if (operator !== '=' || !t.isMemberExpression(memberExpression)) {
                  return
                }
                for (const object of Object.keys(opts)) {
                  if (!t.isIdentifier(memberExpression.object, { name: object })) {
                    continue
                  }
                  for (const property of Object.keys(opts[object])) {
                    if (!t.isIdentifier(memberExpression.property, { name: property })) {
                      continue
                    }
                    const [to, ...aliases] = [].concat(opts[object][property])
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
            }
          })
        }
      }
    }
  }
}
