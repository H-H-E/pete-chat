import Dexie, { BulkError } from 'dexie';
import { ZodObject } from 'zod';

import { nanoid } from '@/utils/uuid';

import { BrowserDB, BrowserDBSchema, browserDB } from './db';

export class BaseModel<N extends keyof BrowserDBSchema = any, T = BrowserDBSchema[N]['table']> {
  protected readonly db: BrowserDB;
  private readonly schema: ZodObject<any>;
  private readonly _tableName: keyof BrowserDBSchema;

  constructor(table: N, schema: ZodObject<any>, db = browserDB) {
    this.db = db;
    this.schema = schema;
    this._tableName = table;
  }

  get table() {
    return this.db[this._tableName] as Dexie.Table<T, any>;
  }

  protected async _add<T = BrowserDBSchema[N]['model']>(
    data: T,
    id: string | number = nanoid(),
    primaryKey: string = 'id',
  ): Promise<{ id: any }> {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw new TypeError(`Failed to create new record. Error: ${result.error}`);
    }

    const record: any = {
      ...result.data,
      createdAt: Date.now(),
      [primaryKey]: id,
      updatedAt: Date.now(),
    };

    const newId = await this.db[this._tableName].add(record);
    return { id: newId };
  }

  protected async _update(id: string, data: Partial<T>): Promise<{ success: number }> {
    const keys = Object.keys(data);
    const partialSchema = this.schema.pick(Object.fromEntries(keys.map((key) => [key, true])));

    const result = partialSchema.safeParse(data);
    if (!result.success) {
      throw new TypeError(`Failed to update the record:${id}. Error: ${result.error}`);
    }

    const success = await this.table.update(id, { ...data, updatedAt: Date.now() });
    return { success };
  }

  protected async _delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  protected async _bulkAdd<T = BrowserDBSchema[N]['model']>(
    dataArray: T[],
    options: {
      createWithNewId?: boolean;
      idGenerator?: () => string;
    } = {},
  ): Promise<{ added: number; ids: string[]; }> {
    const { idGenerator = nanoid, createWithNewId = false } = options;
    const validatedData: any[] = [];
    const ids: string[] = [];

    for (const data of dataArray) {
      const result = this.schema.safeParse(data);
      if (result.success) {
        const item = result.data;
        const autoId = idGenerator();
        const id = createWithNewId ? autoId : item.id ?? autoId;
        validatedData.push({ ...item, id, createdAt: Date.now(), updatedAt: Date.now() });
        ids.push(id);
      } else {
        throw new TypeError(`Failed to validate data for bulk add. Error: ${result.error}`);
      }
    }

    await this.table.bulkAdd(validatedData);
    return { added: validatedData.length, ids };
  }

  protected async _bulkDelete(ids: string[]): Promise<void> {
    await this.table.bulkDelete(ids);
  }

  protected async _clear(): Promise<void> {
    await this.table.clear();
  }
}