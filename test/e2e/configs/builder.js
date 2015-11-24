// Create a function which checks for potential given explicit target.
let determineTarget = function (argv) {
  let target = argv.target || 'http://localhost:3333';
  if (!/^https?/.test(target)) {
    target = `http://${target}`;
  }
  return target;
};

export let protractorCfgBuilder = function (browserName, argv) {
  let remote = argv.remote || false,
    baseArgs = [
      "--baseUrl",
      determineTarget(argv)
    ];

  // Note: If a remote target was configured, it will be added to the list of arguments forwarded to Protractor to have access to the argument from within files called by it.
  // This is required, since we have to use a multi-process approach here due to a missing public API of Protractor. We're using the fact that protractor simply ignores any
  // parameters it does not understand, instead of wiping them out.
  if (remote) {
    if (!/^https?/.test(remote)) {
      remote = `http://${remote}`;
    }
    baseArgs.push('--remote', remote);
  }

  return {
    configFile: `test/e2e/configs/${browserName}.js`,
    args: baseArgs
  };
};
