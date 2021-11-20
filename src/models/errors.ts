export interface ISolution {
  video?: string;
  message: string;
  slug?: string;
  gif: string;
}

export interface IError extends TypeError {
  status: number;
  type:
    | 'validation-error'
    | 'not-found-error'
    | 'compiler-error'
    | 'testing-error'
    | 'auth-error'
    | 'internal-error';
  slug: string;
  video?: string;
  message: string;
  gif?: string;
}
