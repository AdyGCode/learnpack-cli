declare const _default: {
  login: (identification: string, password: string) => Promise<any>;
  publish: (config: any) => Promise<any>;
  update: (config: any) => Promise<any>;
  getPackage: (slug: string) => Promise<any>;
  getLangs: () => Promise<any>;
  getAllPackages: ({
    lang,
    slug,
  }: {
    lang?: string | undefined;
    slug?: string | undefined;
  }) => Promise<any>;
};
export default _default;
