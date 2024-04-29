import prisma from '@/libs/prisma/prisma';
import { GlobalSettings } from '@/types/settings';
import { DeepPartial } from 'utility-types';
import { Prisma, File, Message, Plugin, Session, SessionGroup, Topic, User, Settings } from '@prisma/client';

export const UserModel = {
  async getUser(): Promise<User | null> {
    return prisma.user.findFirst();
  },

  async createUser(data: Omit<User, 'id'> & { id: string }): Promise<User> {
    return prisma.user.create({ data });
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  },

  async updateSettings(settings: DeepPartial<GlobalSettings>) {
    const user = await this.getUser();
    if (!user) throw new Error('User not found');
    if (!settings) throw new Error('User settings not found');
    return prisma.user.update({ 
      where: { id: user.id },
      data: {
        settings: {
          update: {
            ...settings,
            defaultAgent: settings.defaultAgent as string,
            languageModel: settings.languageModel as string,
            tts: settings.tts as string,
          },
        },
      },
    });
  },

  async resetSettings() {
    const user = await this.getUser();
    if (!user) throw new Error('User not found');
    return prisma.user.update({ 
      where: { id: user.id },
      data: { avatar: undefined, settings: undefined },
    });
  },

  async updateAvatar(avatar: string) {
    const user = await this.getUser();
    if (!user) throw new Error('User not found');
    return prisma.user.update({ where: { id: user.id }, data: { avatar } });
  },
};

export const SessionModel = {
  async createSession(data: Omit<Session, 'id'> & { id: string }): Promise<Session> {
    return prisma.session.create({ data });
  },

  async getSessionById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { id } });
  },

  async updateSession(id: string, data: Partial<Session>): Promise<Session> {
    return prisma.session.update({ where: { id }, data });
  },

  async deleteSession(id: string): Promise<Session> {
    return prisma.session.delete({ where: { id } });
  },
};

export const MessageModel = {
  async createMessage(data: Omit<Message, 'id'> & { id: string }): Promise<Message> {
    return prisma.message.create({ data });
  },

  async getMessageById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({ where: { id } });
  },

  async updateMessage(id: string, data: Partial<Message>): Promise<Message> {
    return prisma.message.update({ where: { id }, data });
  },

  async deleteMessage(id: string): Promise<Message> {
    return prisma.message.delete({ where: { id } });
  },
};

export const TopicModel = {
  async createTopic(data: Omit<Topic, 'id'> & { id: string }): Promise<Topic> {
    return prisma.topic.create({ data });
  },

  async getTopicById(id: string): Promise<Topic | null> {
    return prisma.topic.findUnique({ where: { id } });
  },

  async updateTopic(id: string, data: Partial<Topic>): Promise<Topic> {
    return prisma.topic.update({ where: { id }, data });
  },

  async deleteTopic(id: string): Promise<Topic> {
    return prisma.topic.delete({ where: { id } });
  },
};

export const SessionGroupModel = {
  async createSessionGroup(data: Omit<SessionGroup, 'id'> & { id: string }): Promise<SessionGroup> {
    return prisma.sessionGroup.create({ data });
  },

  async getSessionGroupById(id: string): Promise<SessionGroup | null> {
    return prisma.sessionGroup.findUnique({ where: { id } });
  },

  async updateSessionGroup(id: string, data: Partial<SessionGroup>): Promise<SessionGroup> {
    return prisma.sessionGroup.update({ where: { id }, data });
  },

  async deleteSessionGroup(id: string): Promise<SessionGroup> {
    return prisma.sessionGroup.delete({ where: { id } });
  },
};

export const PluginModel = {
  async createPlugin(data: Omit<Plugin, 'id'> & { id: string }): Promise<Plugin> {
    return prisma.plugin.create({ data: data as Prisma.PluginCreateInput });
  },

  async getPluginById(identifier: string): Promise<Plugin | null> {
    return prisma.plugin.findUnique({ where: { identifier } });
  },

  async updatePlugin(identifier: string, data: Prisma.PluginUpdateInput): Promise<Plugin> {
    return prisma.plugin.update({ where: { identifier }, data });
  },

  async deletePlugin(identifier: string): Promise<Plugin> {
    return prisma.plugin.delete({ where: { identifier } });
  },
};

export const FileModel = {
  async createFile(data: Omit<File, 'id'> & { id: string }): Promise<File> {
    return prisma.file.create({ data });
  },

  async getFileById(id: string): Promise<File | null> {
    return prisma.file.findUnique({ where: { id } });
  },

  async updateFile(id: string, data: Partial<File>): Promise<File> {
    return prisma.file.update({ where: { id }, data });
  },

  async deleteFile(id: string): Promise<File> {
    return prisma.file.delete({ where: { id } });
  },
};