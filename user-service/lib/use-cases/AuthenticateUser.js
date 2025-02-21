export default async (accessToken, { accessTokenManager, userRepository }) => {
  if (!accessToken) {
    throw Object.assign(new Error("unauthorized, no access token"), {
      statusCode: 401,
    });
  }
  const decoded = accessTokenManager.decode(accessToken);

  const user = await userRepository.findByEmail(decoded.email);
  if (!user) {
    throw Object.assign(new Error("user not found."), { statusCode: 404 });
  }

  return decoded;
};
