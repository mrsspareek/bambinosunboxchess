import { randomUUID } from 'node:crypto';
import { ZingLaunchRecord } from '../../types/zing';
import { readJsonCollection, updateJsonCollection } from './jsonStore';

const FILE_NAME = 'zing-launches.json';

type NewLaunch = Omit<ZingLaunchRecord, 'id' | 'createdAt'>;

export async function createLaunch(input: NewLaunch): Promise<ZingLaunchRecord> {
  const launch: ZingLaunchRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  return updateJsonCollection<ZingLaunchRecord, ZingLaunchRecord>(FILE_NAME, (launches) => ({
    items: [launch, ...launches].slice(0, 10000),
    result: launch
  }));
}

export async function getLaunch(launchId: string): Promise<ZingLaunchRecord | null> {
  const launches = await readJsonCollection<ZingLaunchRecord>(FILE_NAME);
  return launches.find((launch) => launch.id === launchId) || null;
}
