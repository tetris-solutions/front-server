export function forgetError (tree) {
  tree.unset('error')
  tree.commit()
}
