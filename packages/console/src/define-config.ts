export interface Config {
  cliEntry: {
    /**
     * Entry file by each environment
     * @see process.env.NODE_ENV
     */
    [NODE_ENV: string]: string | undefined;
    /**
     * Fallback to `default` if NODE_ENV doesn't match specific file.
     * @see process.env.NODE_ENV
     */
    default?: string;
  };
}

export const defineConfig = (config: Config) => config;
