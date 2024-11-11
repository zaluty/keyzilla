// get the versioon of the package.json stimulates the user basic set of commands
import pkg from '../../package.json';
export async function Version() {
  const currentVersion = pkg.version;
  const latestVersion = await fetchLatestVersion();
  const isOutdated = currentVersion !== latestVersion;
  if (isOutdated) {
    console.log(`Your version of Keyzilla is outdated. The latest version is ${latestVersion}.`);
  } else {
    console.log(`Your version of Keyzilla is up to date. The latest version is ${latestVersion}.`);
  }
}

async function fetchLatestVersion() {
  const response = await fetch('https://registry.npmjs.org/keyzilla');
  const data = await response.json();
  return data['dist-tags'].latest;
}

