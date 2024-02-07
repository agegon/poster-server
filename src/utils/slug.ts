export const slugify = (title: string): string => {
  const strTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/\s/g, '-');
  return strTitle.substring(0, 30) + '-' + Math.ceil(Math.random() * (10 ^ 5));
};
