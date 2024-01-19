declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            DatabaseURL: string;
        }
    }
}
export { };