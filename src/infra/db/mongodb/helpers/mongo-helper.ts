import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    if (!this.client?.isConnected()) {
      this.uri = uri
      this.client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

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
