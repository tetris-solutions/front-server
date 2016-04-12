import messages from '../messages'

export default ({params: {locale}}, res) => {
  if (!messages[locale]) return res.status(404).send({message: 'Locale not avaible'})

  res.json({
    locales: locale,
    messages: messages[locale]
  })
}
