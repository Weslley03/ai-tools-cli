import util from "node:util"

export function serializeError(err: unknown) {
  return util.inspect(err, {
    depth: null,
    colors: false,
    maxArrayLength: null
  })
}