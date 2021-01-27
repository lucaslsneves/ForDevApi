import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string):Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name:string): Collection {
    return this.client.db().collection(name)
  },

  // Change the "_id" returned from Mongodb to "id", understood by models
  map (data: any): any {
    const { _id, ...dataWithNoId } = data
    return {
      id: _id,
      ...dataWithNoId
    }
  }
}
