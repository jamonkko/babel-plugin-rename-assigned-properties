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
                if (path.node.operator !== '=' || !t.isMemberExpression(path.node.left)) {
                  return
                }
                for (const name of Object.keys(opts)) {
                  if (!t.isIdentifier(path.node.left.object, { name: 'global' })
                    || !t.isIdentifier(path.node.left.property, { name })) {
                    continue
                  }
                  const [to, ...aliases] = [].concat(opts[name])
                  const renamedAssignment = buildPropertyAssignment('global', to, path.node.right)
                  const chainedAliasAssignments = aliases.reduce(
                    (chained, alias) =>
                      buildPropertyAssignment('global', alias, chained),
                    renamedAssignment
                  )
                  path.replaceWith(t.expressionStatement(chainedAliasAssignments))
                }
              }
            }
          })
        }
      }
    }
  }
}
