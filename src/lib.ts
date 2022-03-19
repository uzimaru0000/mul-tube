export const validator = (str: string) =>
  /https:\/\/(www.)?youtube\.com\/watch\?v=\S{11}/.test(str);

export const getVideoId = (urlStr: string) => {
  const url = new URL(urlStr);
  return url.searchParams.get('v');
};

export const thumbnailUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
