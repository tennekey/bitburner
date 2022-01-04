# Bitburner scripts collection

Welcome to my log of [Bitburner](https://danielyxie.github.io/bitburner/) scripts. They are written using the in-game language of NetscriptJS, which is a mutation of Javascript.

If you want to play the game itself - click on the name above.

## Requirements

The script has been modified to be able to start on 8 GB (the default starting RAM for a player) on the `home` server. Obviously, when you expand the memory available, you'll get extra perks - being able to buy and manage player-owned servers, as well as using spare RAM to do actions.

The script can be slow to get going, but it'll get there eventually. Getting access to more port hackers will improve the performance.

## Installation

1. Create a new script called `start.js` by issuing the following command: `nano start.js`. **Note**: Make sure you're on your home server (if you're not you can quickly go home by running `home` in the console).
2. Paste the following content:

```javascript
export async function main(ns) {
  if (ns.getHostname() !== "home") {
    throw new Exception("Run the script from home");
  }

  await ns.wget(
    `https://raw.githubusercontent.com/tennekey/bitburner/master/src/init.js?ts=${new Date().getTime()}`,
    "init.js"
  );
  ns.spawn("init.js", 1);
}
```

3. Exit the script editor and run the following in the console: `run start.js`
