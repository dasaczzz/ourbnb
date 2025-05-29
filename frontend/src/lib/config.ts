interface Config {
  maps_api: string | undefined
}

const config: Config = {
  maps_api: import.meta.env.VITE_MAPS_API,
}

export default config
