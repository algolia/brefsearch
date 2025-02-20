import path from 'node:path';
import { _, pMap } from 'golgoth';
import {
  absolute,
  consoleInfo,
  consoleSuccess,
  gitRoot,
  glob,
  readJson,
  run,
  writeJson,
} from 'firost';

const dependencyHash = {
  firost: null,
  gilmore: null,
  golgoth: null,
  imoen: null,
  pietro: null,
};

// If specific modules to update have been passed,
// we remove the others from list
const inputDependencies = _.slice(process.argv, 2);
if (!_.isEmpty(inputDependencies)) {
  const moduleNames = _.keys(dependencyHash);
  _.each(moduleNames, (moduleName) => {
    if (!_.includes(inputDependencies, moduleName)) {
      delete dependencyHash[moduleName];
    }
  });
}

await forEachSubmodule(async (submoduleFilepath) => {
  const packageFilepath = absolute(submoduleFilepath, 'package.json');
  const packageContent = await readJson(packageFilepath);
  const dependenciesToUpdate = await forEachPotentialDependency(
    async (dependencyName) => {
      const dependencyType = findDependencyType(dependencyName, packageContent);

      // Stop if this dependency is not used in this submodule
      if (!dependencyType) {
        return false;
      }

      // If we already know the new version number for this dependency, we save it
      // back in the package.json
      const knownVersionNumber = dependencyHash[dependencyName];
      if (knownVersionNumber) {
        packageContent[dependencyType][dependencyName] = knownVersionNumber;
        await writeJson(packageContent, packageFilepath, { sort: false });
        return false;
      }

      // If we don't have the new version number yet, it means we need to rnu yarn
      // update on that dependency to know what's the latest version number. We
      // won't run that right now, we'll first wait until we have all the deps
      // that need updating, so we'll return that dependency name and type, so we
      // can handle them later
      return { dependencyName, dependencyType };
    },
  );

  if (!_.isEmpty(dependenciesToUpdate)) {
    const arrayOfDependencies = _.chain(dependenciesToUpdate)
      .map('dependencyName')
      .join(' ')
      .value();
    consoleInfo(`Found dependencies to update: ${arrayOfDependencies}`);
    await run(`yarn up --exact ${arrayOfDependencies}`, {
      cwd: submoduleFilepath,
      stdout: false,
    });

    // We now check the correct version numbers, and save them on the shared
    // hash
    const newPackageContent = await readJson(packageFilepath);
    _.each(dependenciesToUpdate, ({ dependencyName, dependencyType }) => {
      const dependencyVersion =
        newPackageContent[dependencyType][dependencyName];
      dependencyHash[dependencyName] = dependencyVersion;
    });
  }
});

// now that we updated all package.json, we run a last yarn install at the root
consoleInfo('Final yarn install');
await run('yarn install', {
  cwd: gitRoot(),
  stdout: false,
});
consoleSuccess('All dependencies updated');

/**
 * Returns the type of dependencies (dependencies or devDependencies)
 * @param {string} dependencyName Name of the dependency to check
 * @param {object} packageContent Content of the package.json
 * @returns {string} Type of dependency, or false if not found
 */
function findDependencyType(dependencyName, packageContent) {
  if (_.get(packageContent, `devDependencies.${dependencyName}`)) {
    return 'devDependencies';
  }
  if (_.get(packageContent, `dependencies.${dependencyName}`)) {
    return 'dependencies';
  }
  return false;
}

/**
 * Iterate on each submodule, and call callback with the path to the submodule
 * @param {Function} callback Method to call with the path to the submodule
 **/
async function forEachSubmodule(callback) {
  const submodulePackages = await glob('*/package.json', {
    cwd: absolute('<gitRoot>/modules'),
  });

  const concurrency = 1;
  await pMap(
    submodulePackages,
    async (filepath) => {
      const dirname = path.dirname(filepath);
      await callback(dirname);
    },
    { concurrency },
  );
}
/**
 * Iterate on each potential dependency to update, and return the compacted
 * array of return values
 * @param {Function} callback Method to call with the name of the dependency
 * @returns {Array} Array of object of dependencies to update
 */
async function forEachPotentialDependency(callback) {
  const concurrency = 1;
  const moduleNames = _.keys(dependencyHash);
  const rawResult = await pMap(moduleNames, callback, { concurrency });
  return _.compact(rawResult);
}
