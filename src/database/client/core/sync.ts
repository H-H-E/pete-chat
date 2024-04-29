import { PrismaClient } from '@prisma/client';
import { User, Settings, Session, Message, Topic } from '@prisma/client';

import { browserDB } from '@/database/client/core/db';

import Debug from 'debug';

import {
  OnSyncEvent,
  OnSyncStatusChange,
  PeerSyncStatus,
  StartDataSyncParams,
} from '@/types/sync';
import { auth } from '@/libs/next-auth';

const LOG_NAME_SPACE = 'DataSync';

class DataSync {
  private prisma: PrismaClient;
  private logger = Debug(LOG_NAME_SPACE);
  private currentUserId: string | null = null;

  constructor() {
    this.prisma = new PrismaClient();
  }

  startDataSync = async (params: StartDataSyncParams) => {
    const authSession = await auth();
    if (!authSession || !authSession.user?.id) {
      throw new Error('User not authenticated');
    }
    this.currentUserId = authSession.user.id;
    await this.connect(params);
  };

  connect = async (params: StartDataSyncParams) => {
    const { onSyncStatusChange } = params;

    await this.initPrisma();
    this.logger('[Prisma] Connected to PostgreSQL database');

    onSyncStatusChange?.(PeerSyncStatus.Syncing);
    await this.syncDataFromPostgres();
    onSyncStatusChange?.(PeerSyncStatus.Synced);
  };

  private initPrisma = async () => {
    await this.prisma.$connect();
  };

  private async cleanConnection() {
    await this.prisma.$disconnect();
  }

  private syncDataFromPostgres = async () => {
    if (!this.currentUserId) return;

    const user = await this.prisma.user.findUnique({
      where: { id: this.currentUserId },
      include: {
        settings: true,
        sessions: {
          include: {
            messages: true,
            topics: true,
          },
        },
      },
    });
    // everything is screwed up, but i just want to commit 
    // TODO: fix this trash.
    /*
      await browserDB.users.put(user);
      await Promise.all(user.sessions.map(session => browserDB.sessions.put(session)));
      await Promise.all(user.sessions.flatMap(session => session.messages.map(message => browserDB.messages.put(message))));
      await Promise.all(user.sessions.flatMap(session => session.topics.map(topic => browserDB.topics.put(topic))));
    */
  };
}

export const dataSync = new DataSync();