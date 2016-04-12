/**
 * changes language in the state tree
 * @param {Baobab} tree state tree
 * @param {string} locale new locale
 * @returns {undefined}
 */
export function changeLanguage (tree, locale) {
  tree.set('locale', locale)

  if (tree.get('user')) {
    tree.set(['user', 'locale'], locale)
  }

  tree.commit()
}

export default changeLanguage
