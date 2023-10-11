<p align="center">
<picture>
    <source srcset="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" media="(prefers-color-scheme: dark)">
    <img src="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" alt="Subsquid Logo">
</picture>
</p>

[![docs.rs](https://docs.rs/leptos/badge.svg)](https://docs.subsquid.io/)
[![Discord](https://img.shields.io/discord/1031524867910148188?color=%237289DA&label=discord)](https://discord.gg/subsquid)

[Website](https://subsquid.io) | [Docs](https://docs.subsquid.io/) | [Discord](https://discord.gg/subsquid)

[Subsquid Network FAQ](https://docs.subsquid.io/subsquid-network/)

# Deploy a triple processor squid

This is a quest to run a squid with three processors. Here is how to run it:

### I. Install dependencies: Node.js, Docker, Git.

<details>
<summary>On Windows</summary>

1. Enable [Hyper-V](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
2. Install [Docker for Windows](https://docs.docker.com/desktop/install/windows-install/).
3. Install NodeJS LTS using the [official installer](https://nodejs.org/en/download).
4. Install [Git for Windows](https://git-scm.com/download/win).

In all installs it is OK to leave all the options at their default values. You will need a terminal to complete this tutorial - [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) bash is the preferred option.

</details>
<details>
<summary>On Mac</summary>

1. Install [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/).
2. Install Git using the [installer](https://sourceforge.net/projects/git-osx-installer/) or by [other means](https://git-scm.com/download/mac).
3. Install NodeJS LTS using the [official installer](https://nodejs.org/en/download).

We recommend configuring NodeJS to install global packages to a folder owned by an unprivileged account. Create the folder by running

```bash
mkdir ~/global-node-packages
```

then configure NodeJS to use it

```bash
npm config set prefix ~/global-node-packages
```

Make sure that the folder `~/global-node-packages/bin` is in `PATH`. That allows running globally installed NodeJS executables from any terminal. Here is a one-liner that detects your shell and takes care of setting `PATH`:

```
CURSHELL=`ps -hp $$ | awk '{print $5}'`; case `basename $CURSHELL` in 'bash') DEST="$HOME/.bash_profile";; 'zsh') DEST="$HOME/.zshenv";; esac; echo 'export PATH="${HOME}/global-node-packages/bin:$PATH"' >> "$DEST"
```

Alternatively you can add the following line to `~/.zshenv` (if you are using zsh) or `~/.bash_profile` (if you are using bash) manually:

```
export PATH="${HOME}/global-node-packages/bin:$PATH"
```

Re-open the terminal to apply the changes.

</details>
<details>
<summary>On Linux</summary>

Install [NodeJS (v16 or newer)](https://nodejs.org/en/download/package-manager), Git and Docker using your distro's package manager.

We recommend configuring NodeJS to install global packages to a folder owned by an unprivileged account. Create the folder by running

```bash
mkdir ~/global-node-packages
```

then configure NodeJS to use it

```bash
npm config set prefix ~/global-node-packages
```

Make sure that any executables globally installed by NodeJS are in `PATH`. That allows running them from any terminal. Open the `~/.bashrc` file in a text editor and add the following line at the end:

```
export PATH="${HOME}/global-node-packages/bin:$PATH"
```

Re-open the terminal to apply the changes.

</details>

### II. Install Subsquid CLI

Open a terminal and run

```bash
npm install --global @subsquid/cli@latest
```

This adds the [`sqd` command](/squid-cli). Verify that the installation was successful by running

```bash
sqd --version
```

A healthy response should look similar to

```
@subsquid/cli/2.5.0 linux-x64 node-v20.5.1
```

### III. Run the squid

1. Open a terminal and run the following commands to create the squid and enter its folder:

   ```bash
   sqd init my-triple-proc-squid -t https://github.com/subsquid-quests/triple-chain-squid
   ```

   ```bash
   cd my-triple-proc-squid
   ```

   You can replace `my-triple-proc-squid` with any name you choose for your squid. If a squid with that name already exists in [Aquarium](https://docs.subsquid.io/deploy-squid/), the first command will throw an error; if that happens simply think of another name and repeat the commands.

2. Press "Get Key" button in the quest card to obtain the `tripleProc.key` key file. Save it to the `./query-gateway/keys` subfolder of the squid folder. The file will be used by the query gateway container.

3. The template squid uses a PostgreSQL database and a query gateway. Start Docker containers that run these with

   ```bash
   sqd up
   ```

   Wait for about a minute before proceeding to the next step.

   If you get an error message about `unknown shorthand flag: 'd' in -d`, that means that you're using an old version of `docker` that does not support the `compose` command yet. Update Docker or edit the `commands.json` file as follows:

   ```diff
            "up": {
            "deps": ["check-key"],
            "description": "Start a PG database",
   -        "cmd": ["docker", "compose", "up", "-d"]
   +        "cmd": ["docker-compose", "up", "-d"]
          },
          "down": {
            "description": "Drop a PG database",
   -        "cmd": ["docker", "compose", "down"]
   +        "cmd": ["docker-compose", "down"]
          },
   ```

4. Prepare the squid for running by installing dependencies, building the source code and creating all the necessary database tables:
   ```bash
   npm ci
   sqd build
   sqd migration:apply
   ```
5. Start your squid with
   ```bash
   sqd run .
   ```
   The command should output lines like these:
   ```
   polygon-processor 2023-10-11T14:11:48.497Z INFO sqd:processor 39260039 / 48591529, rate: 35762 blocks/sec, mapping: 1093 blocks/sec, 74 items/sec, eta: 5m
   bsc-processor 2023-10-11T14:11:53.411Z INFO sqd:processor processing blocks from 22511875
   polygon-processor 2023-10-11T14:11:53.498Z INFO sqd:processor 39334579 / 48591529, rate: 28466 blocks/sec, mapping: 672 blocks/sec, 76 items/sec, eta: 6m
   bsc-processor 2023-10-11T14:11:54.485Z INFO sqd:processor using archive data source
   bsc-processor 2023-10-11T14:11:54.566Z INFO sqd:processor prometheus metrics are served at port 3000
   eth-processor 2023-10-11T14:11:54.315Z INFO sqd:processor processing blocks from 10325008
   eth-processor 2023-10-11T14:11:55.387Z INFO sqd:processor using archive data source
   eth-processor 2023-10-11T14:11:55.463Z INFO sqd:processor prometheus metrics are served at port 3000
   eth-processor 2023-10-11T14:11:56.477Z INFO sqd:processor 10386679 / 18327456, rate: 56699 blocks/sec, mapping: 517 blocks/sec, 25 items/sec, eta: 3m
   polygon-processor 2023-10-11T14:11:58.499Z INFO sqd:processor 39731399 / 48591529, rate: 36941 blocks/sec, mapping: 1240 blocks/sec, 82 items/sec, eta: 4m
   eth-processor 2023-10-11T14:12:01.478Z INFO sqd:processor 10452079 / 18327456, rate: 35800 blocks/sec, mapping: 647 blocks/sec, 45 items/sec, eta: 4m
   polygon-processor 2023-10-11T14:12:03.499Z INFO sqd:processor 40002619 / 48591529, rate: 39514 blocks/sec, mapping: 1435 blocks/sec, 84 items/sec, eta: 4m
   eth-processor 2023-10-11T14:12:06.479Z INFO sqd:processor 10570119 / 18327456, rate: 26786 blocks/sec, mapping: 1121 blocks/sec, 86 items/sec, eta: 5m
   polygon-processor 2023-10-11T14:12:08.499Z INFO sqd:processor 40140799 / 48591529, rate: 39473 blocks/sec, mapping: 1181 blocks/sec, 91 items/sec, eta: 4m
   eth-processor 2023-10-11T14:12:11.480Z INFO sqd:processor 10733359 / 18327456, rate: 27014 blocks/sec, mapping: 1982 blocks/sec, 130 items/sec, eta: 5m
   eth-processor 2023-10-11T14:12:16.482Z INFO sqd:processor 10885299 / 18327456, rate: 28836 blocks/sec, mapping: 376 blocks/sec, 18 items/sec, eta: 5m
   ```
   The squid should sync in 30-35 minutes. When it's done, stop it with Ctrl-C, then stop and remove the auxiliary containers with
   ```bash
   sqd down
   ```

# Quest Info

| Category         | Skill Level                          | Time required (minutes) | Max Participants | Reward                              | Status |
| ---------------- | ------------------------------------ | ----------------------- | ---------------- | ----------------------------------- | ------ |
| Squid Deployment | $\textcolor{green}{\textsf{Simple}}$ | ~40                     | -                | $\textcolor{red}{\textsf{750tSQD}}$ | open   |

# Acceptance critera

Sync this squid using the key from the quest card. The syncing progress is tracked by the amount of data the squid has retrieved from [Subsquid Network](https://docs.subsquid.io/subsquid-network).

# About this squid

This [squid](https://docs.subsquid.io/) captures USDC Transfer events on ETH, BSC and Polygon, stores them in the same database and serves the data over a common GraphQL API.

Data ingester ("processor") code for each network is located at the corresponding `src/` subdirectory: `src/eth`, `src/bsc` or `src/polygon`. The scripts file `commands.json` contains commands for running each processor (`process:eth`, `process:bsc` and `process:polygon` correspondingly). GraphQL server runs as a separate process started by `sqd serve`. You can also use `sqd run` to run all the services at once.

The squid uses [Subsquid Network](https://docs.subsquid.io/subsquid-network) as its primary data source.
