import { ObjectId } from 'mongodb';


export class DefaultEntity {
  _id: ObjectId;
  createdAt?: string;
  updatedAt?: string;
}
