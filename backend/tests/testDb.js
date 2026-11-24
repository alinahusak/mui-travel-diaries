// The API tests drop the whole database they connect to, so they must never
// run against real data. They ignore MONGODB_URI on purpose.
const DEFAULT_URI = "mongodb://127.0.0.1:27017/travel-diaries-test";

export const assertTestDb = (name) => {
  if (!/-test$/.test(name || "")) {
    throw new Error(
      `Refusing to run tests: database "${name || "(not set)"}" will be dropped, ` +
        'so its name must end with "-test". Check TEST_MONGODB_URI.'
    );
  }
};

export const getTestDbUri = (env = process.env) => {
  const uri = env.TEST_MONGODB_URI || DEFAULT_URI;
  // mongodb[+srv]://[credentials@]host[,host...]/<database>[?options]
  const match = /^mongodb(?:\+srv)?:\/\/[^/?]+(?:\/([^?]*))?/.exec(uri);
  assertTestDb(match?.[1] && decodeURIComponent(match[1]));
  return uri;
};
