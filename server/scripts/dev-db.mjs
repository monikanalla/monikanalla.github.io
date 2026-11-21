/**
 * Development database helper.
 *
 * 1. If something is already serving MongoDB on 127.0.0.1:27017, reuse it.
 * 2. Otherwise start a bundled mongod (mongodb-memory-server) with its data
 *    persisted in server/.data/mongo, so seeded data survives restarts.
 * 3. If that is unavailable, fall back to a `mongod` on the PATH and finally
 *    print instructions instead of failing silently.
 */
import net from 'node:net';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 27017;
const DB_PATH = path.resolve('server/.data/mongo');

function portOpen() {
  return new Promise((resolve) => {
    const socket = net.connect({ port: PORT, host: '127.0.0.1' });
    const done = (value) => {
      socket.destroy();
      resolve(value);
    };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    setTimeout(() => done(false), 1000);
  });
}

function help(message) {
  console.log(`\n[db] ${message}`);
  console.log('[db] Options:');
  console.log('     1. mongod running on 127.0.0.1:27017');
  console.log('     2. an Atlas connection string in server/.env → MONGODB_URI');
  console.log('     3. npm install (installs mongodb-memory-server) then re-run npm run dev:db\n');
}

async function main() {
  if (await portOpen()) {
    console.log(`[db] MongoDB already available on 127.0.0.1:${PORT}`);
    return;
  }

  mkdirSync(DB_PATH, { recursive: true });

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const server = await MongoMemoryServer.create({
      instance: { port: PORT, dbPath: DB_PATH, storageEngine: 'wiredTiger' },
    });
    console.log(`[db] mongod ready at ${server.getUri()}`);
    console.log(`[db] data directory: ${DB_PATH}`);

    const stop = async () => {
      await server.stop({ doCleanup: false });
      process.exit(0);
    };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);

    await new Promise(() => {});
    return;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.log(`[db] bundled mongod unavailable (${reason.split('\n')[0]})`);
  }

  if (process.platform !== 'win32') {
    const child = spawn('mongod', ['--dbpath', DB_PATH, '--port', String(PORT), '--bind_ip', '127.0.0.1'], {
      stdio: 'inherit',
    });
    child.on('error', () => help('No `mongod` found on this machine.'));
    child.on('exit', (code) => {
      if (code) help(`mongod exited with code ${code}.`);
    });
    return;
  }

  help('No MongoDB available.');
}

main().catch((error) => {
  console.error('[db]', error);
  process.exit(1);
});
