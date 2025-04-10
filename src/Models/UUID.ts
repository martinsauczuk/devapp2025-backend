export type UUID = string;

export type WithId<T> = T & { _id: UUID };
