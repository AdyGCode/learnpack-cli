import {prompt} from 'enquirer'
import Console from '../utils/console'
import api from '../utils/api'
// import fetch from 'node-fetch'

export const askPackage = async () => {
  Console.info('No package was specified')
  const languages = await api.getLangs()

  return new Promise((resolve, reject) => {
    if (languages.length === 0) {
      // reject(new Error('No categories available'))
      reject('No categories available')
      // return null;
    }

    // let packages = []
    prompt([
      {
        type: 'select',
        name: 'lang',
        message: 'What language do you want to practice?',
        choices: languages.map(l => ({message: l.title, name: l.slug})),
      },
    ])
    .then(({lang}) => {
      return (async () => {
        const response = await api.getAllPackages({lang})
        const packages = response.results
        if (packages.length === 0) {
          const error = new Error(`No packages found for language ${lang}`)
          Console.error(error)
          return error
        }

        return prompt([
          {
            type: 'select',
            name: 'pack',
            message: 'Choose one of the packages available',
            choices: packages.map(l => ({
              message: `${l.title}, difficulty: ${l.difficulty}, downloads: ${
                l.downloads
              } ${
                l.skills.length > 0 ? `(Skills: ${l.skills.join(',')})` : ''
              }`,
              name: l.slug,
            })),
          },
        ])
      })()
    })
    .then(resp => {
      if (!resp)
        reject(resp.message || resp)
      else
        resolve(resp.pack)
    })
    .catch(error => {
      Console.error(error.message || error)
    })
  })
}

export default {askPackage}
