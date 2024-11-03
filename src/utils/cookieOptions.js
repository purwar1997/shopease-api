export const setCookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const clearCookieOptions = {
  httpOnly: true,
};
