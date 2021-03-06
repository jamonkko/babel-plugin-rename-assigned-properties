/*!
 * @license
 * babel-plugin-rename-assigned-properties v1.0.0 (https://github.com/jamonkko/babel-plugin-rename-assigned-properties#readme)
 * Copyright 2018 Jarkko Mönkkönen <jamonkko@gmail.com>
 * Licensed under MIT
 */
export default ({ types: t }) => {
  const buildPropertyAssignment = (objName, propName, valueNode) =>
    t.assignmentExpression(
      '=',
      t.memberExpression(t.identifier(objName), t.identifier(propName)),
      valueNode
    )

  function visitAssignmentExpression (path, renames) {
    const { node: { operator, left: memberExpression, right: valueExpression } } = path
    if (operator !== '=' || !t.isMemberExpression(memberExpression)) {
      return
    }
    for (const object of Object.keys(renames)) {
      if (t.isIdentifier(memberExpression.object, { name: object })) {
        for (const property of Object.keys(renames[object])) {
          if (t.isIdentifier(memberExpression.property, { name: property })) {
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
    }
  }

  return {
    visitor: {
      AssignmentExpression (path, { opts }) {
        if (!opts.process || opts.process.indexOf('inline') !== -1) {
          visitAssignmentExpression(path, opts.renames)
        }
      },
      Program: {
        exit (program, { opts }) {
          if (opts.process && opts.process.indexOf('post') !== -1) {
            program.traverse({
              AssignmentExpression (path) {
                visitAssignmentExpression(path, opts.renames)
              }
            })
          }
        }
      }
    }
  }
}
