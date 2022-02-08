interface IAttributes {
  intro: string;
  tutorial: string;
}

export interface IFrontmatter {
  attributes?: IAttributes;
  body?: string;
  bodyBegin?: number;
  frontmatter?: string;
}
