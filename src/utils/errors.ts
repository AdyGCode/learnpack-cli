import * as fetch from 'isomorphic-fetch'
import Console from './console'

import {ISolution, IError} from '../models/errors'

let solutions: { [key: string]: ISolution } | null = null

const uknown: ISolution = {
  video: 'https://www.youtube.com/watch?v=gD1Sa99GiE4',
  message: 'Uknown internal error',
  slug: 'uknown',
  gif: 'https://github.com/breatheco-de/breathecode-cli/blob/master/docs/errors/uknown.gif?raw=true',
}

export const getSolution = (slug?: string): ISolution => {
  if (!slug) {
    Console.debug('Getting solution templates from the learnpack repository')
  } else {
    Console.debug(`Getting solution for ${slug}`, solutions)
  }

  if (!solutions) {
    Console.debug('Fetching for errors.json on github')
    fetch(
      'https://raw.githubusercontent.com/breatheco-de/breathecode-cli/master/docs/errors/errors.json',
    )
    .then((r: Response) => r.json())
    .then(function (_s: { [key: string]: ISolution }) {
      solutions = _s
    })
    return uknown
  }

  return typeof solutions[slug || ''] === 'undefined' || !slug ?
    uknown :
    solutions[slug]
}

export const ValidationError = (error: IError | string) => {
  const message: string = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 400
  _err.type = 'validation-error'

  const sol: ISolution = getSolution((error as IError).slug)
  _err.video = sol.video
  _err.gif = sol.gif
  _err.message = typeof message === 'string' ? message : sol.message
  return _err
}

export const NotFoundError = (error: IError | string) => {
  const message = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 400
  _err.type = 'not-found-error'

  const sol = getSolution((error as IError).slug)
  _err.video = sol.video
  _err.gif = sol.gif
  _err.message = typeof message === 'string' ? message : sol.message
  return _err
}

export const CompilerError = (error: IError | string) => {
  const message = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 400
  _err.type = 'compiler-error'

  const sol = getSolution((error as IError).slug)
  _err.video = sol.video
  _err.gif = sol.gif
  _err.message = typeof message === 'string' ? message : sol.message
  return _err
}

export const TestingError = (error: IError | string) => {
  const message = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 400
  _err.type = 'testing-error'
  return _err
}

export const AuthError = (error: IError | string) => {
  const message = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 403
  _err.type = 'auth-error'
  return _err
}

export const InternalError = (error: IError | string) => {
  const message = (error as IError).message || (error as string)
  const _err = new Error(message) as IError
  _err.status = 500
  _err.type = 'internal-error'

  const sol = getSolution((error as IError).slug)
  _err.video = sol.video
  _err.gif = sol.gif
  _err.message = typeof message === 'string' ? message : sol.message
  return _err
}

getSolution()
export default {
  ValidationError,
  CompilerError,
  TestingError,
  NotFoundError,
  InternalError,
  AuthError,
}
