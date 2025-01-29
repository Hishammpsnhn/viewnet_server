export default async (accessToken, { accessTokenManager, userRepository }) => {
  console.log(accessToken)
  if (!accessToken) {
    throw Object.assign(new Error("unauthorized, no access token"), {
      statusCode: 401,
    });
  }
  const decoded = accessTokenManager.decode(accessToken);
  console.log("decoded: ", decoded);
  
 

  const user = await userRepository.findByEmail(decoded.email);
  if (!user) {
    throw Object.assign(new Error("user not found."), { statusCode: 404 });
  }
  // if (user.isBlock) {
  //   throw Object.assign(new Error("User is blocked."), { statusCode: 403 });
  // }

  return decoded;
};
