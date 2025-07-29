  export const secret = async (secretName: string): Promise<string> => {
    return (await Bun.file((process.env.SECRETS_DIR || '/run/secrets/') + secretName).text()).trim();
  }
