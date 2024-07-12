declare module "newspaperjs" {
  export interface Article {
    title: string;
    text: string;
    date: string;
    [key: string]: any;
  }

  export function Article(url: string): Promise<Article>;
}
