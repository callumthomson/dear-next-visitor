const secretKeys = ['openai_api_key'] as const;
type SecretKey = typeof secretKeys[number];

// const secrets: Partial<Record<SecretKey, string>> = {};
//
// export const initSecrets = async () => {
//   await Promise.all(secretKeys.map(async key => {
//     try {
//       secrets[key] = (await Bun.file((process.env.SECRETS_DIR || '/run/secrets/') + key).text()).trim();
//     } catch (err) {
//       console.warn(`Could not load '${key}' secret`)
//     }
//   }));
// }
// export const secret = async (key: SecretKey) => secrets[key];

export const secret = async (key: SecretKey) =>
  (await Bun.file((process.env.SECRETS_DIR || '/run/secrets/') + key).text()).trim();
