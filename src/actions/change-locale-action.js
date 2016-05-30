/**
 * changes language in the state tree
 * @param {Baobab} tree state tree
 * @param {string} locale new locale
 * @returns {undefined}
 */
export function changeLocaleAction (tree, locale) {
  tree.set('locale', locale)
  tree.commit()
}
