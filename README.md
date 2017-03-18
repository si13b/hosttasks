# Hostfile tasks

Block sites by editing your system's host file until you complete a set of daily tasks. This allows you to avoid distractions until you're done.

This is not designed to be a bullet proof blocking mechanism, but instead a deterrent to help you stay focused.

## Installation

	npm install -g hosttasks

## Configuring

The configuration for this tool is a simple `config.json` file whose location can be passed with the `config` option in both `reset` and `done` modes.

The `blacklist` property contains a list of sites to block until tasks are completed. The `tasks` property contains a list of tasks that require completion before unblocking.

Example config:

```
{
	"blacklist": [
		"www.randomdistractingsite.com",
		"randomdistractingsite.com",
	],
	"tasks": [
		"Reading",
		"Learn guitar",
		"Secret project"
	]
}
```

The location of the config file can be specified with the `config` option.

## Usage

NOTE: You must run hosttasks with sudo/Administrator privileges, since the hosts files on most systems is restricted. This means that you trust this program to not do *bad things* to your system. As per the LICENSE file, no warranty is provided. I recommend that you read the source code as a precaution.

### Resetting

Reset your daily tasks by running the reset command.

	hosttasks --mode reset --config myconfig.json

The suggestion is to make this an automated task by using Task Scheduler (windows) or Cron (nix).

### Completing tasks

Upon completion of tasks, you can run the following to unrestrict sites:

	hosttasks --mode done --config myconfig.json

## License
	
hosttasks is licensed under the BSD License. See LICENSE for details.
