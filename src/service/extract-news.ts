import { Article } from 'newspaperjs';

export const extractNews = async (url: string): Promise<Article> => {
  const article = await Article(url);
  return article;
};