const getNormalizedConfig = (config: string, content?: any) => {
  if (content && config === "package.json") {
    // Use the npm config key, be good citizens
    if (content.config && content.config["commit-prompt"]) {
      return content;
    }
  } else {
    // .cp.json or .cprc
    return content;
  }
};

export default getNormalizedConfig;
