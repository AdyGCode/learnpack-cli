interface IFindingOption {
  content: string;
  absUrl: string;
  mdUrl: string;
  relUrl: string;
}
interface ILinks {
  [key: string]: IFindingOption;
}
export interface IFindings {
  relativeImages?: ILinks;
  externalImages?: ILinks;
  markdownLinks?: ILinks;
  url?: ILinks;
  uploadcare?: ILinks;
}
export {};
