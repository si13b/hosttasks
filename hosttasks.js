
const fs = require('fs');
const readline = require('readline');
const hostile = require('hostile');

// Read the config from the specified file, parse and validate.
const getConfig = path => {
	const rawContents = fs.readFileSync(path, {encoding: 'UTF-8'});
	const jsonContents = JSON.parse(rawContents);
	
	// Validate
	if (!jsonContents.blacklist || !jsonContents.blacklist.length) throw Error(`No blacklist defined in config ${JSON.stringify(jsonContents)}`);
	if (!jsonContents.tasks || !jsonContents.tasks.length) throw Error(`No tasks defined in config ${JSON.stringify(jsonContents)}`);
	
	return jsonContents;
};

// Reset tasks, add blacklist to host files to prevent distractions.
const reset = config => {
	console.log('');
	console.log('# Resetting tasks');
	console.log('');
	
	blockSites(config.blacklist)
		.then(resetComplete)
		.catch(logError(null));
};

const resetComplete = () => {
	console.log('');
	console.log('Sites blocked, waiting for tasks.');
	console.log('');
	setTimeout(() => process.exit(0), 2000);
};

// Add a single site to the hosts file (promisified)
const blockSite = site => {
	return new Promise((resolve, reject) => {
		hostile.set('127.0.0.1', site, function(err) {
		  if (err) {
		    reject(err); // TODO only reject if proper err, not "entry not found"
		  } else {
				console.log(`* Blocked '${site}'`);
		    resolve();
		  }
		});
	});
};

// Remove a single site from the hosts file (promisified)
const unblockSite = site => {
	return new Promise((resolve, reject) => {
		hostile.remove('127.0.0.1', site, function(err) {
		  if (err) {
		    reject(err); // TODO only reject if proper err, not "entry not found"
		  } else {
				console.log(`* Unblocked '${site}'`);
		    resolve();
		  }
		});
	});
};

// Remove all site blockages from the hosts file
const siteOperations = func => sites => sites.reduce(
	(lastPromise, site) => lastPromise.then(() => func(site)),
	Promise.resolve()
);
const unblockSites = siteOperations(unblockSite);
const blockSites = siteOperations(blockSite);

// Prompt user for task completion
const question = (rl, task) => {
	return new Promise((resolve, reject) => {
		rl.question(`Have you completed '${task}' Y/N (N)? `, answer => {
			if (answer.toLowerCase() === 'y') {
				resolve();
			} else {
				reject(`The task '${task}' is not complete! Leaving sites blocked.`);
			}
		});
	});
};

const logTasksComplete = rl => () => {
	console.log('');
	console.log('All tasks complete! Sites unblocked.');
	console.log('');
	rl.close();
	process.exit(0);
};

const logError = rl => error => {
	console.log('');
	console.log(error);
	console.log('');
	if (rl) rl.close();
	setTimeout(() => process.exit(1), 2000);
};

// Tasks completed, unset host file changes.
const done = config => {
	console.log('');
	console.log('# Completing tasks');
	console.log('');
	
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	config.tasks
		.reduce((lastPromise, nextTask) => lastPromise.then(() => question(rl, nextTask)), Promise.resolve())
		.then(() => unblockSites(config.blacklist))
		.then(logTasksComplete(rl))
		.catch(logError(rl));
};

// Process entry point
const main = (mode = 'done', configPath = './config.json') => {
	if (!configPath) throw Error('No configPath was determined');
	
	const config = getConfig(configPath);
	
	if (mode === 'reset') {
		reset(config);
	} else if (mode === 'done') {
		done(config);
	} else {
		throw Error(`Expected reset|done as first argument (found: ${mode})`);
	}
};

module.exports = main;
