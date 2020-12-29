const getNormalizedConfig = (config: string, content?: any) => {
  if (content && config === "package.json") {
    // Use the npm config key, be good citizens
    if (content.config && content.config["cz-emoji"]) {
      return content;
    }
  } else {
    // .cz.json or .czrc
    return content;
  }
};

export default getNormalizedConfig;
